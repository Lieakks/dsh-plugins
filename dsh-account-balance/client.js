window.__ModuleLoader__.load({
  id: '@local/dsh-account-balance',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'account.balance';
    /** Balance is re-read on this cadence while the page is visible. */
    const REFRESH_INTERVAL_MS = 30000;
    /** Duration of the eased figure transition between two readings. */
    const TWEEN_MS = 700;
    /** How long a settled change stays on screen as an increment badge. */
    const DELTA_MS = 4200;

    const EN = {
      label: 'Account balance',
      loading: 'Balance…',
      loadingHint: 'Reading the account balance.',
      signedOut: 'Sign in',
      signedOutHint: 'Sign in from Settings → Account to show your balance.',
      failed: 'Unavailable',
      failedHint: 'The balance could not be read. Click to retry.',
      noWallet: 'No balance',
      rechargeLabel: 'Recharge',
      bonusLabel: 'Bonus',
      updatedLabel: 'Updated',
      staleHint: 'last refresh failed',
      refreshHint: 'Click to refresh',
    };

    const ZH = {
      label: '账号余额',
      loading: '余额…',
      loadingHint: '正在读取账号余额。',
      signedOut: '未登录',
      signedOutHint: '在“设置 → 账号”中登录后即可显示余额。',
      failed: '读取失败',
      failedHint: '无法读取账号余额，点击重试。',
      noWallet: '暂无余额',
      rechargeLabel: '充值',
      bonusLabel: '赠送',
      updatedLabel: '更新于',
      staleHint: '最近一次刷新失败',
      refreshHint: '点击刷新',
    };

    const SYMBOLS = { CNY: '¥', USD: '$' };
    const MINUS = '−';

    /** Render an amount the way the Platform balance card does. */
    function formatAmount(value) {
      const amount = Number(value);
      if (!Number.isFinite(amount)) return '0.00';
      const abs = Math.abs(amount);
      if (abs > 0 && abs < 0.01) return '<0.01';
      const parts = abs.toFixed(2).split('.');
      const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return (amount < 0 ? '-' : '') + whole + '.' + parts[1];
    }

    function walletAmount(wallet) {
      if (wallet === null || wallet === undefined) return 0;
      const amount = Number(wallet.balance);
      return Number.isFinite(amount) ? amount : 0;
    }

    /** Format one `AccountWallet` as `¥12.34`, keeping negative amounts readable. */
    function currencyAmount(wallet) {
      if (wallet === null || wallet === undefined) return '';
      const currency = typeof wallet.currency === 'string' ? wallet.currency : '';
      const symbol = SYMBOLS[currency] ?? (currency === '' ? '' : currency + ' ');
      const amount = Number(wallet.balance ?? Number.NaN);
      if (!Number.isFinite(amount)) return symbol + String(wallet.balance ?? '').trim();
      return amount < 0 ? MINUS + symbol + formatAmount(Math.abs(amount)) : symbol + formatAmount(amount);
    }

    /** Prefer the CNY wallet, then the first reported one. */
    function pickWallet(wallets) {
      if (!Array.isArray(wallets)) return null;
      const cny = wallets.find((wallet) => wallet !== null && typeof wallet === 'object' && wallet.currency === 'CNY');
      return cny ?? wallets[0] ?? null;
    }

    function isPositive(wallet) {
      return walletAmount(wallet) > 0;
    }

    /** Sum the recharge and bonus wallets that share one currency. */
    function totalOf(wallet, bonusWallet) {
      const base = walletAmount(wallet);
      const bonusSharesCurrency =
        wallet !== null && bonusWallet !== null && (wallet.currency || 'CNY') === (bonusWallet.currency || 'CNY');
      return base + (bonusSharesCurrency ? walletAmount(bonusWallet) : 0);
    }

    /** Minimal observable snapshot store shared by the poller and the chip. */
    function createStore(initial) {
      let state = initial;
      const listeners = new Set();
      return {
        get: () => state,
        set(next) {
          if (next === state) return;
          state = next;
          for (const listener of [...listeners]) listener(state);
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      };
    }

    /** The Host reports its release on the boot graph; fall back to the plugin version. */
    function clientVersion() {
      const boot = globalThis.__DSH_BOOT__;
      const release = boot !== null && typeof boot === 'object' ? boot.release : undefined;
      const version = release !== null && typeof release === 'object' ? release.version : undefined;
      if (typeof version === 'string' && version !== '') return version;
      if (typeof release === 'string' && release !== '') return release;
      return '1.0.0';
    }

    function prefersReducedMotion() {
      try {
        return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (error) {
        return false;
      }
    }

    /**
     * Ease a displayed figure from the previous reading to the new one, so a
     * running task's spend reads as a change rather than a jump. Reduced motion
     * jumps straight to the target.
     */
    function useEasedValue(target, durationMs) {
      const [shown, setShown] = React.useState(target);
      const shownRef = React.useRef(target);
      React.useEffect(() => {
        const from = shownRef.current;
        if (!Number.isFinite(target) || !Number.isFinite(from) || from === target || durationMs <= 0) {
          shownRef.current = target;
          setShown(target);
          return undefined;
        }
        const start = performance.now();
        let frame = 0;
        const step = (now) => {
          const progress = Math.min(1, Math.max(0, (now - start) / durationMs));
          const eased = 1 - Math.pow(1 - progress, 3);
          const next = from + (target - from) * eased;
          shownRef.current = next;
          setShown(next);
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
      }, [target, durationMs]);
      return shown;
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { en: EN, zh: ZH }), 'account balance: dictionaries');
      const t = ctx.locale.bind(NS);
      const store = createStore({ status: 'loading', pending: true, total: 0, at: 0 });

      /** One in-flight read at a time, shared by the poller, the click, and the focus refresh. */
      let inflight = null;

      const metadata = () => ({
        version: clientVersion(),
        locale: ctx.locale.getSnapshot().active,
        timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
      });

      const refresh = () => {
        if (inflight !== null) return inflight;
        const previous = store.get();
        store.set(previous.status === 'ready' ? { ...previous, pending: true } : { ...previous, pending: true, status: 'loading' });
        const run = (async () => {
          try {
            const result = await ctx.remote.account.getBalance(metadata());
            if (result === null || result === undefined || result.ok !== true) {
              throw new Error('balance request refused');
            }
            const balance = result.value;
            if (balance === null) {
              // A null balance means signed out, or the grant changed during the query.
              store.set({ status: 'signed-out', pending: false, total: 0, at: 0 });
              return;
            }
            if (balance.status !== 'ready') throw new Error('balance query failed');
            const wallets = Array.isArray(balance.value) ? balance.value : [];
            const bonusWallets = Array.isArray(balance.bonusWallets) ? balance.bonusWallets : [];
            const wallet = pickWallet(wallets);
            const bonusWallet = pickWallet(bonusWallets);
            store.set({
              status: 'ready',
              wallets,
              bonusWallets,
              currency: (wallet !== null && wallet.currency) || 'CNY',
              total: totalOf(wallet, bonusWallet),
              at: Date.now(),
              stale: false,
              pending: false,
            });
          } catch (error) {
            const last = store.get();
            // Keep a readable value through a transient failure; report it in the hint.
            if (last.status === 'ready') store.set({ ...last, pending: false, stale: true });
            else store.set({ status: 'error', pending: false, total: 0, at: 0 });
            console.error('[account-balance] balance read failed', error);
          }
        })();
        inflight = run;
        run.then(
          () => {
            if (inflight === run) inflight = null;
          },
          () => {
            if (inflight === run) inflight = null;
          },
        );
        return run;
      };

      ctx.effect(() => {
        refresh();
        const timer = setInterval(() => {
          if (document.visibilityState === 'visible') refresh();
        }, REFRESH_INTERVAL_MS);
        const onVisibility = () => {
          if (document.visibilityState === 'visible') refresh();
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
          clearInterval(timer);
          document.removeEventListener('visibilitychange', onVisibility);
        };
      }, 'account balance: refresh loop');

      const STYLE = `
        .dsh-account-balance {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
          max-width: 100%;
          height: 26px;
          padding: 0 7px;
          border: 1px solid transparent;
          border-radius: 999px;
          background: transparent;
          color: var(--dsw-alias-label-secondary);
          font: inherit;
          font-size: 12px;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
          flex: 0 1 auto;
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease, color 180ms ease;
        }
        .dsh-account-balance {
          border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent);
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent),
            transparent 72%
          );
        }
        .dsh-account-balance:hover {
          color: var(--dsw-alias-label-primary);
          border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 46%, transparent);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px -8px color-mix(in srgb, var(--dsw-alias-brand-primary) 80%, transparent);
        }
        .dsh-account-balance:focus-visible {
          outline: 2px solid var(--dsw-alias-brand-primary);
          outline-offset: 1px;
        }
        .dsh-account-balance[data-status='signed-out'] {
          color: var(--dsw-alias-state-idle-primary);
          border-color: transparent;
          background: transparent;
        }
        .dsh-account-balance[data-status='error'] {
          color: var(--dsw-alias-state-error-primary);
          border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 34%, transparent);
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent),
            transparent 72%
          );
        }
        .dsh-account-balance[data-wide='false'] {
          width: 28px;
          height: 28px;
          padding: 0;
          gap: 0;
          justify-content: center;
          flex: none;
        }
        .dsh-account-balance[data-wide='false'] .dsh-account-balance__text,
        .dsh-account-balance[data-wide='false'] .dsh-account-balance__dot,
        .dsh-account-balance[data-wide='false'] .dsh-account-balance__bonus,
        .dsh-account-balance[data-wide='false'] .dsh-account-balance__delta,
        .dsh-account-balance[data-wide='false'] .dsh-account-balance__warn { display: none; }
        .dsh-account-balance[data-wide='false'][data-pending='true'] {
          animation: dsh-ab-ring 1.6s ease-in-out infinite;
        }
        .dsh-account-balance__icon { flex: none; display: block; }
        .dsh-account-balance__dot {
          flex: none;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--dsw-alias-brand-primary);
          opacity: 0.5;
        }
        .dsh-account-balance[data-status='signed-out'] .dsh-account-balance__dot { background: var(--dsw-alias-state-idle-primary); }
        .dsh-account-balance[data-status='error'] .dsh-account-balance__dot { background: var(--dsw-alias-state-error-primary); opacity: 1; }
        .dsh-account-balance[data-pending='true'] .dsh-account-balance__dot {
          opacity: 1;
          animation: dsh-ab-breathe 1.1s ease-in-out infinite;
        }
        .dsh-account-balance__text {
          flex: 0 1 auto;
          min-width: 0;
          overflow: hidden;
          color: var(--dsw-alias-label-primary);
          font-weight: 500;
          text-overflow: ellipsis;
        }
        .dsh-account-balance[data-pop='true'] .dsh-account-balance__text {
          animation: dsh-ab-pop 420ms cubic-bezier(0.2, 0.9, 0.3, 1.2);
          display: inline-block;
        }
        .dsh-account-balance__bonus {
          flex: none;
          color: var(--dsw-alias-state-success-primary);
          opacity: 0.9;
        }
        .dsh-account-balance__delta {
          flex: none;
          color: var(--dsw-alias-brand-primary);
          font-weight: 500;
          animation: dsh-ab-delta 4200ms ease forwards;
        }
        .dsh-account-balance__warn { flex: none; color: var(--dsw-alias-state-warn-primary); }
        .dsh-account-balance[data-status='loading']::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            100deg,
            transparent 24%,
            color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent) 50%,
            transparent 76%
          );
          background-size: 220% 100%;
          animation: dsh-ab-shimmer 1.5s linear infinite;
        }
        @keyframes dsh-ab-breathe {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--dsw-alias-brand-primary) 55%, transparent); opacity: 0.45; }
          50% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--dsw-alias-brand-primary) 0%, transparent); opacity: 1; }
        }
        @keyframes dsh-ab-ring {
          0%, 100% { box-shadow: inset 0 0 0 1px transparent; }
          50% { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 55%, transparent); }
        }
        @keyframes dsh-ab-pop {
          0% { transform: translateY(2px) scale(0.96); opacity: 0.55; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes dsh-ab-delta {
          0% { opacity: 0; transform: translateY(4px); }
          12% { opacity: 1; transform: translateY(0); }
          72% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-2px); }
        }
        @keyframes dsh-ab-shimmer {
          from { background-position: 170% 0; }
          to { background-position: -70% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dsh-account-balance,
          .dsh-account-balance *,
          .dsh-account-balance::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `;

      function BalanceIcon() {
        return h(
          'svg',
          {
            className: 'dsh-account-balance__icon',
            viewBox: '0 0 16 16',
            width: 14,
            height: 14,
            fill: 'none',
            'aria-hidden': true,
            focusable: false,
          },
          h('rect', {
            x: 1.75,
            y: 4.25,
            width: 12.5,
            height: 9,
            rx: 2.25,
            stroke: 'currentColor',
            strokeWidth: 1.3,
          }),
          h('path', {
            d: 'M2.2 6.3h9.3',
            stroke: 'currentColor',
            strokeWidth: 1.3,
            strokeLinecap: 'round',
          }),
          h('circle', { cx: 11.35, cy: 9, r: 1.05, fill: 'currentColor' }),
        );
      }

      function BalanceChip(props) {
        const wide = props.wide !== false;
        const [state, setState] = React.useState(() => store.get());
        const [, setLocaleRevision] = React.useState(0);
        const [delta, setDelta] = React.useState(null);
        const lastTotal = React.useRef(null);
        React.useEffect(() => store.subscribe(setState), []);
        React.useEffect(() => ctx.locale.subscribe(() => setLocaleRevision((value) => value + 1)), []);

        const ready = state.status === 'ready';
        const currency = state.currency || 'CNY';
        const symbol = SYMBOLS[currency] ?? (currency === '' ? '' : currency + ' ');
        const wallet = ready ? pickWallet(state.wallets) : null;
        const bonusWallet = ready ? pickWallet(state.bonusWallets) : null;

        const eased = useEasedValue(ready ? state.total : 0, prefersReducedMotion() ? 0 : TWEEN_MS);

        // A settled change becomes a short-lived increment badge — the reading of
        // how much the session consumed since the previous poll.
        React.useEffect(() => {
          if (state.status !== 'ready') {
            lastTotal.current = null;
            return;
          }
          const previous = lastTotal.current;
          lastTotal.current = state.total;
          if (previous === null || !Number.isFinite(previous)) return;
          const diff = state.total - previous;
          if (!Number.isFinite(diff) || Math.abs(diff) < 0.005) return;
          setDelta({ id: Date.now() + Math.random(), diff });
        }, [state.status, state.total]);
        React.useEffect(() => {
          if (delta === null) return undefined;
          const timer = setTimeout(() => setDelta(null), DELTA_MS);
          return () => clearTimeout(timer);
        }, [delta]);

        const showBonus = isPositive(bonusWallet) && delta === null;

        let text;
        let hint;
        if (ready) {
          text = wallet === null ? t('noWallet') : currencyAmount({ currency, balance: eased });
          const parts = [t('label')];
          if (wallet !== null) parts.push(t('rechargeLabel') + ' ' + currencyAmount(wallet));
          if (isPositive(bonusWallet)) parts.push(t('bonusLabel') + ' ' + currencyAmount(bonusWallet));
          const time = new Date(state.at).toLocaleTimeString(ctx.locale.getSnapshot().active, {
            hour: '2-digit',
            minute: '2-digit',
          });
          parts.push(t('updatedLabel') + ' ' + time);
          if (state.stale === true) parts.push(t('staleHint'));
          parts.push(t('refreshHint'));
          hint = parts.join(' · ');
        } else if (state.status === 'signed-out') {
          text = t('signedOut');
          hint = t('signedOutHint');
        } else if (state.status === 'error') {
          text = t('failed');
          hint = t('failedHint');
        } else {
          text = t('loading');
          hint = t('loadingHint');
        }

        const deltaText =
          delta === null
            ? null
            : (delta.diff < 0 ? MINUS : '+') + symbol + formatAmount(Math.abs(delta.diff));

        return h(
          React.Fragment,
          null,
          h('style', { key: 'style' }, STYLE),
          h(
            'button',
            {
              key: 'chip',
              type: 'button',
              className: 'dsh-account-balance',
              'data-status': state.status,
              'data-wide': wide ? 'true' : 'false',
              'data-pending': state.pending === true ? 'true' : 'false',
              'data-pop': delta !== null ? 'true' : 'false',
              'data-stale': ready && state.stale === true ? 'true' : undefined,
              title: hint,
              'aria-label': hint,
              'aria-busy': state.status === 'loading',
              onClick: () => {
                refresh();
              },
            },
            h('span', { key: 'dot', className: 'dsh-account-balance__dot', 'aria-hidden': true }),
            h(BalanceIcon),
            // A narrow rail cannot fit a figure; the icon carries the state and the hint carries the value.
            wide
              ? h(
                  'span',
                  { key: delta === null ? 'text' : 'text-' + delta.id, className: 'dsh-account-balance__text' },
                  text,
                )
              : null,
            wide && deltaText !== null
              ? h('span', { key: 'delta-' + delta.id, className: 'dsh-account-balance__delta' }, deltaText)
              : null,
            wide && showBonus
              ? h('span', { key: 'bonus', className: 'dsh-account-balance__bonus' }, '+' + currencyAmount(bonusWallet))
              : null,
            wide && ready && state.stale === true
              ? h('span', { key: 'warn', className: 'dsh-account-balance__warn', 'aria-hidden': true }, '!')
              : null,
          ),
        );
      }

      ctx.slots.inject('sidebar.footer.action', () =>
        ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'account-balance',
            order: 10,
          },
          BalanceChip,
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'remote', 'remote.account'],
      apply,
    };
  },
});

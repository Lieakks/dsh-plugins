window.__ModuleLoader__.load({
  id: '@local/dsh-quota-meter',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'quota-meter'
    const STORE_KEY = 'dsh-quota-meter:sessions'
    const LEGACY_KEY = 'dsh-quota-meter:baseline'
    const MAX_BASELINES = 100
    const POLL_MS = 15000
    const SETTLE_MS = 2000
    const STALE_MS = 60000

    const DICT = {
      en: {
        reading: 'Reading balance…',
        signedOut: 'Not signed in',
        failed: 'Balance unavailable',
        stale: 'Last refresh failed — showing an earlier reading',
        retry: 'Retry',
        refresh: 'Refresh balance',
        bonus: 'bonus',
        used: 'this session',
        since: 'Counted from',
        updated: 'Updated',
      },
      zh: {
        reading: '额度读取中…',
        signedOut: '未登录',
        failed: '额度读取失败',
        stale: '上次刷新失败，显示的是较早的读数',
        retry: '重试',
        refresh: '刷新额度',
        bonus: '赠送',
        used: '本会话已用',
        since: '统计起点',
        updated: '更新于',
      },
    }

    const SYMBOLS = { CNY: '¥', USD: '$' }

    const CSS = [
      '.qm{display:inline-flex;align-items:center;gap:6px;font-size:11px;line-height:16px;',
      'color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.qm-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-idle-primary);flex:none}',
      '.qm[data-running="true"] .qm-dot{background:var(--dsw-alias-brand-primary);',
      'animation:qm-pulse 1.2s ease-in-out infinite}',
      '@keyframes qm-pulse{0%,100%{opacity:.3}50%{opacity:1}}',
      '.qm-amount{font-weight:500;color:var(--dsw-alias-label-primary)}',
      '.qm-warn{color:var(--dsw-alias-state-warn-primary)}',
      '.qm-btn{appearance:none;border:0;background:none;padding:0 2px;font:inherit;color:inherit;',
      'cursor:pointer;border-radius:4px}',
      '.qm-btn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.qm-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '@media (prefers-reduced-motion: reduce){.qm[data-running="true"] .qm-dot{animation:none}}',
    ].join('')

    /** Coerce a possibly-branded identifier to plain text. */
    function text(value) {
      try {
        return String(value)
      } catch (error) {
        return ''
      }
    }

    /** Format an amount the way the Platform balance card does. */
    function formatAmount(value) {
      const amount = Number(value)
      if (!Number.isFinite(amount)) return '0.00'
      const abs = Math.abs(amount)
      if (abs > 0 && abs < 0.01) return '<0.01'
      const parts = abs.toFixed(2).split('.')
      const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return (amount < 0 ? '-' : '') + whole + '.' + parts[1]
    }

    /** Format an epoch millisecond value as a local wall-clock time. */
    function formatTime(ms) {
      const date = new Date(ms)
      return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((part) => String(part).padStart(2, '0'))
        .join(':')
    }

    /** Parse one wallet's decimal balance string. */
    function walletAmount(wallet) {
      const raw = wallet && typeof wallet.balance === 'string' ? wallet.balance : ''
      const amount = Number.parseFloat(raw)
      return Number.isFinite(amount) ? amount : 0
    }

    /**
     * Summarize one ready balance outcome into the amounts this widget shows.
     * Recharge and bonus wallets are summed separately so the main figure stays
     * the user's own credit while consumption still counts every wallet.
     */
    function summarize(balance) {
      if (!balance || balance.status !== 'ready') return null
      const recharge = Array.isArray(balance.value) ? balance.value : []
      const bonus = Array.isArray(balance.bonusWallets) ? balance.bonusWallets : []
      const lead = recharge[0] || bonus[0] || null
      const currency = lead && lead.currency === 'USD' ? 'USD' : 'CNY'
      const pick = (list) =>
        list.filter((wallet) => wallet && (wallet.currency || 'CNY') === currency)
      const sum = (list) => pick(list).reduce((total, wallet) => total + walletAmount(wallet), 0)
      return {
        currency,
        recharge: sum(recharge),
        bonus: sum(bonus),
        total: sum(recharge) + sum(bonus),
      }
    }

    /**
     * Read the durable session baselines: sessionId → { total, at }. They live in
     * localStorage so reopening a Session, or reloading the page, keeps counting
     * the same Session instead of starting over.
     */
    function readBaselines() {
      try {
        window.sessionStorage.removeItem(LEGACY_KEY)
      } catch (error) {}
      try {
        const raw = window.localStorage.getItem(STORE_KEY)
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') return {}
        const baselines = {}
        for (const [id, entry] of Object.entries(parsed)) {
          if (entry && typeof entry.total === 'number' && Number.isFinite(entry.total)) {
            baselines[id] = {
              total: entry.total,
              at: typeof entry.at === 'number' && Number.isFinite(entry.at) ? entry.at : 0,
            }
          }
        }
        return baselines
      } catch (error) {
        return {}
      }
    }

    /** Persist the baselines, keeping only the most recently captured ones. */
    function writeBaselines(baselines) {
      try {
        const ids = Object.keys(baselines)
        if (ids.length > MAX_BASELINES) {
          ids.sort((left, right) => baselines[left].at - baselines[right].at)
          for (const id of ids.slice(0, ids.length - MAX_BASELINES)) delete baselines[id]
        }
        window.localStorage.setItem(STORE_KEY, JSON.stringify(baselines))
      } catch (error) {}
    }

    /** The Host release identity, reported to the Platform as this UI's version. */
    function versionOf() {
      try {
        const release = window.__DSH_BOOT__ && window.__DSH_BOOT__.release
        if (typeof release === 'string' && release) return release
        if (release && typeof release.version === 'string' && release.version) return release.version
      } catch (error) {}
      return '0.0.0'
    }

    /** The active locale id, reported to the Platform as this UI's language. */
    function localeOf(ctx) {
      try {
        const snapshot = ctx.locale.getSnapshot()
        const active = snapshot && snapshot.active
        if (typeof active === 'string' && active) return active
      } catch (error) {}
      return 'en'
    }

    /**
     * One shared balance view plus one baseline per Session. A Session's
     * baseline is captured the first time its composer shows this widget, which
     * for a new Session is before its first message; consumption is then the
     * drop from that baseline to the latest reading.
     */
    function createStore(ctx) {
      let snapshot = {
        state: 'reading',
        currency: 'CNY',
        recharge: 0,
        bonus: 0,
        total: 0,
        running: 0,
        pending: false,
        stale: false,
        updatedAt: 0,
      }
      const baselines = readBaselines()
      const awaiting = new Set()
      const mounted = new Set()
      const listeners = new Set()
      const statuses = new Map()
      let inFlight = null
      let poll = null
      let settle = null
      let disposed = false

      const publish = (patch) => {
        snapshot = Object.assign({}, snapshot, patch)
        for (const listener of listeners) listener(snapshot)
      }

      /** This UI's identity for one account read, sampled as the read is issued. */
      const metadata = () => ({
        version: versionOf(),
        locale: localeOf(ctx),
        timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
      })

      /**
       * Give every Session first seen now its baseline, and move any baseline the
       * current total has risen above — a top-up or refund — up to that total.
       */
      const reconcile = (total) => {
        let changed = false
        const at = Date.now()
        for (const id of awaiting) {
          awaiting.delete(id)
          if (baselines[id] === undefined) {
            baselines[id] = { total, at }
            changed = true
          }
        }
        for (const [id, entry] of Object.entries(baselines)) {
          if (total > entry.total + 0.000001) {
            baselines[id] = { total, at }
            changed = true
          }
        }
        if (changed) writeBaselines(baselines)
      }

      /** Read the wallet balances once; concurrent callers share one request. */
      const load = () => {
        if (disposed) return Promise.resolve()
        if (inFlight) return inFlight
        publish({ pending: true })
        inFlight = (async () => {
          try {
            const result = await ctx.remote.account.getBalance(metadata())
            if (disposed) return
            const keepStale = () =>
              publish(
                snapshot.state === 'ready'
                  ? { pending: false, stale: true }
                  : { state: 'failed', pending: false, updatedAt: Date.now() },
              )
            if (!result || result.ok !== true) {
              keepStale()
              return
            }
            if (result.value === null || result.value === undefined) {
              publish({ state: 'signedOut', pending: false, stale: false, updatedAt: Date.now() })
              return
            }
            const info = summarize(result.value)
            if (info === null) {
              keepStale()
              return
            }
            reconcile(info.total)
            publish({
              state: 'ready',
              currency: info.currency,
              recharge: info.recharge,
              bonus: info.bonus,
              total: info.total,
              pending: false,
              stale: false,
              updatedAt: Date.now(),
            })
          } catch (error) {
            if (disposed) return
            publish(
              snapshot.state === 'ready'
                ? { pending: false, stale: true }
                : { state: 'failed', pending: false, updatedAt: Date.now() },
            )
          } finally {
            inFlight = null
          }
        })()
        return inFlight
      }

      /**
       * Claim a Session's counter when its composer mounts. A Session without a
       * stored baseline triggers one fresh read so its baseline is the balance at
       * that moment rather than an old reading.
       */
      const track = (sessionId) => {
        const key = text(sessionId)
        if (!key || key === 'undefined' || key === 'null') return () => {}
        mounted.add(key)
        if (baselines[key] === undefined && !awaiting.has(key)) {
          awaiting.add(key)
          void load()
        }
        return () => {
          mounted.delete(key)
        }
      }

      /** Credit consumed by one Session since its baseline. */
      const usedFor = (sessionId) => {
        const entry = baselines[text(sessionId)]
        if (entry === undefined || snapshot.state !== 'ready') return 0
        return Math.max(0, entry.total - snapshot.total)
      }

      /** When that Session's baseline was captured. */
      const sinceFor = (sessionId) => {
        const entry = baselines[text(sessionId)]
        return entry === undefined ? 0 : entry.at
      }

      const runningCount = () => {
        let count = 0
        for (const value of statuses.values()) if (value) count += 1
        return count
      }

      /**
       * Follow Session running state: billing settles when a request closes, so
       * the widget reads shortly after the last run ends and polls only while
       * at least one run is in flight.
       */
      const noteStatus = (sessionId, running) => {
        const key = text(sessionId)
        const next = running === true
        if (statuses.get(key) === next) return
        statuses.set(key, next)
        const count = runningCount()
        publish({ running: count })
        if (settle !== null) {
          clearTimeout(settle)
          settle = null
        }
        if (next === false && count === 0) {
          settle = setTimeout(() => {
            settle = null
            void load()
          }, SETTLE_MS)
        }
      }

      /**
       * Pace refreshes: follow every run while one is active, and otherwise keep
       * the reading no older than a minute so a missed event self-heals.
       */
      const start = () => {
        if (poll !== null) return
        poll = setInterval(() => {
          if (runningCount() > 0 || Date.now() - snapshot.updatedAt > STALE_MS) void load()
        }, POLL_MS)
      }

      const reset = () => {
        for (const id of Object.keys(baselines)) delete baselines[id]
        awaiting.clear()
        writeBaselines(baselines)
        // A different account starts over: re-arm the Session on screen so the
        // next reading captures its starting balance again.
        for (const id of mounted) awaiting.add(id)
        publish({
          state: 'reading',
          currency: 'CNY',
          recharge: 0,
          bonus: 0,
          total: 0,
          pending: false,
          stale: false,
          updatedAt: 0,
        })
      }

      const dispose = () => {
        disposed = true
        listeners.clear()
        if (poll !== null) clearInterval(poll)
        if (settle !== null) clearTimeout(settle)
        poll = null
        settle = null
      }

      return {
        snapshot: () => snapshot,
        subscribe(listener) {
          listeners.add(listener)
          return () => {
            listeners.delete(listener)
          }
        },
        refresh: load,
        track,
        usedFor,
        sinceFor,
        noteStatus,
        start,
        reset,
        dispose,
      }
    }

    /** The ambient dock entry: this Session's spend and a refresh control. */
    function QuotaMeter(props) {
      const store = props.store
      const t = props.t
      const sessionId = props.sessionId
      const [snapshot, setSnapshot] = React.useState(store.snapshot())
      React.useEffect(() => store.subscribe(setSnapshot), [])
      React.useEffect(() => store.track(sessionId), [sessionId])

      const symbol = SYMBOLS[snapshot.currency] || snapshot.currency
      const children = [
        h('style', { key: 'style' }, CSS),
        h('span', { key: 'dot', className: 'qm-dot', 'aria-hidden': true }),
      ]

      if (snapshot.state === 'ready') {
        const since = store.sinceFor(sessionId)
        children.push(
          h(
            'span',
            {
              key: 'used',
              title: since ? t('since') + ' ' + formatTime(since) : undefined,
            },
            t('used') + ' ',
            h(
              'span',
              { key: 'value', className: 'qm-amount' },
              symbol + formatAmount(store.usedFor(sessionId)),
            ),
          ),
        )
        if (snapshot.stale) {
          children.push(h('span', { key: 'stale', className: 'qm-warn', title: t('stale') }, '!'))
        }
        children.push(
          h(
            'button',
            {
              key: 'refresh',
              type: 'button',
              className: 'qm-btn',
              title: t('refresh'),
              'aria-label': t('refresh'),
              onClick: (event) => {
                event.preventDefault()
                void store.refresh()
              },
            },
            '↻',
          ),
        )
      } else if (snapshot.state === 'signedOut') {
        children.push(h('span', { key: 'signed-out' }, t('signedOut')))
      } else if (snapshot.state === 'failed') {
        children.push(h('span', { key: 'failed', className: 'qm-warn' }, t('failed')))
        children.push(
          h(
            'button',
            {
              key: 'retry',
              type: 'button',
              className: 'qm-btn',
              title: t('retry'),
              'aria-label': t('retry'),
              onClick: (event) => {
                event.preventDefault()
                void store.refresh()
              },
            },
            t('retry'),
          ),
        )
      } else {
        children.push(h('span', { key: 'reading' }, t('reading')))
      }

      const updated = snapshot.updatedAt ? new Date(snapshot.updatedAt) : null
      return h(
        'div',
        {
          className: 'qm',
          'data-state': snapshot.state,
          'data-running': snapshot.running > 0 ? 'true' : 'false',
          title:
            updated === null ? t('refresh') : t('updated') + ' ' + formatTime(updated.getTime()),
        },
        children,
      )
    }

    return {
      inject: ['slots', 'locale', 'remote', 'remote.account'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, DICT), 'quota-meter: dictionaries')
        const t = ctx.locale.bind(NS)
        const store = createStore(ctx)
        ctx.effect(() => () => store.dispose(), 'quota-meter: store lifetime')
        /** Subscribe to one forwarded Host event; an unforwarded name degrades to no follow. */
        const listen = (name, handler) => {
          try {
            const off = ctx.remote.$on(name, handler)
            return typeof off === 'function' ? off : () => {}
          } catch (error) {
            return () => {}
          }
        }
        ctx.effect(
          () =>
            listen('api-session/status', (sessionId, running) => {
              store.noteStatus(sessionId, running)
            }),
          'quota-meter: session status',
        )
        const resetAccount = () => {
          store.reset()
          void store.refresh()
        }
        ctx.effect(() => listen('deepseek-account/signed-out', resetAccount), 'quota-meter: signed-out')
        ctx.effect(
          () => listen('deepseek-account/session-expired', resetAccount),
          'quota-meter: session expired',
        )
        store.start()
        void store.refresh()
        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'quota-meter',
              order: 2,
              inject: () => ({ store, t }),
            },
            QuotaMeter,
          ),
        )
      },
    }
  },
})

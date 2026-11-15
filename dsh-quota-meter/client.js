window.__ModuleLoader__.load({
  id: '@local/dsh-quota-meter',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'quota-meter'
    /** Accumulated spend per Session: sessionId → { spent, at }. */
    const SPEND_KEY = 'dsh-quota-meter:spend:v2'
    /** Pre-v2 baseline store, kept only so the old key can be cleared. */
    const LEGACY_KEY = 'dsh-quota-meter:sessions'
    const MAX_SESSIONS = 100
    const POLL_MS = 15000
    const SETTLE_MS = 2000
    const STALE_MS = 60000
    /** Amounts below this are float noise, not real movement. */
    const EPSILON = 0.000001
    /**
     * Same-page event a companion plugin uses to declare model spend it caused. The
     * polish button is the one source today; the list is explicit so an unrelated
     * dispatcher cannot charge a Session.
     */
    const SPEND_EVENT = 'dsh:spend-source'
    const SPEND_SOURCES = new Set(['polish'])
    /** Loader module names that back a spend source, used for the install check. */
    const SPEND_SOURCE_MODULES = ['input-polish']
    /** Longest a companion call may hold the books; the Host caps one at 120s. */
    const SPEND_HOLD_MS = 150000

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
        since: 'Counting since',
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
        since: '开始统计',
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
     * Read the durable per-Session spend counters: sessionId → { spent, at }.
     * They live in localStorage so reopening a Session, or reloading the page,
     * keeps the same accumulated figure instead of starting over.
     */
    function readSpend() {
      try {
        // The pre-v2 shape measured a drop from a captured baseline, which a top-up
        // wiped out; it cannot be converted, so it is dropped once.
        window.localStorage.removeItem(LEGACY_KEY)
      } catch (error) {}
      try {
        const raw = window.localStorage.getItem(SPEND_KEY)
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') return {}
        const spend = {}
        for (const [id, entry] of Object.entries(parsed)) {
          if (entry && typeof entry.spent === 'number' && Number.isFinite(entry.spent) && entry.spent >= 0) {
            spend[id] = {
              spent: entry.spent,
              at: typeof entry.at === 'number' && Number.isFinite(entry.at) ? entry.at : 0,
            }
          }
        }
        return spend
      } catch (error) {
        return {}
      }
    }

    /** Persist the counters, keeping only the most recently touched Sessions. */
    function writeSpend(spend) {
      try {
        const ids = Object.keys(spend)
        if (ids.length > MAX_SESSIONS) {
          ids.sort((left, right) => spend[left].at - spend[right].at)
          for (const id of ids.slice(0, ids.length - MAX_SESSIONS)) delete spend[id]
        }
        window.localStorage.setItem(SPEND_KEY, JSON.stringify(spend))
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
     * One shared balance view plus one spend counter per Session. A counter is opened
     * the first time its composer shows this widget and then grows by the drop the
     * account balance made while that Session was the one running — never by a
     * difference from a stored snapshot, so a recharge leaves the counters alone.
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
      const spend = readSpend()
      const mounted = new Set()
      const listeners = new Set()
      const statuses = new Map()
      /** Sessions that were running during the interval since the last reading. */
      const intervalRunning = new Set()
      /** Account total at the last reading; `null` until the first one lands. */
      let lastTotal = null
      /** Companion calls in flight per Session: sessionId → expiry timestamp. */
      const polishUntil = new Map()
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
       * Credit one reading to whichever Sessions were running while its drop happened.
       *
       * The account balance is shared, so the only per-Session signal is *when* it fell:
       * the drop between two readings belongs to the Sessions that ran in that interval.
       * A rise (top-up or refund) is not spend and never touches a counter — that is
       * what used to reset every Session to zero after a recharge. With several runs
       * in flight the drop is split evenly, which is an estimate, not a bill.
       */
      const attribute = (total) => {
        const previous = lastTotal
        lastTotal = total
        const now = Date.now()
        const runningNow = new Set()
        for (const [id, running] of statuses) if (running) runningNow.add(id)
        // A companion call in flight is attributed exactly like an Agent run. One that
        // never says it ended stops counting at its deadline — and is dropped from the
        // pending set too, so a lost "end" cannot keep charging later readings.
        for (const [id, expiresAt] of [...polishUntil]) {
          if (expiresAt > now) {
            runningNow.add(id)
            continue
          }
          polishUntil.delete(id)
          intervalRunning.delete(id)
        }
        const credited = new Set([...intervalRunning, ...runningNow])
        intervalRunning.clear()
        for (const id of runningNow) intervalRunning.add(id)
        if (previous === null || credited.size === 0) return
        const delta = previous - total
        // A recharge, a refund or an unchanged reading: nothing to charge.
        if (delta <= EPSILON) return
        const at = Date.now()
        const share = delta / credited.size
        for (const id of credited) {
          const entry = spend[id] ?? { spent: 0, at }
          entry.spent += share
          spend[id] = entry
        }
        writeSpend(spend)
        // Mounted widgets read the counter from the shared snapshot, so a change here
        // has to reach them through the usual notification.
        publish({})
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
            attribute(info.total)
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
       * Claim a Session's counter when its composer mounts. Counters are created on
       * demand: nothing is captured from the balance, so a later recharge cannot
       * disturb them.
       */
      const track = (sessionId) => {
        const key = text(sessionId)
        if (!key || key === 'undefined' || key === 'null') return () => {}
        mounted.add(key)
        if (spend[key] === undefined) {
          spend[key] = { spent: 0, at: Date.now() }
          writeSpend(spend)
        }
        return () => {
          mounted.delete(key)
        }
      }

      /** Credit attributed to one Session. */
      const usedFor = (sessionId) => {
        const entry = spend[text(sessionId)]
        return entry === undefined ? 0 : entry.spent
      }

      /** When that Session's counter was opened. */
      const sinceFor = (sessionId) => {
        const entry = spend[text(sessionId)]
        return entry === undefined ? 0 : entry.at
      }

      const runningCount = () => {
        let count = 0
        for (const value of statuses.values()) if (value) count += 1
        return count
      }

      /**
       * Follow Session running state. A run starting also opens the interval it will
       * be charged for, and a run ending lets billing settle before the closing read;
       * the widget otherwise polls while anything is in flight.
       */
      const noteStatus = (sessionId, running) => {
        const key = text(sessionId)
        const next = running === true
        if (statuses.get(key) === next) return
        statuses.set(key, next)
        if (next) {
          intervalRunning.add(key)
        }
        const count = runningCount()
        publish({ running: count })
        if (settle !== null) {
          clearTimeout(settle)
          settle = null
        }
        if (next) {
          // Read at the boundary so the run's drop is measured from its own start
          // instead of from wherever the previous poll happened to land.
          void load()
          return
        }
        if (count === 0) armSettle()
      }

      /** Read once billing has had time to settle. */
      const armSettle = () => {
        if (settle !== null) clearTimeout(settle)
        settle = setTimeout(() => {
          settle = null
          void load()
        }, SETTLE_MS)
      }

      /**
       * Charge a companion plugin's model call to the Session it was started from.
       * `start` opens the window and takes a boundary reading; `end` closes it and
       * waits for settlement. The Session stays in `intervalRunning` either way, so
       * the closing reading still holds the whole call — dropping it here would
       * lose the last chunk.
       */
      const noteSpendSource = (sessionId, phase) => {
        const key = text(sessionId)
        if (!key || key === 'undefined' || key === 'null') return
        intervalRunning.add(key)
        if (phase === 'end') {
          polishUntil.delete(key)
          armSettle()
          return
        }
        polishUntil.set(key, Date.now() + SPEND_HOLD_MS)
        void load()
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
        // A different account starts over: every counter belongs to the old one.
        for (const id of Object.keys(spend)) delete spend[id]
        intervalRunning.clear()
        lastTotal = null
        writeSpend(spend)
        for (const id of mounted) spend[id] = { spent: 0, at: Date.now() }
        if (mounted.size > 0) writeSpend(spend)
        publish({
          state: 'reading',
          currency: 'CNY',
          recharge: 0,
          bonus: 0,
          total: 0,
          running: 0,
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
        noteSpendSource,
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
        /**
         * Accept a companion plugin's spend announcements. Registration is conditional:
         * when the Host inventory confirms no companion is installed, nothing here is
         * attached at all. An unreadable inventory registers anyway — "unknown" must
         * not silently disable the accounting.
         */
        const onSpendSource = (event) => {
          const detail = event === null || typeof event !== 'object' ? null : event.detail
          if (detail === null || typeof detail !== 'object') return
          if (!SPEND_SOURCES.has(detail.source)) return
          if (typeof detail.sessionId !== 'string' || detail.sessionId === '') return
          store.noteSpendSource(detail.sessionId, detail.phase === 'end' ? 'end' : 'start')
        }
        ctx.effect(() => {
          let listening = false
          const attach = () => {
            if (listening) return
            listening = true
            window.addEventListener(SPEND_EVENT, onSpendSource)
          }
          const detect = async () => {
            const remote = ctx.get('remote')
            const inventory = remote === undefined || remote === null ? undefined : remote.pluginInventory
            if (inventory === undefined || inventory === null || typeof inventory.list !== 'function') {
              attach()
              return
            }
            try {
              const result = await inventory.list()
              if (result === null || result === undefined || result.ok !== true) {
                attach()
                return
              }
              const entries =
                result.value !== null && typeof result.value === 'object' && Array.isArray(result.value.entries)
                  ? result.value.entries
                  : null
              if (entries === null) {
                attach()
                return
              }
              const installed = entries.some((entry) => {
                if (entry === null || typeof entry !== 'object') return false
                if (entry.enabled === false || entry.fiberPhase === 'failed') return false
                const name = typeof entry.moduleName === 'string' ? entry.moduleName : ''
                const id = typeof entry.entryId === 'string' ? entry.entryId : ''
                return SPEND_SOURCE_MODULES.some((module) => name.includes(module) || id.includes(module))
              })
              if (installed) attach()
            } catch (error) {
              attach()
            }
          }
          void detect()
          return () => {
            if (listening) window.removeEventListener(SPEND_EVENT, onSpendSource)
          }
        }, 'quota-meter: spend sources')
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

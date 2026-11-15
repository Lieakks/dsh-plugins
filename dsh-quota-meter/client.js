window.__ModuleLoader__.load({
  id: '@lieakks/dsh-quota-meter',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'quota-meter'
    /**
     * One durable ledger: `{ sessions, lastTotal, lastRunAt, unattributed }`.
     * `sessions` is sessionId → { spent, at }, `lastTotal` is the account total the
     * previous reading saw (so a reload can still charge the gap), `lastRunAt` keeps
     * when each Session last stopped running, `unattributed` is money no Session claimed.
     */
    const LEDGER_KEY = 'dsh-quota-meter:ledger:v3'
    /** Earlier shapes, read once for migration and then removed. */
    const LEGACY_KEYS = ['dsh-quota-meter:spend:v2', 'dsh-quota-meter:sessions']
    const MAX_SESSIONS = 100
    const POLL_MS = 15000
    const SETTLE_MS = 2000
    const STALE_MS = 60000
    /** Amounts below this are float noise, not real movement. */
    const EPSILON = 0.000001
    /**
     * A run's bill can settle after the run ended. A drop seen while nothing is
     * running is charged to the most recent run inside this window; older than that
     * it has no owner and counts as unattributed.
     */
    const GRACE_MS = 5 * 60000
    /**
     * Same-page event a companion plugin uses to declare model spend it caused. The
     * polish button is the one source today; the list is explicit so an unrelated
     * dispatcher cannot charge a Session.
     */
    const SPEND_EVENT = 'dsh:spend-source'
    const SPEND_SOURCES = new Set(['polish'])
    /** Loader module names that back a spend source, used for the install check. */
    const SPEND_SOURCE_MODULES = ['input-polish']
    /**
     * How long a companion call counts as in flight for splitting. It matches the
     * grace window below, so a lost "end" neither splits forever nor leaves the tail
     * uncharged: past this, the late-settlement rule takes over.
     */
    const SPEND_HOLD_MS = 5 * 60000

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
        unattributed: 'Not attributed to any session',
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
        unattributed: '未能归属到会话',
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
     * Read the durable ledger. Sessions, the previous account total, when each
     * Session last ran and the unattributed remainder all live in localStorage so a
     * reload neither loses the counters nor the drop that settled while it happened.
     */
    function readLedger() {
      const empty = { sessions: {}, lastTotal: null, lastReadAt: null, lastRunAt: {}, unattributed: 0 }
      try {
        const raw = window.localStorage.getItem(LEDGER_KEY)
        if (raw !== null) {
          const parsed = JSON.parse(raw)
          if (parsed === null || typeof parsed !== 'object') return empty
          const sessions = {}
          const source = parsed.sessions !== null && typeof parsed.sessions === 'object' ? parsed.sessions : {}
          for (const [id, entry] of Object.entries(source)) {
            if (entry === null || typeof entry !== 'object') continue
            if (typeof entry.spent !== 'number' || !Number.isFinite(entry.spent) || entry.spent < 0) continue
            sessions[id] = {
              spent: entry.spent,
              at: typeof entry.at === 'number' && Number.isFinite(entry.at) ? entry.at : 0,
            }
          }
          const lastRunAt = {}
          const runs = parsed.lastRunAt !== null && typeof parsed.lastRunAt === 'object' ? parsed.lastRunAt : {}
          for (const [id, value] of Object.entries(runs)) {
            if (typeof value === 'number' && Number.isFinite(value)) lastRunAt[id] = value
          }
          return {
            sessions,
            lastTotal:
              typeof parsed.lastTotal === 'number' && Number.isFinite(parsed.lastTotal) ? parsed.lastTotal : null,
            lastReadAt:
              typeof parsed.lastReadAt === 'number' && Number.isFinite(parsed.lastReadAt) ? parsed.lastReadAt : null,
            lastRunAt,
            unattributed:
              typeof parsed.unattributed === 'number' && Number.isFinite(parsed.unattributed) && parsed.unattributed > 0
                ? parsed.unattributed
                : 0,
          }
        }
      } catch (error) {}
      try {
        // v2 stored only the counters, flat; keep them and drop the older baseline key.
        const legacy = window.localStorage.getItem(LEGACY_KEYS[0])
        const sessions = {}
        if (legacy !== null) {
          const parsed = JSON.parse(legacy)
          if (parsed !== null && typeof parsed === 'object') {
            for (const [id, entry] of Object.entries(parsed)) {
              if (entry === null || typeof entry !== 'object') continue
              if (typeof entry.spent !== 'number' || !Number.isFinite(entry.spent) || entry.spent < 0) continue
              sessions[id] = {
                spent: entry.spent,
                at: typeof entry.at === 'number' && Number.isFinite(entry.at) ? entry.at : 0,
              }
            }
          }
        }
        for (const key of LEGACY_KEYS) window.localStorage.removeItem(key)
        return { sessions, lastTotal: null, lastReadAt: null, lastRunAt: {}, unattributed: 0 }
      } catch (error) {
        return empty
      }
    }

    /** Persist the ledger, keeping only the most recently touched Sessions. */
    function writeLedger(ledger) {
      try {
        const ids = Object.keys(ledger.sessions)
        if (ids.length > MAX_SESSIONS) {
          ids.sort((left, right) => ledger.sessions[left].at - ledger.sessions[right].at)
          for (const id of ids.slice(0, ids.length - MAX_SESSIONS)) {
            delete ledger.sessions[id]
            delete ledger.lastRunAt[id]
          }
        }
        window.localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger))
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
      const ledger = readLedger()
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
        unattributed: ledger.unattributed,
      }
      const mounted = new Set()
      const listeners = new Set()
      const statuses = new Map()
      /** Sessions that were running during the interval since the last reading. */
      const intervalRunning = new Set()
      /**
       * Subagent child → the Session that spawned it. Learned from `api-session/added`,
       * which carries the summary's `origin` and `parentSessionId`. Only these mapped
       * children are folded into their parent; any other unknown id is skipped, so no
       * counter is invented for a Session the user never sees.
       */
      const parents = new Map()
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

      /** The counter a Session's spend belongs to: a mapped subagent folds into its parent. */
      const ownerOf = (id) => {
        const parent = parents.get(id)
        return parent === undefined ? id : parent
      }

      /** Whether that owner has a counter the user can actually see. */
      const known = (id) => ledger.sessions[id] !== undefined

      const save = () => writeLedger(ledger)

      /** This UI's identity for one account read, sampled as the read is issued. */
      const metadata = () => ({
        version: versionOf(),
        locale: localeOf(ctx),
        timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
      })

      /**
       * Credit one reading to whichever Sessions were running while its drop happened.
       *
       * The account balance is shared, so the only per-Session signal is *when* it fell.
       * Subagent children are folded into the Session that spawned them; anything with
       * no visible counter is skipped rather than given an invisible one. A rise
       * (top-up or refund) is not spend and never touches a counter. A drop seen while
       * nothing runs is charged to the last run inside `GRACE_MS` (late settlement),
       * and anything older still has no owner: it accumulates as unattributed money
       * instead of disappearing.
       */
      const attribute = (total) => {
        const previous = ledger.lastTotal
        // A ledger last written long ago cannot explain today's drop: it covers hours
        // the page never watched. Treat it as a fresh baseline instead of charging it.
        const readable = ledger.lastReadAt === null || Date.now() - ledger.lastReadAt <= GRACE_MS
        ledger.lastTotal = total
        ledger.lastReadAt = Date.now()
        const now = Date.now()
        const running = new Set()
        for (const [id, active] of statuses) if (active) running.add(id)
        // A companion call in flight counts like an Agent run. One that never says it
        // ended stops counting at its deadline, pending set included.
        for (const [id, expiresAt] of [...polishUntil]) {
          if (expiresAt > now) {
            running.add(id)
            continue
          }
          polishUntil.delete(id)
          intervalRunning.delete(id)
        }

        const credited = new Set()
        for (const id of [...intervalRunning, ...running]) {
          const owner = ownerOf(id)
          if (known(owner)) credited.add(owner)
        }
        intervalRunning.clear()
        for (const id of running) {
          const owner = ownerOf(id)
          if (known(owner)) intervalRunning.add(owner)
        }

        if (previous === null) return
        const delta = previous - total
        if (delta <= EPSILON) return
        // A reading whose predecessor is too old to describe this interval only
        // re-baselines; charging it would bill hours the page never saw.
        if (!readable) return

        let targets = [...credited]
        if (targets.length === 0) {
          // Late settlement: charge the most recent run that still falls in the grace
          // window. Nothing older can be attributed honestly.
          let latest = 0
          let latestId = null
          for (const [id, at] of Object.entries(ledger.lastRunAt)) {
            if (!known(id)) continue
            if (now - at > GRACE_MS) continue
            if (at > latest) {
              latest = at
              latestId = id
            }
          }
          if (latestId !== null) targets = [latestId]
        }
        if (targets.length === 0) {
          ledger.unattributed += delta
          save()
          publish({ unattributed: ledger.unattributed })
          return
        }
        const share = delta / targets.length
        for (const id of targets) {
          const entry = ledger.sessions[id]
          entry.spent += share
        }
        save()
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
        if (ledger.sessions[key] === undefined) {
          ledger.sessions[key] = { spent: 0, at: Date.now() }
          save()
        }
        return () => {
          mounted.delete(key)
        }
      }

      /** Credit attributed to one Session. */
      const usedFor = (sessionId) => {
        const entry = ledger.sessions[text(sessionId)]
        return entry === undefined ? 0 : entry.spent
      }

      /** When that Session's counter was opened. */
      const sinceFor = (sessionId) => {
        const entry = ledger.sessions[text(sessionId)]
        return entry === undefined ? 0 : entry.at
      }

      /**
       * Learn that a Session is a subagent child, so its spend can be folded into the
       * Session that spawned it. The summary carries the parent and the origin; a child
       * whose parent has no visible counter is simply skipped by `attribute`.
       */
      const noteSession = (summary) => {
        if (summary === null || typeof summary !== 'object') return
        if (summary.origin !== 'subagent') return
        const child = text(summary.sessionId)
        const parent = text(summary.parentSessionId)
        if (!child || child === 'undefined' || child === 'null') return
        if (!parent || parent === 'undefined' || parent === 'null') return
        if (child === parent) return
        parents.set(child, parent)
      }

      const runningCount = () => {
        let count = 0
        for (const value of statuses.values()) if (value) count += 1
        return count
      }

      /**
       * Follow Session running state. A run starting also opens the interval it will
       * be charged for, and a run ending records when it happened (late settlement
       * needs it) and lets billing settle before the closing read; the widget
       * otherwise polls while anything is in flight.
       */
      const noteStatus = (sessionId, running) => {
        const key = text(sessionId)
        const next = running === true
        if (statuses.get(key) === next) return
        statuses.set(key, next)
        const owner = ownerOf(key)
        if (known(owner)) {
          // Stamped at both ends: a page reloaded mid-run still has a grace target.
          ledger.lastRunAt[owner] = Date.now()
          save()
        }
        if (next) intervalRunning.add(key)
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
        const owner = ownerOf(key)
        if (known(owner)) {
          ledger.lastRunAt[owner] = Date.now()
          save()
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
        ledger.sessions = {}
        ledger.lastRunAt = {}
        ledger.lastTotal = null
        ledger.lastReadAt = null
        ledger.unattributed = 0
        intervalRunning.clear()
        parents.clear()
        for (const id of mounted) ledger.sessions[id] = { spent: 0, at: Date.now() }
        save()
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
          unattributed: 0,
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
        noteSession,
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
      const base =
        updated === null ? t('refresh') : t('updated') + ' ' + formatTime(updated.getTime())
      // Money no Session could claim is shown only here, so the total can be
      // reconciled when it drifts.
      const title =
        snapshot.unattributed > 0.005
          ? base +
            ' · ' +
            t('unattributed') +
            ' ' +
            symbol +
            formatAmount(snapshot.unattributed)
          : base
      return h(
        'div',
        {
          className: 'qm',
          'data-state': snapshot.state,
          'data-running': snapshot.running > 0 ? 'true' : 'false',
          title,
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
        // Session summaries carry a subagent child's origin and parent, which is what
        // lets its spend be folded into the Session that spawned it.
        ctx.effect(
          () =>
            listen('api-session/added', (summary) => {
              store.noteSession(summary)
            }),
          'quota-meter: session identity',
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

/**
 * Client half of the input-polish bundle.
 *
 * Two contributions:
 * - a composer button that starts a Host polish job and collects its answer,
 *   so a rewrite keeps running while the user is in another Session;
 * - a General settings row where the polish model is chosen from the models the
 *   installed providers actually advertise.
 */
window.__ModuleLoader__.load({
  id: '@lieakks/dsh-plugin-input-polish',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Locale namespace of every visible string this plugin adds. */
    const NS = 'input-polish'

    /** Browser-relative form of the Host route, resolved against the page base. */
    const ROUTE = 'api/input-polish'

    /** Mirrors the Host ceiling so a long draft fails before the request. */
    const MAX_DRAFT_CHARS = 4000

    /** Mirrors the Host ceiling for a custom system prompt. */
    const MAX_PROMPT_CHARS = 8000

    /** Polling cadence while one polish job is in flight. */
    const POLL_MS = 900

    /** How long one failure or confirmation stays visible. */
    const NOTICE_MS = 8000

    /** Dictionaries for the two shipped languages; others fall back to English. */
    const DICTS = {
      en: {
        label: 'Polish',
        hint: 'Rewrite this draft into a more specific message with the polish model (Settings → General → Input polish model)',
        empty: 'Type a draft first',
        refs: 'Polish replaces the whole draft, so remove the @ references first',
        tooLong: 'The draft is longer than 4000 characters',
        busy: 'A submission is in progress',
        busyAnnounce: 'Polishing the draft',
        cancel: 'Cancel polishing',
        cancelled: 'Polishing cancelled',
        doneAnnounce: 'Draft polished. Review it before sending.',
        stale: 'The draft changed while polishing, so the result was not applied',
        failed: 'Polishing failed',
        timeout: 'Polishing timed out',
        modelUnavailable: 'The polish model is unavailable. Choose another one in Settings → General.',
        truncated: 'The answer was cut off, so it was not applied. Try again.',
        emptyAnswer: 'The model returned no text',
        settingsTitle: 'Input polish model',
        settingsDescription: 'The model and reasoning effort used by the composer polish button. Polishing never uses the Session model, so it cannot slow down or bill your main conversation model.',
        settingsModel: 'Model',
        settingsEffort: 'Reasoning effort',
        settingsDefault: 'Model default',
        settingsSave: 'Save',
        settingsSaving: 'Saving…',
        settingsSaved: 'Saved.',
        settingsLoading: 'Loading models…',
        settingsLoadFailed: 'Could not read the installed models.',
        settingsSaveFailed: 'Could not save: {{message}}',
        settingsNotPersisted: 'Applied, but this profile cannot store the choice; it resets when the app restarts.',
        settingsPromptEdit: 'Edit prompt',
        settingsPromptHide: 'Hide prompt',
        settingsPromptLabel: 'System instructions',
        settingsPromptHint: 'Leave it empty or restore the default to use the built-in prompt. This replaces the system instructions only; the context and the draft are still appended the same way.',
        settingsPromptReset: 'Restore default',
        settingsPromptResetConfirm: 'Confirm restore',
        settingsPromptTooLong: 'The prompt is longer than {{max}} characters',
        settingsUnregistered: '{{model}} (not advertised)',
        settingsNoModels: 'No provider advertises a model.',
      },
      zh: {
        label: '润色',
        hint: '用润色专用的模型把草稿改写得更具体（设置 → 通用 → 输入润色模型）',
        empty: '请先输入内容',
        refs: '润色会替换整段草稿，请先移除 @ 引用',
        tooLong: '草稿超过 4000 字符',
        busy: '正在发送，暂时不能润色',
        busyAnnounce: '正在润色草稿',
        cancel: '取消润色',
        cancelled: '已取消润色',
        doneAnnounce: '已润色，发送前请再检查一遍',
        stale: '润色期间草稿已改动，结果未写入',
        failed: '润色失败',
        timeout: '润色超时',
        modelUnavailable: '润色模型不可用，请到 设置 → 通用 里换一个',
        truncated: '输出被截断，结果未写入，请重试',
        emptyAnswer: '模型没有返回文本',
        settingsTitle: '输入润色模型',
        settingsDescription: '输入框润色按钮使用的模型与思考档位。润色不会使用会话模型，所以不会拖慢或计费到你的主对话模型上。',
        settingsModel: '模型',
        settingsEffort: '思考档位',
        settingsDefault: '模型默认',
        settingsSave: '保存',
        settingsSaving: '保存中…',
        settingsSaved: '已保存。',
        settingsLoading: '正在读取模型…',
        settingsLoadFailed: '读取已注册模型失败。',
        settingsSaveFailed: '保存失败：{{message}}',
        settingsNotPersisted: '已生效，但这个 profile 无法保存该选择；应用重启后会恢复默认。',
        settingsPromptEdit: '编辑提示词',
        settingsPromptHide: '收起提示词',
        settingsPromptLabel: '系统指令',
        settingsPromptHint: '留空或恢复默认即使用内置提示词。这里只替换系统指令，上下文与草稿的拼接方式不变。',
        settingsPromptReset: '恢复默认',
        settingsPromptResetConfirm: '确认恢复',
        settingsPromptTooLong: '提示词超过 {{max}} 字符',
        settingsUnregistered: '{{model}}（未注册）',
        settingsNoModels: '没有 provider 声明可用模型。',
      },
    }

    /** Failure codes the Host reports, mapped to dictionary keys. */
    const FAILURE_KEYS = {
      'draft-empty': 'empty',
      'draft-too-long': 'tooLong',
      'model-unavailable': 'modelUnavailable',
      'model-truncated': 'truncated',
      'model-empty': 'emptyAnswer',
      'model-failed': 'failed',
      'bad-request': 'failed',
      timeout: 'timeout',
      cancelled: 'cancelled',
    }

    /** Styles shared by the button and the settings row. */
    const STYLES = [
      '.dsh-ip-btn{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto;height:28px;',
      'padding:0 8px 0 7px;border:0;border-radius:6px;background:transparent;',
      'color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;font-weight:500;',
      'line-height:20px;white-space:nowrap;cursor:pointer;',
      'transition:background-color 120ms ease,color 120ms ease,opacity 120ms ease}',
      '.dsh-ip-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);',
      'color:var(--dsw-alias-label-primary)}',
      '.dsh-ip-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsh-ip-btn:disabled{opacity:.5;cursor:default}',
      '.dsh-ip-btn[data-state="error"]{color:var(--dsw-alias-state-error-primary)}',
      '.dsh-ip-btn[data-state="busy"]{opacity:.75}',
      '@keyframes dsh-input-polish-spin{to{transform:rotate(360deg)}}',
      '.dsh-ip-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;',
      'clip:rect(0 0 0 0);white-space:nowrap;border:0}',
      '.dsh-ip-row{display:flex;flex-direction:column;gap:10px;',
      'padding:12px 0;border-top:1px solid var(--dsw-alias-border-l1)}',
      '.dsh-ip-main{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}',
      '.dsh-ip-editor{display:flex;flex-direction:column;gap:6px}',
      '.dsh-ip-editor-head{display:flex;align-items:center;justify-content:space-between;gap:8px;',
      'font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dsh-ip-editor-foot{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}',
      '.dsh-ip-textarea{width:100%;min-height:132px;resize:vertical;box-sizing:border-box;padding:8px;',
      'border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);',
      'color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px}',
      '.dsh-ip-textarea:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsh-ip-link{border:0;background:transparent;padding:0;color:var(--dsw-alias-brand-primary);',
      'font:inherit;font-size:12px;cursor:pointer;text-decoration:underline;text-underline-offset:2px}',
      '.dsh-ip-link[data-tone="danger"]{color:var(--dsw-alias-state-error-primary)}',
      '.dsh-ip-link:disabled{opacity:.5;cursor:default;text-decoration:none}',
      '.dsh-ip-link:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
      '.dsh-ip-copy{display:flex;flex-direction:column;gap:2px;min-width:0}',
      '.dsh-ip-name{font-size:13px;font-weight:500;color:var(--dsw-alias-label-primary)}',
      '.dsh-ip-help{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);max-width:46ch}',
      '.dsh-ip-controls{display:flex;align-items:center;gap:8px;flex:0 0 auto;flex-wrap:wrap;justify-content:flex-end}',
      '.dsh-ip-select{height:28px;max-width:210px;padding:0 6px;border-radius:6px;',
      'border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);',
      'color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}',
      '.dsh-ip-select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsh-ip-save{height:28px;padding:0 12px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2);',
      'background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;',
      'font-weight:500;cursor:pointer}',
      '.dsh-ip-save:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}',
      '.dsh-ip-save:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsh-ip-save:disabled{opacity:.5;cursor:default}',
      '.dsh-ip-status{font-size:12px;color:var(--dsw-alias-label-secondary);width:100%;text-align:right}',
      '.dsh-ip-status[data-tone="error"]{color:var(--dsw-alias-state-error-primary)}',
    ].join('')

    /**
     * Translate one key, falling back to plain English when the locale seat is absent.
     * @param t - the injected translate function, when the slot supplies one.
     * @param key - dictionary key.
     * @param fallback - text used when no dictionary resolves the key.
     * @returns the visible text.
     */
    function say(t, key, fallback) {
      if (typeof t !== 'function') return fallback
      try {
        const value = t(key)
        if (typeof value !== 'string' || value === '' || value === key) return fallback
        return value
      } catch {
        return fallback
      }
    }

    /**
     * Fill the Host-style placeholders of one dictionary string.
     * @param text - dictionary text.
     * @param values - placeholder values keyed by name.
     * @returns the visible text.
     */
    function fill(text, values) {
      let out = text
      for (const [name, value] of Object.entries(values)) out = out.split(`{{${name}}}`).join(String(value))
      return out
    }

    /**
     * Call one Host command.
     * @param action - command name.
     * @param payload - command arguments.
     * @param signal - caller cancellation.
     * @returns the decoded answer.
     * @throws an Error carrying the Host `code`.
     */
    async function call(action, payload, signal) {
      const response = await fetch(new URL(ROUTE, document.baseURI), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
        signal,
      })
      let body
      try {
        body = await response.json()
      } catch {
        throw Object.assign(new Error(`HTTP ${response.status}`), { code: '' })
      }
      if (body?.ok === true) return body
      throw Object.assign(
        new Error(typeof body?.message === 'string' ? body.message : `HTTP ${response.status}`),
        { code: typeof body?.code === 'string' ? body.code : '' },
      )
    }

    /**
     * Announce model spend to same-page trackers, so a spend meter can charge this
     * call to the Session it was started from. Best effort by design: no tracker,
     * a locked-down page or a throwing listener must never break a polish.
     * @param sessionId - the Session whose draft is being rewritten.
     * @param phase - `start` when the Host call is dispatched, `end` once it settles.
     */
    function announceSpend(sessionId, phase) {
      if (typeof sessionId !== 'string' || sessionId === '') return
      try {
        window.dispatchEvent(
          new CustomEvent('dsh:spend-source', {
            detail: { sessionId, source: 'polish', phase },
          }),
        )
      } catch (error) {
        // A page without CustomEvent support simply has no tracker to tell.
      }
    }

    /** Sparkle mark for the idle button. */
    function SparkleIcon() {
      return h('svg', {
        width: 14, height: 14, viewBox: '0 0 16 16', 'aria-hidden': true,
        style: { display: 'block', flex: '0 0 auto' },
      },
      h('path', {
        d: 'M6.3 1.6 C6.75 4.3 8 5.55 10.7 6 C8 6.45 6.75 7.7 6.3 10.4 C5.85 7.7 4.6 6.45 1.9 6 C4.6 5.55 5.85 4.3 6.3 1.6 Z',
        fill: 'currentColor',
      }),
      h('path', {
        d: 'M11.7 9.2 C11.95 10.55 12.65 11.25 14 11.5 C12.65 11.75 11.95 12.45 11.7 13.8 C11.45 12.45 10.75 11.75 9.4 11.5 C10.75 11.25 11.45 10.55 11.7 9.2 Z',
        fill: 'currentColor',
        opacity: 0.7,
      }))
    }

    /** Indeterminate progress ring shown while one rewrite is in flight. */
    function SpinnerIcon() {
      return h('span', {
        'aria-hidden': true,
        style: {
          display: 'block', flex: '0 0 auto', width: 11, height: 11,
          borderRadius: '50%',
          border: '1.5px solid currentColor',
          borderTopColor: 'transparent',
          animation: 'dsh-input-polish-spin 700ms linear infinite',
        },
      })
    }

    /**
     * Render the composer button and its announcement.
     *
     * The job lives in the Host, so leaving the Session never cancels it: the
     * polling effect stops, and the next mount collects whatever the job
     * reached.
     * @param props - slot runtime props plus the injected call helper.
     */
    function PolishButton(props) {
      const { inputActions, useInput, sessionId, t } = props
      const input = useInput(state => state)
      const draft = typeof input?.draft === 'string' ? input.draft : ''
      const phase = typeof input?.phase === 'string' ? input.phase : 'plain'
      const references = Array.isArray(input?.occurrences) ? input.occurrences.length : 0
      const [status, setStatus] = React.useState({ kind: 'idle' })
      const latest = React.useRef({ draft, sessionId })
      const alive = React.useRef(true)
      latest.current = { draft, sessionId }
      React.useEffect(() => {
        alive.current = true
        return () => { alive.current = false }
      }, [])
      React.useEffect(() => {
        if (status.kind !== 'error' && status.kind !== 'done') return undefined
        const timer = setTimeout(() => { setStatus({ kind: 'idle' }) }, NOTICE_MS)
        return () => { clearTimeout(timer) }
      }, [status])

      /**
       * Collect one finished job into the composer.
       * @param job - the Host job view.
       */
      const settle = (job) => {
        if (!alive.current) return
        announceSpend(typeof job.sessionId === 'string' ? job.sessionId : latest.current.sessionId, 'end')
        if (job.status === 'done' && typeof job.text === 'string') {
          if (latest.current.draft.trim() !== String(job.draft ?? '').trim()) {
            setStatus({ kind: 'error', text: say(t, 'stale', 'The draft changed while polishing, so the result was not applied') })
          } else {
            inputActions.setDraft(job.text)
            setStatus({ kind: 'done', model: typeof job.model === 'string' ? job.model : '' })
          }
        } else if (job.code === 'cancelled') {
          setStatus({ kind: 'idle' })
        } else {
          const key = FAILURE_KEYS[String(job.code ?? '')] ?? 'failed'
          setStatus({
            kind: 'error',
            text: say(t, key, say(t, 'failed', 'Polishing failed')),
            detail: typeof job.message === 'string' ? job.message : '',
          })
        }
        void call('consume', { sessionId: job.sessionId, jobId: job.id }).catch(() => {})
      }

      // Collect a job that ran while this Session was not on screen.
      React.useEffect(() => {
        let cancelled = false
        const timer = setTimeout(() => {
          void call('poll', { sessionId }).then((answer) => {
            if (cancelled || !answer?.job) return
            const job = answer.job
            if (job.status === 'running') setStatus({ kind: 'busy' })
            else settle(job)
          }).catch(() => {})
        }, 0)
        return () => { cancelled = true; clearTimeout(timer) }
        // `settle` closes over the current render's values, which is what it needs.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [sessionId])

      // Follow the running job; unmounting stops only the follow, never the job.
      React.useEffect(() => {
        if (status.kind !== 'busy') return undefined
        let cancelled = false
        let timer
        const tick = () => {
          void call('poll', { sessionId }).then((answer) => {
            if (cancelled) return
            const job = answer?.job
            if (!job || job.status === 'running') { timer = setTimeout(tick, POLL_MS); return }
            settle(job)
          }).catch(() => {
            if (!cancelled) timer = setTimeout(tick, POLL_MS)
          })
        }
        timer = setTimeout(tick, POLL_MS)
        return () => { cancelled = true; clearTimeout(timer) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [status.kind, sessionId])

      const text = draft.trim()
      const busy = status.kind === 'busy'
      const hasDraft = text !== ''
      const tooLong = text.length > MAX_DRAFT_CHARS
      // Every refusal below is explained in the tooltip, never by a silent no-op.
      const blocked = phase !== 'plain' ? 'busy' : references > 0 ? 'refs' : tooLong ? 'tooLong' : ''
      const enabled = busy || (hasDraft && blocked === '')
      const label = say(t, 'label', 'Polish')
      const reason = busy
        ? say(t, 'cancel', 'Cancel polishing')
        : !hasDraft
          ? say(t, 'empty', 'Type a draft first')
          : blocked !== ''
            ? say(t, blocked, blocked)
            : say(t, 'hint', 'Rewrite this draft into a more specific message')
      const announcement = busy
        ? say(t, 'busyAnnounce', 'Polishing the draft')
        : status.kind === 'done'
          ? say(t, 'doneAnnounce', 'Draft polished. Review it before sending.')
          : status.kind === 'error' ? status.text : ''

      const onClick = () => {
        if (busy) {
          setStatus({ kind: 'idle' })
          // The Host stops the call; close the window now and let the meter's
          // settle reading account for whatever the run already cost.
          announceSpend(sessionId, 'end')
          void call('cancel', { sessionId }).catch(() => {})
          return
        }
        setStatus({ kind: 'busy' })
        announceSpend(sessionId, 'start')
        void call('start', { sessionId, draft: text }).then((answer) => {
          if (!alive.current) return
          const job = answer?.job
          if (job && job.status !== 'running') settle(job)
        }).catch((error) => {
          announceSpend(sessionId, 'end')
          if (!alive.current) return
          const key = FAILURE_KEYS[String(error?.code ?? '')] ?? 'failed'
          setStatus({
            kind: 'error',
            text: say(t, key, say(t, 'failed', 'Polishing failed')),
            detail: String(error?.message ?? ''),
          })
        })
      }

      return h('span', { style: { display: 'inline-flex', alignItems: 'center' } },
      h('style', { key: 'styles' }, STYLES),
      h('button', {
        key: 'button',
        type: 'button',
        className: 'dsh-ip-btn',
        disabled: !enabled,
        'data-state': busy ? 'busy' : status.kind === 'error' ? 'error' : 'idle',
        'aria-busy': busy ? 'true' : undefined,
        title: status.kind === 'error'
          ? (status.detail ? `${status.text} · ${status.detail}` : status.text)
          : status.kind === 'done'
            ? [say(t, 'doneAnnounce', 'Draft polished. Review it before sending.'), status.model].filter(Boolean).join(' · ')
            : reason,
        onClick,
        onMouseDown: event => { event.preventDefault() },
      }, busy ? h(SpinnerIcon) : h(SparkleIcon), h('span', null, label)),
      h('span', {
        key: 'live',
        className: 'dsh-ip-sr',
        role: 'status',
        'aria-live': 'polite',
      }, announcement))
    }

    /**
     * Admit only the occupancy that carries a Session-bound composer seat.
     * @param props - whatever the slot passes to this entry.
     * @returns the button, or nothing while the seat is unavailable.
     */
    function Entry(props) {
      if (typeof props.useInput !== 'function') return null
      if (props.inputActions === undefined || props.inputActions === null) return null
      if (typeof props.sessionId !== 'string') return null
      return h(PolishButton, props)
    }

    /**
     * Render the "input polish model" preference row.
     * @param props - root settings slot props, including the locale seat.
     */
    function SettingsRow(props) {
      const { t } = props
      const [providers, setProviders] = React.useState([])
      const [saved, setSaved] = React.useState(undefined)
      const [efforts, setEfforts] = React.useState([])
      const [provider, setProvider] = React.useState('')
      const [model, setModel] = React.useState('')
      const [effort, setEffort] = React.useState('')
      const [phase, setPhase] = React.useState('loading')
      const [message, setMessage] = React.useState({ tone: 'plain', text: '' })
      const [defaultPrompt, setDefaultPrompt] = React.useState('')
      const [maxPrompt, setMaxPrompt] = React.useState(MAX_PROMPT_CHARS)
      const [promptDraft, setPromptDraft] = React.useState('')
      const [editorOpen, setEditorOpen] = React.useState(false)
      const [confirmReset, setConfirmReset] = React.useState(false)
      const alive = React.useRef(true)
      React.useEffect(() => {
        alive.current = true
        return () => { alive.current = false }
      }, [])

      /**
       * Load the effort options of one model.
       * @param nextProvider - provider route.
       * @param nextModel - model id.
       * @param current - effort to keep when the model still supports it.
       */
      const loadEfforts = (nextProvider, nextModel, current) => {
        void call('modelInfo', { provider: nextProvider, model: nextModel }).then((answer) => {
          if (!alive.current) return
          const list = Array.isArray(answer?.efforts) ? answer.efforts : []
          setEfforts(list)
          const keep = current !== '' && list.some(item => item.id === current) ? current : ''
          setEffort(keep)
        }).catch(() => {
          if (alive.current) setEfforts([])
        })
      }

      React.useEffect(() => {
        let cancelled = false
        void (async () => {
          try {
            const [catalog, settings] = await Promise.all([call('models'), call('getSettings')])
            if (cancelled || !alive.current) return
            setProviders(Array.isArray(catalog?.providers) ? catalog.providers : [])
            if (typeof settings?.maxPromptChars === 'number' && settings.maxPromptChars > 0) {
              setMaxPrompt(settings.maxPromptChars)
            }
            const fallbackPrompt = typeof settings?.defaults?.prompt === 'string' ? settings.defaults.prompt : ''
            setDefaultPrompt(fallbackPrompt)
            const current = settings?.settings
            if (current && typeof current.provider === 'string') {
              setSaved(current)
              setProvider(current.provider)
              setModel(current.model)
              setEffort(current.reasoningEffort ?? '')
              setPromptDraft(typeof current.prompt === 'string' && current.prompt !== '' ? current.prompt : fallbackPrompt)
              loadEfforts(current.provider, current.model, current.reasoningEffort ?? '')
            }
            setPhase('ready')
          } catch {
            if (cancelled || !alive.current) return
            setPhase('failed')
            setMessage({ tone: 'error', text: say(t, 'settingsLoadFailed', 'Could not read the installed models.') })
          }
        })()
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      const onPickModel = (value) => {
        const separator = value.indexOf('|')
        const nextProvider = value.slice(0, separator)
        const nextModel = value.slice(separator + 1)
        setProvider(nextProvider)
        setModel(nextModel)
        setMessage({ tone: 'plain', text: '' })
        loadEfforts(nextProvider, nextModel, effort)
      }

      React.useEffect(() => {
        if (!confirmReset) return undefined
        const timer = setTimeout(() => { setConfirmReset(false) }, 5000)
        return () => { clearTimeout(timer) }
      }, [confirmReset])

      /**
       * Persist one complete settings document through the Host.
       * @param next - provider, model, reasoning effort, and prompt to store.
       */
      const persist = (next) => {
        setPhase('saving')
        setMessage({ tone: 'plain', text: '' })
        void call('saveSettings', { settings: next }).then((answer) => {
          if (!alive.current) return
          if (answer?.settings) {
            setSaved(answer.settings)
            setProvider(answer.settings.provider)
            setModel(answer.settings.model)
            setEffort(answer.settings.reasoningEffort ?? '')
          }
          setPhase('ready')
          setMessage(answer?.settings?.persisted === false
            ? { tone: 'error', text: say(t, 'settingsNotPersisted', 'Applied, but this profile cannot store the choice.') }
            : { tone: 'plain', text: say(t, 'settingsSaved', 'Saved.') })
        }).catch((error) => {
          if (!alive.current) return
          setPhase('ready')
          setMessage({
            tone: 'error',
            text: fill(say(t, 'settingsSaveFailed', 'Could not save: {{message}}'), { message: String(error?.message ?? '') }),
          })
        })
      }

      /** Store the edited settings, dropping a prompt left identical to the default. */
      const save = () => {
        persist({
          provider,
          model,
          reasoningEffort: effort,
          prompt: promptDraft.trim() === defaultPrompt.trim() ? '' : promptDraft,
        })
      }

      /**
       * Restore the built-in prompt and store the cleared value, keeping the
       * model choice that is currently saved rather than unsaved picks.
       */
      const restoreDefault = () => {
        const base = saved ?? {}
        setPromptDraft(defaultPrompt)
        setConfirmReset(false)
        persist({
          provider: typeof base.provider === 'string' ? base.provider : provider,
          model: typeof base.model === 'string' ? base.model : model,
          reasoningEffort: typeof base.reasoningEffort === 'string' ? base.reasoningEffort : effort,
          prompt: '',
        })
      }

      const options = []
      for (const entry of providers) {
        const models = Array.isArray(entry.models) ? entry.models : []
        if (models.length === 0) continue
        options.push(h('optgroup', { key: entry.id, label: entry.name ?? entry.id },
          models.map(item => h('option', { key: `${entry.id}|${item.id}`, value: `${entry.id}|${item.id}` },
            `${item.name ?? item.id} · ${entry.name ?? entry.id}`))))
      }
      // A saved route that no provider advertises stays selectable, so the row
      // shows exactly what the next polish will try instead of silently resetting.
      const advertised = providers.some(entry => Array.isArray(entry.models)
        && entry.models.some(item => entry.id === provider && item.id === model))
      const missing = provider !== '' && model !== '' && !advertised
      const selected = provider !== '' && model !== '' ? `${provider}|${model}` : ''
      const savedPrompt = saved !== undefined && typeof saved.prompt === 'string' ? saved.prompt : ''
      const initialPrompt = savedPrompt !== '' ? savedPrompt : defaultPrompt
      const promptChanged = promptDraft.trim() !== initialPrompt.trim()
      const promptTooLong = promptDraft.length > maxPrompt
      const dirty = saved === undefined
        || saved.provider !== provider || saved.model !== model || (saved.reasoningEffort ?? '') !== effort
        || promptChanged

      const effortOptions = [h('option', { key: 'default', value: '' }, say(t, 'settingsDefault', 'Model default'))]
      for (const item of efforts) {
        effortOptions.push(h('option', { key: item.id, value: item.id }, item.name ?? item.id))
      }
      if (effort !== '' && !efforts.some(item => item.id === effort)) {
        effortOptions.push(h('option', { key: `kept-${effort}`, value: effort }, effort))
      }

      const modelOptions = []
      if (missing) {
        modelOptions.push(h('option', { key: 'missing', value: selected },
          fill(say(t, 'settingsUnregistered', '{{model}} (not advertised)'), { model })))
      }
      for (const group of options) modelOptions.push(group)

      const copy = h('div', { className: 'dsh-ip-copy' },
        h('span', { key: 'name', className: 'dsh-ip-name' }, say(t, 'settingsTitle', 'Input polish model')),
        h('span', { key: 'help', className: 'dsh-ip-help' }, say(t, 'settingsDescription', '')),
        h('button', {
          key: 'toggle',
          type: 'button',
          className: 'dsh-ip-link',
          style: { alignSelf: 'flex-start' },
          onClick: () => { setEditorOpen(open => !open); setConfirmReset(false) },
        }, editorOpen
          ? say(t, 'settingsPromptHide', 'Hide prompt')
          : say(t, 'settingsPromptEdit', 'Edit prompt')))

      const controlCells = [
        h('select', {
          key: 'model',
          className: 'dsh-ip-select',
          'aria-label': say(t, 'settingsModel', 'Model'),
          value: selected,
          disabled: phase === 'saving' || (modelOptions.length === 0 && !missing),
          onChange: event => { onPickModel(event.target.value) },
        }, modelOptions),
        h('select', {
          key: 'effort',
          className: 'dsh-ip-select',
          'aria-label': say(t, 'settingsEffort', 'Reasoning effort'),
          value: effort,
          disabled: phase === 'saving',
          onChange: event => { setEffort(event.target.value); setMessage({ tone: 'plain', text: '' }) },
        }, effortOptions),
        h('button', {
          key: 'save',
          type: 'button',
          className: 'dsh-ip-save',
          disabled: phase !== 'ready' || !dirty || promptTooLong || provider === '' || model === '',
          onClick: save,
        }, phase === 'saving' ? say(t, 'settingsSaving', 'Saving…') : say(t, 'settingsSave', 'Save')),
      ]
      if (message.text !== '') {
        controlCells.push(h('span', {
          key: 'status',
          className: 'dsh-ip-status',
          'data-tone': message.tone,
        }, message.text))
      }

      const controls = h('div', { className: 'dsh-ip-controls' },
        phase === 'loading'
          ? h('span', { className: 'dsh-ip-help' }, say(t, 'settingsLoading', 'Loading models…'))
          : controlCells)

      const editor = editorOpen
        ? h('div', { key: 'editor', className: 'dsh-ip-editor' },
          h('div', { className: 'dsh-ip-editor-head' },
            h('span', null, say(t, 'settingsPromptLabel', 'System instructions')),
            h('span', null, `${promptDraft.length} / ${maxPrompt}`)),
          h('textarea', {
            className: 'dsh-ip-textarea',
            value: promptDraft,
            rows: 8,
            spellCheck: false,
            'aria-label': say(t, 'settingsPromptLabel', 'System instructions'),
            onChange: event => {
              setPromptDraft(event.target.value)
              setMessage({ tone: 'plain', text: '' })
            },
          }),
          h('div', { className: 'dsh-ip-editor-foot' },
            h('span', { className: 'dsh-ip-help' }, promptTooLong
              ? fill(say(t, 'settingsPromptTooLong', 'The prompt is longer than {{max}} characters'), { max: maxPrompt })
              : say(t, 'settingsPromptHint', '')),
            h('button', {
              type: 'button',
              className: 'dsh-ip-link',
              'data-tone': confirmReset ? 'danger' : undefined,
              disabled: defaultPrompt === '' || phase === 'saving',
              onClick: () => {
                if (confirmReset) restoreDefault()
                else setConfirmReset(true)
              },
            }, confirmReset
              ? say(t, 'settingsPromptResetConfirm', 'Confirm restore')
              : say(t, 'settingsPromptReset', 'Restore default'))))
        : null

      return h('div', { className: 'dsh-ip-row' },
        h('style', { key: 'styles' }, STYLES),
        h('div', { key: 'main', className: 'dsh-ip-main' }, copy, controls),
        editor)
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          // One locale at a time so an HMR reload that still holds the previous
          // registration only skips that language instead of failing the plugin.
          const disposers = []
          for (const [locale, dict] of Object.entries(DICTS)) {
            try {
              disposers.push(ctx.locale.register(NS, locale, dict))
            } catch {
              // Already registered by the previous generation.
            }
          }
          return () => { for (const dispose of disposers) dispose() }
        }, 'input-polish: dictionaries')
        ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
          name: 'conversation.input.left',
          id: 'input-polish',
          order: 10,
          locale: NS,
        }, Entry))
        ctx.slots.inject('settings.general.item', () => ctx.slots.register({
          name: 'settings.general.item',
          id: 'input-polish',
          order: 21,
          locale: NS,
        }, SettingsRow))
      },
    }
  },
})

/**
 * Host half of the input-polish bundle.
 *
 * Owns the whole polish lifecycle so a rewrite keeps running when the browser
 * leaves the Session: one authenticated Fetch route exposes a small command
 * set, and the model call lives in a Session-keyed job table until the Client
 * collects or cancels it. Nothing is appended to the Session log.
 */

/** Services this plugin cannot work without. */
export const inject = ['connection', 'llm']

/** Absolute route below `/api` that receives every polish command. */
const ROUTE_PATH = '/api/input-polish'

/** Longest accepted draft, in characters. */
const MAX_DRAFT_CHARS = 4000

/** Longest context transcript, in characters, sent alongside the draft. */
const MAX_CONTEXT_CHARS = 6000

/** Most recent messages folded into the context transcript. */
const MAX_CONTEXT_MESSAGES = 12

/** Longest single message kept in the context transcript. */
const MAX_MESSAGE_CHARS = 1200

/** Longest custom system prompt accepted from the settings row. */
const MAX_PROMPT_CHARS = 8000

/** Wall-clock ceiling for one polish job. */
const TIMEOUT_MS = 120_000

/** Finished jobs kept per Session before the oldest are dropped. */
const MAX_FINISHED_JOBS = 50

/** How long a finished job waits to be collected, in milliseconds. */
const JOB_TTL_MS = 30 * 60_000

/**
 * Settings used until the user saves their own choice in Settings → General.
 * The polish model is deliberately not the Session model: rewriting a draft is
 * a small, high-volume task, so it defaults to a fast model at low effort.
 */
const DEFAULT_SETTINGS = { provider: 'deepseek-account', model: 'deepseek-flash', reasoningEffort: 'low' }

/** Instructions for the rewriting call; the draft never becomes a Session message. */
const SYSTEM_PROMPT = `You rewrite one chat message that a user is about to send to an AI coding agent. Produce a version the agent can act on with the least ambiguity.

Rules:
- Keep the author's language, intent, and tone, and keep every concrete fact: names, paths, commands, versions, numbers, identifiers, URLs, quoted text, and code.
- Turn vague wording into specific wording. When the draft implies a goal, a constraint, or an expected result, state those plainly. Never invent requirements, files, or facts the draft does not imply.
- Keep it as one message the user could send as-is. Add no preamble, no explanation, no alternatives, and no questions.
- If the draft is already specific, only tighten grammar and structure; do not pad it.
- Answer with the rewritten message alone: no surrounding quotes, no label, and no code fence.`

/** One failure that carries a stable code the Client maps to localized text. */
class PolishError extends Error {
  /**
   * @param code - stable failure code.
   * @param message - technical detail, never the primary user-facing text.
   * @param status - HTTP status the route answers with.
   */
  constructor(code, message, status) {
    super(message)
    this.code = code
    this.status = status
  }
}

/**
 * Answer one request with a JSON document.
 * @param status - HTTP status code.
 * @param value - JSON-serializable body.
 * @returns the response the browser receives.
 */
function json(status, value) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

/**
 * Read a message from an unknown thrown value.
 * @param error - whatever a callee threw.
 * @returns readable detail for the Client's tooltip.
 */
function messageOf(error) {
  if (error instanceof Error && error.message !== '') return error.message
  const text = String(error)
  return text === '' ? 'the request failed' : text
}

/**
 * Keep the text blocks of one derived message.
 * @param message - a message from `Session.deriveMessages()`.
 * @returns its concatenated text, or an empty string when it carries none.
 */
function textOfMessage(message) {
  const content = Array.isArray(message?.content) ? message.content : []
  const parts = []
  for (const block of content) {
    if (block?.type === 'text' && typeof block.text === 'string' && block.text.trim() !== '') parts.push(block.text)
  }
  return parts.join('\n').trim()
}

/**
 * Resolve one live Session by id.
 * @param ctx - the plugin Context.
 * @param sessionId - the Session the composer belongs to.
 * @returns the Session, or undefined when this process holds no such Session.
 */
function sessionOf(ctx, sessionId) {
  if (typeof sessionId !== 'string' || sessionId === '') return undefined
  const sessions = ctx.get('sessions')
  if (sessions === undefined) return undefined
  try {
    return sessions.get(sessionId)
  } catch {
    return undefined
  }
}

/**
 * Build the recent-conversation transcript for one Session.
 * @param session - the live Session, when known.
 * @returns a bounded transcript, or an empty string when none is available.
 */
function buildTranscript(session) {
  if (session === undefined || typeof session.deriveMessages !== 'function') return ''
  let messages
  try {
    messages = session.deriveMessages()
  } catch {
    return ''
  }
  const turns = []
  for (const message of messages) {
    if (message?.role !== 'user' && message?.role !== 'assistant') continue
    const text = textOfMessage(message)
    if (text === '') continue
    const clipped = text.length > MAX_MESSAGE_CHARS ? `${text.slice(0, MAX_MESSAGE_CHARS)}…` : text
    turns.push(`${message.role === 'user' ? 'User' : 'Assistant'}: ${clipped}`)
  }
  if (turns.length === 0) return ''
  // The tail is the part that matters for a draft written now.
  let transcript = turns.slice(-MAX_CONTEXT_MESSAGES).join('\n\n')
  if (transcript.length > MAX_CONTEXT_CHARS) transcript = `…${transcript.slice(-MAX_CONTEXT_CHARS)}`
  return transcript
}

/**
 * Strip the wrappers a model sometimes adds around an otherwise plain answer.
 * @param text - the raw answer.
 * @returns the message to place in the composer.
 */
function cleanAnswer(text) {
  let answer = text.trim()
  const fence = /^```[^\n]*\n([\s\S]*?)\n?```$/.exec(answer)
  if (fence !== null) answer = fence[1].trim()
  for (const [open, close] of [['"', '"'], ["'", "'"], ['“', '”'], ['「', '」']]) {
    if (answer.length > 1 && answer.startsWith(open) && answer.endsWith(close)) {
      answer = answer.slice(open.length, answer.length - close.length).trim()
      break
    }
  }
  return answer
}

/**
 * Rewrite one draft with the configured polish model.
 * @param ctx - the plugin Context.
 * @param settings - provider, model, and reasoning effort chosen for polishing.
 * @param draft - the composer draft.
 * @param session - the Session supplying context.
 * @param signal - job cancellation.
 * @returns the rewritten message.
 */
async function rewrite(ctx, settings, draft, session, signal) {
  const transcript = buildTranscript(session)
  const instruction = transcript === ''
    ? `Draft to rewrite:\n${draft}`
    : `Conversation so far (context only; do not continue it):\n${transcript}\n\nDraft to rewrite:\n${draft}`
  const controls = settings.reasoningEffort === undefined || settings.reasoningEffort === ''
    ? {}
    : { reasoningEffort: settings.reasoningEffort }
  let prepared
  try {
    prepared = await ctx.llm.prepareCall({ provider: settings.provider, model: settings.model, ...controls }, signal)
  } catch (error) {
    if (signal.aborted) throw new PolishError('timeout', 'the polish request timed out', 504)
    // An unknown route or an effort the model rejects is a configuration problem the
    // user fixes in Settings, never a silent downgrade to another model.
    throw new PolishError('model-unavailable', messageOf(error), 409)
  }
  const stream = prepared.stream({
    ...prepared.config,
    system: typeof settings.prompt === 'string' && settings.prompt.trim() !== '' ? settings.prompt : SYSTEM_PROMPT,
    messages: [{ role: 'user', content: [{ type: 'text', text: instruction }] }],
    signal,
  })
  let answer = ''
  for await (const chunk of stream) {
    if (chunk.type === 'text-delta') {
      answer += chunk.text
      continue
    }
    if (chunk.type !== 'finish') continue
    const { reason } = chunk
    if (reason.kind === 'error' || reason.kind === 'aborted') {
      throw new PolishError(signal.aborted ? 'timeout' : 'model-failed',
        reason.failure?.message ?? 'the model call failed', signal.aborted ? 504 : 502)
    }
    if (reason.kind === 'max-tokens') {
      throw new PolishError('model-truncated', 'the model reached its output token limit', 502)
    }
  }
  const cleaned = cleanAnswer(answer)
  if (cleaned === '') throw new PolishError('model-empty', 'the model returned no text', 502)
  return cleaned
}

/**
 * Sanitize the row config into the settings the jobs use.
 *
 * An explicit empty `reasoningEffort` means "whatever the model defaults to",
 * while an absent field means "not chosen yet" and takes the low default. An
 * empty `prompt` means "use the built-in {@link SYSTEM_PROMPT}".
 * @param config - the loaded row config, possibly empty.
 * @returns provider, model, reasoning effort, and the optional custom prompt.
 */
function settingsOf(config) {
  const pick = (value, fallback) => typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback
  return {
    provider: pick(config?.provider, DEFAULT_SETTINGS.provider),
    model: pick(config?.model, DEFAULT_SETTINGS.model),
    reasoningEffort: typeof config?.reasoningEffort === 'string'
      ? config.reasoningEffort.trim()
      : DEFAULT_SETTINGS.reasoningEffort,
    prompt: typeof config?.prompt === 'string' ? config.prompt : '',
  }
}

/**
 * The JSON shape of one job; the abort controller never crosses the wire.
 * @param job - an internal job record.
 * @returns the public view.
 */
function publicJob(job) {
  if (job === undefined) return null
  return {
    id: job.id,
    sessionId: job.sessionId,
    status: job.status,
    draft: job.draft,
    ...job.text === undefined ? {} : { text: job.text },
    ...job.code === undefined ? {} : { code: job.code },
    ...job.message === undefined ? {} : { message: job.message },
    model: job.model,
    startedAt: job.startedAt,
    ...job.finishedAt === undefined ? {} : { finishedAt: job.finishedAt },
  }
}

/**
 * Register the polish route and its job table.
 * @param ctx - the plugin Context.
 * @param config - the row config holding the polish model choice.
 */
export function apply(ctx, config) {
  /** Runtime settings; a save updates this without waiting for a restart. */
  const state = { settings: settingsOf(config) }
  /** Session-keyed jobs, including finished ones waiting to be collected. */
  const jobs = new Map()
  let sequence = 0

  /**
   * Drop expired and excess finished jobs.
   * @param now - current epoch milliseconds.
   */
  const sweep = (now) => {
    for (const [sessionId, job] of jobs) {
      if (job.status === 'running') continue
      if (job.finishedAt !== undefined && now - job.finishedAt > JOB_TTL_MS) jobs.delete(sessionId)
    }
    const finished = [...jobs.values()].filter(job => job.status !== 'running')
    if (finished.length <= MAX_FINISHED_JOBS) return
    finished.sort((left, right) => (left.finishedAt ?? 0) - (right.finishedAt ?? 0))
    for (const job of finished.slice(0, finished.length - MAX_FINISHED_JOBS)) jobs.delete(job.sessionId)
  }

  /**
   * Run one polish job to completion, storing its outcome for later collection.
   * @param job - the job record to fill in.
   */
  const runJob = async (job) => {
    const session = sessionOf(ctx, job.sessionId)
    try {
      const text = await rewrite(ctx, job.settings, job.draft, session, job.controller.signal)
      if (job.controller.signal.aborted) throw new PolishError('cancelled', 'the polish job was cancelled', 499)
      job.status = 'done'
      job.text = text
    } catch (error) {
      // A user cancel reaches the call as an abort, so the job records why.
      const cancelled = job.cancelled === true
      job.status = 'failed'
      job.code = cancelled ? 'cancelled' : error instanceof PolishError ? error.code : 'model-failed'
      job.message = cancelled ? 'the polish job was cancelled' : messageOf(error)
      if (!cancelled) ctx.logger?.warn?.(`input-polish: ${job.message}`)
    } finally {
      job.finishedAt = Date.now()
      job.controller = undefined
    }
  }

  /**
   * The settings a job actually runs with.
   *
   * A configured provider that is no longer registered (provider removed or
   * renamed) falls back to the first registered provider, so only a wrong model
   * id needs the user's attention.
   * @returns provider, model, and reasoning effort.
   */
  const effectiveSettings = () => {
    const settings = state.settings
    const providers = ctx.llm.listProviders()
    if (providers.some(provider => provider.id === settings.provider)) return settings
    const first = providers[0]
    return first === undefined ? settings : { ...settings, provider: first.id }
  }

  /**
   * Start a job for one Session unless one is already running there.
   * @param sessionId - receiving Session.
   * @param draft - the draft snapshot the answer belongs to.
   * @returns the running job.
   */
  const startJob = (sessionId, draft) => {
    const existing = jobs.get(sessionId)
    if (existing !== undefined && existing.status === 'running') return existing
    const settings = effectiveSettings()
    const controller = new AbortController()
    const job = {
      id: `polish-${++sequence}`,
      sessionId,
      draft,
      settings,
      model: settings.provider === ''
        ? settings.model
        : `${settings.provider}/${settings.model}${settings.reasoningEffort === '' ? '' : ` @${settings.reasoningEffort}`}`,
      status: 'running',
      startedAt: Date.now(),
      controller,
    }
    jobs.set(sessionId, job)
    const timer = setTimeout(() => { controller.abort() }, TIMEOUT_MS)
    void runJob(job).finally(() => { clearTimeout(timer) })
    return job
  }

  /**
   * List every registered provider with the models it advertises.
   * @returns provider and model options for the settings row.
   */
  const listModels = async () => {
    const providers = []
    for (const provider of ctx.llm.listProviders()) {
      let models = []
      try {
        models = await ctx.llm.listModels(provider.id)
      } catch {
        // A provider whose catalog cannot be read still appears, with no models.
      }
      providers.push({
        id: provider.id,
        name: provider.name,
        models: models.map(model => ({ id: model.id, name: model.name ?? model.id })),
      })
    }
    return providers
  }

  /**
   * Report the reasoning efforts one model accepts.
   * @param provider - provider route.
   * @param model - model id.
   * @returns effort options, empty when the model declares none.
   */
  const modelEfforts = async (provider, model) => {
    try {
      const info = await ctx.llm.resolveModelInfo(provider, model)
      const efforts = info?.reasoning?.efforts ?? []
      return efforts.map(effort => ({ id: effort.id, name: effort.name ?? effort.id }))
    } catch {
      return []
    }
  }

  /**
   * Persist one settings change through the config editor.
   * @param next - the complete settings to store.
   * @returns the stored settings.
   */
  const saveSettings = async (next) => {
    const candidate = settingsOf(next)
    if (candidate.prompt.length > MAX_PROMPT_CHARS) {
      throw new PolishError('prompt-too-long', `the prompt exceeds ${MAX_PROMPT_CHARS} characters`, 400)
    }
    const entry = ctx.fiber?.entry
    const editor = ctx.get('configEditor')
    if (entry === undefined || editor === undefined) {
      // No writable configuration seat: still honor the choice for this run rather
      // than refusing a setting the user just made.
      state.settings = candidate
      return { ...candidate, persisted: false }
    }
    try {
      await editor.edit(entry, current => {
        const merged = {
          ...current,
          provider: candidate.provider,
          model: candidate.model,
          reasoningEffort: candidate.reasoningEffort,
        }
        // An empty prompt means "use the built-in one", so drop the key rather than
        // storing an empty string that reads like a configured value.
        if (candidate.prompt.trim() === '') delete merged.prompt
        else merged.prompt = candidate.prompt
        return merged
      })
    } catch (error) {
      throw new PolishError('config-rejected', messageOf(error), 409)
    }
    // The edit may restart the row; keep this generation consistent until it does.
    state.settings = candidate
    return { ...candidate, persisted: true }
  }

  /**
   * Dispatch one command.
   * @param body - the decoded request body.
   * @returns the JSON answer.
   */
  const dispatch = async (body) => {
    const action = typeof body?.action === 'string' ? body.action : ''
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : ''
    switch (action) {
      case 'start': {
        const draft = typeof body?.draft === 'string' ? body.draft.trim() : ''
        if (draft === '') throw new PolishError('draft-empty', 'the draft is empty', 400)
        if (draft.length > MAX_DRAFT_CHARS) {
          throw new PolishError('draft-too-long', `the draft exceeds ${MAX_DRAFT_CHARS} characters`, 400)
        }
        if (sessionId === '') throw new PolishError('bad-request', 'the Session id is missing', 400)
        sweep(Date.now())
        return { ok: true, job: publicJob(startJob(sessionId, draft)) }
      }
      case 'poll': {
        sweep(Date.now())
        return { ok: true, job: publicJob(jobs.get(sessionId)) }
      }
      case 'consume': {
        const job = jobs.get(sessionId)
        if (job !== undefined && job.status !== 'running' && (body?.jobId === undefined || body.jobId === job.id)) {
          jobs.delete(sessionId)
        }
        return { ok: true }
      }
      case 'cancel': {
        const job = jobs.get(sessionId)
        if (job !== undefined && job.status === 'running') {
          job.cancelled = true
          job.controller?.abort()
        }
        return { ok: true }
      }
      case 'models':
        return { ok: true, providers: await listModels() }
      case 'modelInfo':
        return {
          ok: true,
          efforts: await modelEfforts(
            typeof body?.provider === 'string' ? body.provider : state.settings.provider,
            typeof body?.model === 'string' ? body.model : state.settings.model,
          ),
        }
      case 'getSettings':
        return {
          ok: true,
          settings: state.settings,
          defaults: { ...DEFAULT_SETTINGS, prompt: SYSTEM_PROMPT },
          maxPromptChars: MAX_PROMPT_CHARS,
        }
      case 'saveSettings':
        return { ok: true, settings: await saveSettings(body?.settings) }
      default:
        throw new PolishError('bad-request', `unknown action "${action}"`, 400)
    }
  }

  ctx.effect(
    () => ctx.connection.fetch.register({
      path: ROUTE_PATH,
      methods: ['POST'],
      requestBody: 'buffered',
      fetch: async (request) => {
        let body
        try {
          body = await request.json()
        } catch {
          return json(400, { ok: false, code: 'bad-request', message: 'the request body is not JSON' })
        }
        try {
          return json(200, await dispatch(body))
        } catch (error) {
          const code = error instanceof PolishError ? error.code : 'failed'
          const status = error instanceof PolishError ? error.status : 500
          return json(status, { ok: false, code, message: messageOf(error) })
        }
      },
    }),
    'input-polish: polish route',
  )

  ctx.effect(() => () => {
    // Unloading must not leave a model call running against a dead route.
    for (const job of jobs.values()) {
      if (job.status === 'running') job.controller?.abort()
    }
    jobs.clear()
  }, 'input-polish: running jobs')
}

/**
 * Host half of the inline Markdown editor.
 *
 * The browser half (`@local/dsh-markdown-editor/client`) renders the editor in
 * the right Sidebar's document preview. The workspace file Remote
 * (`workspaceFiles`) deliberately exposes no mutation operation, so the write
 * channel lives here as two authenticated web routes:
 *
 *   POST /markdown-inline-editor/read  { sessionId, path }
 *     -> { text, bytes, mtimeMs, absolutePath }
 *   POST /markdown-inline-editor/save  { sessionId, path, text, ifMtimeMs, force }
 *     -> { ok, bytes, mtimeMs, absolutePath } | 409 { code: 'changed-on-disk' }
 *   GET  /markdown-inline-editor/vditor/...   the vendored Vditor runtime
 *
 * Security has one home, here:
 * - every route asks the composition's `connection` service for a rejection
 *   first (the Host/Origin fence and the browser authentication), exactly like
 *   the shipped open-in-app routes;
 * - the file must be an existing regular Markdown file that is not itself a
 *   symbolic link and whose real path stays inside the live Session's effective
 *   working directory, so a browser request cannot reach arbitrary host paths
 *   and no file is ever created;
 * - request bodies are bounded JSON and the text is accepted only as valid
 *   UTF-8;
 * - the vendor route serves only the copied Vditor asset tree, with a fixed
 *   extension whitelist and no path escaping.
 */
import { extname, isAbsolute, relative, resolve } from 'node:path'
import { lstat, readFile, realpath, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

/** Cordis function-plugin name. */
export const name = 'markdown-inline-editor'

/** Route carrier, browser trust fence, and the live Session store. */
export const inject = ['webServer', 'connection', 'sessions']

const READ_PATH = '/markdown-inline-editor/read'
const SAVE_PATH = '/markdown-inline-editor/save'
/** Prefix of the copied Vditor runtime the browser half points its `cdn` at. */
const VENDOR_PATH = '/markdown-inline-editor/vditor'
/** The `cdn`-relative segment Vditor prepends to every runtime asset. */
const DIST_SEGMENT = 'dist/'
/**
 * On-disk root of that runtime. Vditor appends `/dist/js/...` to the `cdn`
 * value; this root holds the copied assets directly under `js/`, so the
 * repository's `dist/` build-output ignore stays effective.
 */
const VENDOR_ROOT = resolve(fileURLToPath(new URL('./vendor/vditor/', import.meta.url)))
/** The asset kinds the vendor route may answer. */
const VENDOR_TYPES = new Map([
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.gif', 'image/gif'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
])
/** One route body: JSON with escaped text, so allow twice the text ceiling. */
const BODY_LIMIT_BYTES = 8 * 1024 * 1024
/** One Markdown file the editor may open or store. */
const TEXT_LIMIT_BYTES = 2 * 1024 * 1024
const MARKDOWN_SUFFIXES = new Set(['.md', '.markdown', '.mdown', '.mkd'])

/** Strict UTF-8 decoding: a binary file is refused instead of saved back mangled. */
const utf8 = new TextDecoder('utf-8', { fatal: true })

/** Reason text for logs and route failures. */
function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}

/** JSON response: live editor facts, never cached. */
function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(payload))
}

/** Refusal with a stable machine code and a human-readable message. */
function fail(res, status, code, message) {
  sendJson(res, status, { code, message })
}

/** Collect a bounded UTF-8 JSON body; null once the ceiling is passed. */
async function readBoundedBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.byteLength
    if (size > BODY_LIMIT_BYTES) {
      req.resume()
      return null
    }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks, size).toString('utf8')
}

/** Parse a JSON object body; null for anything else. */
function jsonObject(text) {
  let value
  try {
    value = JSON.parse(text)
  } catch {
    return null
  }
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value : null
}

/** True when `target` is strictly below `root` (both already resolved). */
function inside(root, target) {
  const rel = relative(root, target)
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

/**
 * Serve one file from the copied Vditor runtime. The route answers only the
 * vendored tree: a decoded path cannot escape it, and only the listed asset
 * kinds are readable.
 */
async function serveVendor(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.setHeader('allow', 'GET, HEAD')
    res.end()
    return
  }
  let pathname
  try {
    pathname = decodeURIComponent(new URL(String(req.url), 'http://localhost').pathname)
  } catch {
    fail(res, 400, 'bad-request', 'malformed asset path')
    return
  }
  if (!pathname.startsWith(VENDOR_PATH + '/')) {
    fail(res, 404, 'not-found', 'unknown asset')
    return
  }
  const relativePath = pathname.slice(VENDOR_PATH.length + 1)
  if (relativePath === '' || relativePath.startsWith('/') || relativePath.includes('\0')
    || relativePath.includes('..') || relativePath.includes('\\')) {
    fail(res, 404, 'not-found', 'unknown asset')
    return
  }
  // Vditor asks for `<cdn>/dist/...`; the copied tree stores the same files
  // without that extra level.
  const assetPath = relativePath.startsWith(DIST_SEGMENT) ? relativePath.slice(DIST_SEGMENT.length) : relativePath
  const target = resolve(VENDOR_ROOT, assetPath)
  if (!inside(VENDOR_ROOT, target)) {
    fail(res, 404, 'not-found', 'unknown asset')
    return
  }
  const type = VENDOR_TYPES.get(extname(target).toLowerCase())
  if (type === undefined) {
    fail(res, 404, 'not-found', 'unsupported asset kind')
    return
  }
  let body
  try {
    body = await readFile(target)
  } catch {
    fail(res, 404, 'not-found', 'unknown asset')
    return
  }
  res.statusCode = 200
  res.setHeader('content-type', type)
  // The copied runtime is version-fixed, so one year of cache is safe.
  res.setHeader('cache-control', 'public, max-age=31536000, immutable')
  res.setHeader('x-content-type-options', 'nosniff')
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  res.end(body)
}

/**
 * Resolve the Session's effective working directory: the working-directory
 * service when this composition mounts it, the Session header's original
 * project otherwise.
 */
function sessionRootOf(ctx, sessionId) {
  if (typeof sessionId !== 'string' || sessionId === '') return undefined
  const session = ctx.sessions.get(sessionId)
  if (session === undefined) return undefined
  const workingDirectory = ctx.get('workingDirectory')
  if (workingDirectory !== undefined && typeof workingDirectory.get === 'function') {
    try {
      const directory = workingDirectory.get(session)
      if (typeof directory === 'string' && directory !== '') return directory
    } catch {
      // A disposed or unavailable service falls through to the header project.
    }
  }
  const cwd = session.header === undefined ? undefined : session.header.cwd
  return typeof cwd === 'string' && cwd !== '' ? cwd : undefined
}

/**
 * Validate one requested file: exists, regular, not a link, Markdown, and
 * inside the live Session workspace.
 * @returns `{ target, facts }` or `{ error: { status, code, message } }`.
 */
async function resolveTarget(ctx, sessionId, requested) {
  if (typeof requested !== 'string' || requested === '' || !isAbsolute(requested)) {
    return { error: { status: 400, code: 'bad-request', message: 'path must be an absolute file path' } }
  }
  const root = sessionRootOf(ctx, sessionId)
  if (root === undefined) {
    return { error: { status: 409, code: 'session-not-live', message: 'the Session is not live in this Host' } }
  }
  if (!MARKDOWN_SUFFIXES.has(extname(requested).toLowerCase())) {
    return { error: { status: 400, code: 'not-markdown', message: 'only Markdown files can be edited' } }
  }
  const target = resolve(requested)
  let facts
  try {
    facts = await lstat(target)
  } catch {
    return { error: { status: 404, code: 'not-found', message: 'the file does not exist' } }
  }
  if (facts.isSymbolicLink()) {
    return { error: { status: 400, code: 'symlink', message: 'symbolic links are not editable' } }
  }
  if (!facts.isFile()) {
    return { error: { status: 400, code: 'not-regular-file', message: 'the path is not a regular file' } }
  }
  let realRoot
  try {
    realRoot = await realpath(resolve(root))
  } catch {
    return { error: { status: 409, code: 'session-not-live', message: 'the Session workspace is unavailable' } }
  }
  let realTarget
  try {
    realTarget = await realpath(target)
  } catch {
    return { error: { status: 404, code: 'not-found', message: 'the file does not exist' } }
  }
  if (!inside(realRoot, realTarget)) {
    return { error: { status: 403, code: 'outside-workspace', message: 'the file is outside the Session workspace' } }
  }
  try {
    return { target: realTarget, facts: await stat(realTarget) }
  } catch {
    return { error: { status: 404, code: 'not-found', message: 'the file does not exist' } }
  }
}

/** Read one Markdown file for the editor. */
async function readRoute(res, target) {
  let bytes
  try {
    bytes = await readFile(target)
  } catch (error) {
    fail(res, 500, 'read-failed', messageOf(error))
    return
  }
  if (bytes.byteLength > TEXT_LIMIT_BYTES) {
    fail(res, 413, 'too-large', `the file is larger than ${String(TEXT_LIMIT_BYTES)} bytes`)
    return
  }
  let text
  try {
    text = utf8.decode(bytes)
  } catch {
    fail(res, 415, 'not-text', 'the file is not valid UTF-8 text')
    return
  }
  const info = await stat(target).catch(() => undefined)
  sendJson(res, 200, {
    text,
    bytes: bytes.byteLength,
    mtimeMs: info === undefined ? 0 : info.mtimeMs,
    absolutePath: target,
  })
}

/** Store one Markdown file, refusing to overwrite an unseen newer version. */
async function saveRoute(res, target, facts, body) {
  if (typeof body.text !== 'string') {
    fail(res, 400, 'bad-request', 'text must be a string')
    return
  }
  const bytes = Buffer.byteLength(body.text, 'utf8')
  if (bytes > TEXT_LIMIT_BYTES) {
    fail(res, 413, 'too-large', `the text is larger than ${String(TEXT_LIMIT_BYTES)} bytes`)
    return
  }
  if (body.force !== true && typeof body.ifMtimeMs === 'number' && Math.abs(facts.mtimeMs - body.ifMtimeMs) > 0.5) {
    fail(res, 409, 'changed-on-disk', 'the file changed on disk since it was opened')
    return
  }
  try {
    await writeFile(target, body.text, 'utf8')
  } catch (error) {
    fail(res, 500, 'write-failed', messageOf(error))
    return
  }
  const info = await stat(target).catch(() => undefined)
  sendJson(res, 200, {
    ok: true,
    bytes: info === undefined ? bytes : info.size,
    mtimeMs: info === undefined ? 0 : info.mtimeMs,
    absolutePath: target,
  })
}

/**
 * One route dispatch: trust fence, method, media type, bounded body, target
 * resolution, then the operation itself.
 */
async function dispatch(ctx, req, res, operation) {
  const rejection = ctx.connection.requestRejection({ headers: req.headers })
  if (rejection !== undefined) {
    res.statusCode = rejection
    res.end()
    return
  }
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('allow', 'POST')
    res.end()
    return
  }
  const essence = String(req.headers['content-type']).split(';', 1)[0].trim().toLowerCase()
  if (essence !== 'application/json') {
    fail(res, 415, 'unsupported-media-type', 'content-type must be application/json')
    return
  }
  let raw
  try {
    raw = await readBoundedBody(req)
  } catch {
    fail(res, 400, 'bad-request', 'request body unreadable')
    return
  }
  if (raw === null) {
    fail(res, 413, 'payload-too-large', 'request body is too large')
    return
  }
  const body = jsonObject(raw)
  if (body === null) {
    fail(res, 400, 'bad-request', 'request body must be a JSON object')
    return
  }
  const resolved = await resolveTarget(ctx, body.sessionId, body.path)
  if (resolved.error !== undefined) {
    const error = resolved.error
    fail(res, error.status, error.code, error.message)
    return
  }
  if (operation === 'read') {
    await readRoute(res, resolved.target)
    return
  }
  await saveRoute(res, resolved.target, resolved.facts, body)
}

/** Route handler wrapper: one failure cannot take down the web server. */
function safeHandler(ctx, operation) {
  return async (req, res) => {
    try {
      await dispatch(ctx, req, res, operation)
    } catch (error) {
      if (res.headersSent) {
        res.end()
        return
      }
      fail(res, 500, 'route-failed', messageOf(error))
    }
  }
}

/**
 * Register the read, save, and vendor routes behind the connection trust fence.
 * @param ctx - host context carrying the web server, the connection fence, and the Session store.
 */
export function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: READ_PATH,
    handler: safeHandler(ctx, 'read'),
  }), `markdown-inline-editor: POST ${READ_PATH}`)
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: SAVE_PATH,
    handler: safeHandler(ctx, 'save'),
  }), `markdown-inline-editor: POST ${SAVE_PATH}`)
  const vendorHandler = async (req, res) => {
    try {
      const rejection = ctx.connection.requestRejection({ headers: req.headers })
      if (rejection !== undefined) {
        res.statusCode = rejection
        res.end()
        return
      }
      await serveVendor(req, res)
    } catch (error) {
      if (res.headersSent) {
        res.end()
        return
      }
      fail(res, 500, 'route-failed', messageOf(error))
    }
  }
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: VENDOR_PATH,
    handler: vendorHandler,
  }), `markdown-inline-editor: GET ${VENDOR_PATH}/...`)
}

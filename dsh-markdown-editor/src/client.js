/**
 * Browser half of the inline Markdown editor.
 *
 * This half registers its own document-preview implementation for Markdown
 * (`loading: 'renderer'`), so a `.md` preview *is* the editor. View modes:
 * 所见即所得 (Vditor IR, vendored — see THIRD-PARTY-NOTICES.md), 分栏 (source +
 * live rendered twin), 源码, and 预览. Ctrl/Cmd+S saves through the two
 * authenticated Host routes this package's Host half registers, and the shipped
 * document toolbar keeps its own reload control for disk-side changes.
 *
 * Both halves exist because the workspace file Remote (`workspaceFiles`) has no
 * mutation operation. The Host half owns the security checks and also serves
 * the vendored Vditor runtime (`/markdown-inline-editor/vditor/...`) because a
 * plugin may not import Harness client packages.
 *
 * The split view's Markdown renderer is this package's own: every authored
 * character is escaped and only generated tags reach the DOM.
 */
import Vditor from 'vditor'
import vditorCss from 'vditor/dist/index.css'

window.__ModuleLoader__.load({
  id: '@local/dsh-markdown-editor',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'markdown-inline-editor'
    const BODY_ID = '@local/dsh-markdown-editor/markdown'
    const READ_ROUTE = 'markdown-inline-editor/read'
    const SAVE_ROUTE = 'markdown-inline-editor/save'
    const READ_TIMEOUT_MS = 20000
    const SAVE_TIMEOUT_MS = 30000
    const STACKED_BELOW_PX = 620
    const MODE_STORAGE_KEY = 'dsh.markdown-editor.mode'
    const IR_READY_TIMEOUT_MS = 8000

    const ZH = {
      'viewer.label': 'Markdown 编辑器',
      'toolbar.split': '分栏',
      'toolbar.source': '源码',
      'toolbar.preview': '预览',
      'toolbar.ir': '所见即所得',
      'toolbar.save': '保存',
      'toolbar.overwrite': '覆盖保存',
      'toolbar.saving': '保存中…',
      'toolbar.saved': '已保存',
      'toolbar.dirty': '未保存',
      'toolbar.hint': 'Ctrl/Cmd+S 保存',
      'status.loading': '正在读取文件…',
      'status.external': '磁盘上的文件已被修改，这里的编辑内容可能已过期。',
      'status.reload': '重新加载',
      'status.reloaded': '已按磁盘内容重新加载',
      'status.draft': '已恢复上次未保存的草稿',
      'status.reloadDirty': '重新加载（丢弃本地修改）',
      'status.irLoading': '正在加载所见即所得编辑器…',
      'status.irFailed': '所见即所得编辑器加载失败，可以切回分栏继续编辑。',
      'status.irFallback': '切回分栏',
      'dialog.retry': '重试',
      'source.label': 'Markdown 源码',
      'preview.label': 'Markdown 预览',
      'error.load': '读取失败',
      'error.save': '保存失败',
      'error.timeout': '请求超时',
      'error.changed': '文件已在磁盘上被修改；再按保存会覆盖它。',
      'error.notLive': '这个会话不在当前 Host 中运行，无法保存。',
      'error.outside': '该文件不在当前会话的工作目录内。',
      'error.tooLarge': '文件超过 2 MiB，不能在侧边栏内编辑。',
      'error.notText': '文件不是有效的 UTF-8 文本。',
      'error.notFound': '文件不存在或不是普通文件。',
      'error.notMarkdown': '只有 Markdown 文件可以这样编辑。',
      'error.symlink': '符号链接文件不可编辑。',
      'error.unauthorized': '浏览器会话未通过鉴权，请刷新页面。',
      'error.noPath': '还没有拿到该文件的绝对路径，暂时无法读取。',
    }

    const EN = {
      'viewer.label': 'Markdown editor',
      'toolbar.split': 'Split',
      'toolbar.source': 'Source',
      'toolbar.preview': 'Preview',
      'toolbar.ir': 'WYSIWYG',
      'toolbar.save': 'Save',
      'toolbar.overwrite': 'Overwrite',
      'toolbar.saving': 'Saving…',
      'toolbar.saved': 'Saved',
      'toolbar.dirty': 'Unsaved',
      'toolbar.hint': 'Ctrl/Cmd+S to save',
      'status.loading': 'Reading the file…',
      'status.external': 'The file changed on disk; these edits may be out of date.',
      'status.reload': 'Reload',
      'status.reloaded': 'Reloaded from disk',
      'status.draft': 'Restored unsaved changes',
      'status.reloadDirty': 'Reload (discard edits)',
      'status.irLoading': 'Loading the WYSIWYG editor…',
      'status.irFailed': 'The WYSIWYG editor could not load; switch back to Split to keep editing.',
      'status.irFallback': 'Switch to Split',
      'dialog.retry': 'Retry',
      'source.label': 'Markdown source',
      'preview.label': 'Markdown preview',
      'error.load': 'Could not read the file',
      'error.save': 'Could not save the file',
      'error.timeout': 'the request timed out',
      'error.changed': 'The file changed on disk; saving again overwrites it.',
      'error.notLive': 'This Session is not live in the Host, so it cannot save.',
      'error.outside': 'The file is outside the current Session workspace.',
      'error.tooLarge': 'The file exceeds 2 MiB and cannot be edited here.',
      'error.notText': 'The file is not valid UTF-8 text.',
      'error.notFound': 'The file is missing or not a regular file.',
      'error.notMarkdown': 'Only Markdown files can be edited this way.',
      'error.symlink': 'Symbolic links are not editable.',
      'error.unauthorized': 'The browser session is not authorized; reload the page.',
      'error.noPath': 'The absolute path is not known yet, so the file cannot be read.',
    }

    /* ------------------------------------------------------------------ */
    /* Markdown rendering: a local CommonMark-leaning subset to HTML.     */
    /* Every authored character is escaped; only generated tags are HTML. */
    /* ------------------------------------------------------------------ */

    const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

    function escapeHtml(text) {
      return String(text).replace(/[&<>"']/g, (character) => HTML_ESCAPES[character])
    }

    /** Absolute POSIX path or Windows drive path. */
    function isAbsolutePath(path) {
      return /^[/\\]/.test(path) || /^[A-Za-z]:[/\\]/.test(path)
    }

    /** Authenticated file route, the same one the shipped preview uses for local images. */
    function fileMediaUrl(path) {
      if (/^[/\\]{2}/.test(path)) return null
      if (/[\u0000-\u001f\u007f]/.test(path)) return null
      try {
        return new URL('api/file?path=' + encodeURIComponent(path), document.baseURI).href
      } catch (_error) {
        return null
      }
    }

    /** Resolve one authored image destination to a loadable URL, or null. */
    function resolveImageSource(destination, documentPath) {
      const value = String(destination).trim()
      if (/^https?:/i.test(value)) return value
      if (/^data:image\//i.test(value)) return value
      const windowsDrive = /^[A-Za-z]:[/\\]/.test(value)
      if (!windowsDrive && /^[A-Za-z][A-Za-z\d+.-]*:/.test(value)) return null
      let decoded = value
      try {
        const suffix = value.search(/[?#]/)
        decoded = decodeURIComponent(suffix === -1 ? value : value.slice(0, suffix))
      } catch (_error) {
        return null
      }
      if (decoded === '') return null
      const absolute = windowsDrive || isAbsolutePath(decoded)
      if (absolute) return fileMediaUrl(decoded)
      if (typeof documentPath !== 'string' || documentPath === '') return decoded
      const cut = Math.max(documentPath.lastIndexOf('/'), documentPath.lastIndexOf('\\'))
      const directory = cut === -1 ? '' : documentPath.slice(0, cut + 1)
      return fileMediaUrl(directory + decoded)
    }

    /** Safe link target: http(s), mailto, fragments and relative paths only. */
    function safeHref(url) {
      const value = String(url).trim()
      if (value === '') return null
      if (/^(https?:|mailto:)/i.test(value)) return value
      if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(value)) return null
      return value
    }

    /**
     * Replace `![alt](dest)` or `[label](dest)` occurrences, balancing
     * parentheses inside the destination so badge and wiki URLs survive.
     */
    function replaceLinksOrImages(text, kind, keep, render) {
      const marker = kind === 'image' ? '![' : '['
      let output = ''
      let index = 0
      while (index < text.length) {
        const start = text.indexOf(marker, index)
        if (start === -1) {
          output += text.slice(index)
          break
        }
        output += text.slice(index, start)
        const labelStart = start + marker.length
        const labelEnd = text.indexOf(']', labelStart)
        if (labelEnd === -1 || text[labelEnd + 1] !== '(') {
          output += text.slice(start, labelStart)
          index = labelStart
          continue
        }
        let cursor = labelEnd + 2
        let depth = 1
        let destination = ''
        let closed = -1
        while (cursor < text.length) {
          const character = text[cursor]
          if (character === '(') depth += 1
          else if (character === ')') {
            depth -= 1
            if (depth === 0) {
              closed = cursor
              break
            }
          }
          destination += character
          cursor += 1
        }
        if (closed === -1) {
          output += text.slice(start, labelStart)
          index = labelStart
          continue
        }
        const parsed = /^(\S*?)(?:\s+["'](.*)["'])?\s*$/.exec(destination)
        const url = parsed === null ? destination.trim() : parsed[1]
        const title = parsed === null ? undefined : parsed[2]
        output += keep(render(text.slice(labelStart, labelEnd), url, title))
        index = closed + 1
      }
      return output
    }

    /** Render inline Markdown inside one block. */
    function inline(text, context) {
      const stash = []
      const keep = (html) => {
        stash.push(html)
        return '\u0000' + String(stash.length - 1) + '\u0000'
      }
      let value = String(text)

      value = value.replace(/\\([\\`*_{}[\]()#+\-.!>~|])/g, (_match, character) => keep(escapeHtml(character)))
      value = value.replace(/(`+)([\s\S]*?)\1/g, (_match, _ticks, code) => keep(
        '<code>' + escapeHtml(String(code).replace(/^ (.*) $/, '$1')) + '</code>',
      ))
      value = replaceLinksOrImages(value, 'image', keep, (alt, url, title) => {
        const source = resolveImageSource(url, context.documentPath)
        if (source === null) return escapeHtml(alt)
        const titleAttribute = title === undefined ? '' : ' title="' + escapeHtml(title) + '"'
        return '<img src="' + escapeHtml(source) + '" alt="' + escapeHtml(alt) + '"' + titleAttribute + ' loading="lazy">'
      })
      value = replaceLinksOrImages(value, 'link', keep, (label, url, title) => {
        const href = safeHref(url)
        if (href === null) return inline(label, context)
        const titleAttribute = title === undefined ? '' : ' title="' + escapeHtml(title) + '"'
        return '<a href="' + escapeHtml(href) + '"' + titleAttribute + ' target="_blank" rel="noreferrer noopener">' + inline(label, context) + '</a>'
      })
      value = value.replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/g, (_match, url) => keep(
        '<a href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer noopener">' + escapeHtml(url) + '</a>',
      ))
      value = escapeHtml(value)

      value = value.replace(/&lt;br\s*\/?&gt;/gi, '<br>')
      value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      value = value.replace(/__([^_]+)__/g, '<strong>$1</strong>')
      value = value.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
      value = value.replace(/(^|[^_\w])_([^_\n]+)_(?![\w_])/g, '$1<em>$2</em>')
      value = value.replace(/~~([^~]+)~~/g, '<del>$1</del>')
      // A label rendered by a nested inline pass keeps its parent's placeholders,
      // so resolve in passes and leave foreign placeholders for the outer pass.
      for (let pass = 0; pass < 8; pass += 1) {
        let resolved = false
        value = value.replace(/\u0000(\d+)\u0000/g, (match, index) => {
          const html = stash[Number(index)]
          if (html === undefined) return match
          resolved = true
          return html
        })
        if (!resolved) break
      }
      return value
    }

    function isBlank(line) {
      return String(line).trim() === ''
    }

    /** Split a table row on unescaped pipes. */
    function splitRow(line) {
      const trimmed = String(line).trim().replace(/^\|/, '').replace(/\|$/, '')
      const cells = []
      let current = ''
      for (let index = 0; index < trimmed.length; index += 1) {
        const character = trimmed[index]
        if (character === '\\' && trimmed[index + 1] === '|') {
          current += '|'
          index += 1
          continue
        }
        if (character === '|') {
          cells.push(current)
          current = ''
          continue
        }
        current += character
      }
      cells.push(current)
      return cells.map((cell) => cell.trim())
    }

    function isTableStart(lines, index) {
      const header = lines[index]
      const separator = lines[index + 1]
      if (typeof header !== 'string' || typeof separator !== 'string') return false
      if (!header.includes('|') || !separator.includes('|')) return false
      const cells = splitRow(separator)
      return cells.length > 0 && cells.every((cell) => /^:?-{1,}:?$/.test(cell))
    }

    /** True when the line opens a block other than a lazy paragraph continuation. */
    function isBlockStart(lines, index) {
      const line = lines[index]
      if (isBlank(line)) return true
      if (/^\s{0,3}(#{1,6})\s+/.test(line)) return true
      if (/^\s{0,3}(`{3,}|~{3,})/.test(line)) return true
      if (/^\s{0,3}>/.test(line)) return true
      if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) return true
      if (/^(\s*)([-+*]|\d{1,9}[.)])(\s+)/.test(line)) return true
      return isTableStart(lines, index)
    }

    function renderFence(state, marker, info) {
      const lines = state.lines
      const markerCharacter = marker[0]
      state.index += 1
      const collected = []
      while (state.index < lines.length) {
        const line = lines[state.index]
        const trimmed = line.trim()
        if (trimmed[0] === markerCharacter && trimmed.length >= 3 && /^(`{3,}|~{3,})$/.test(trimmed)
          && trimmed.replace(new RegExp('\\' + markerCharacter, 'g'), '') === '') {
          state.index += 1
          break
        }
        collected.push(line)
        state.index += 1
      }
      const label = info === '' ? '' : '<span class="dsh-md-lang">' + escapeHtml(info) + '</span>'
      return '<div class="dsh-md-code">' + label + '<pre><code>' + escapeHtml(collected.join('\n')) + '</code></pre></div>'
    }

    function renderBlockquote(state) {
      const inner = []
      while (state.index < state.lines.length) {
        const line = state.lines[state.index]
        if (!/^\s{0,3}>/.test(line)) break
        inner.push(line.replace(/^\s{0,3}>\s?/, ''))
        state.index += 1
      }
      const nested = { lines: inner, index: 0, documentPath: state.documentPath }
      return '<blockquote>' + renderBlocks(nested) + '</blockquote>'
    }

    function renderTable(state) {
      const header = splitRow(state.lines[state.index])
      const alignment = splitRow(state.lines[state.index + 1]).map((cell) => {
        const left = cell.startsWith(':')
        const right = cell.endsWith(':')
        if (left && right) return 'center'
        if (right) return 'right'
        if (left) return 'left'
        return ''
      })
      state.index += 2
      const rows = []
      while (state.index < state.lines.length) {
        const line = state.lines[state.index]
        if (isBlank(line) || !line.includes('|')) break
        rows.push(splitRow(line))
        state.index += 1
      }
      const cell = (tag, content, index) => {
        const style = alignment[index] === undefined || alignment[index] === '' ? '' : ' style="text-align:' + alignment[index] + '"'
        return '<' + tag + style + '>' + inline(content, state) + '</' + tag + '>'
      }
      let html = '<div class="dsh-md-table"><table><thead><tr>'
      header.forEach((content, index) => { html += cell('th', content, index) })
      html += '</tr></thead><tbody>'
      for (const row of rows) {
        html += '<tr>'
        header.forEach((_content, index) => { html += cell('td', row[index] === undefined ? '' : row[index], index) })
        html += '</tr>'
      }
      html += '</tbody></table></div>'
      return html
    }

    function renderList(state) {
      const lines = state.lines
      const first = /^(\s*)([-+*]|\d{1,9}[.)])(\s+)/.exec(lines[state.index])
      const baseIndent = first[1].length
      const ordered = /\d/.test(first[2])
      const startNumber = ordered ? parseInt(first[2], 10) : 1
      const items = []
      while (state.index < lines.length) {
        const match = /^(\s*)([-+*]|\d{1,9}[.)])(\s+)(.*)$/.exec(lines[state.index])
        if (match === null) break
        if (match[1].length !== baseIndent || /\d/.test(match[2]) !== ordered) break
        const contentIndent = baseIndent + match[2].length + match[3].length
        const itemLines = [match[4]]
        state.index += 1
        while (state.index < lines.length) {
          const next = lines[state.index]
          if (isBlank(next)) {
            const following = lines[state.index + 1]
            const followingIndent = following === undefined ? 0 : /^\s*/.exec(following)[0].length
            if (following !== undefined && !isBlank(following) && followingIndent >= contentIndent) {
              itemLines.push('')
              state.index += 1
              continue
            }
            break
          }
          const indent = /^\s*/.exec(next)[0].length
          if (indent < contentIndent) break
          itemLines.push(next.slice(contentIndent))
          state.index += 1
        }
        items.push(itemLines)
      }
      const tag = ordered ? 'ol' : 'ul'
      const start = ordered && startNumber !== 1 ? ' start="' + String(startNumber) + '"' : ''
      let html = '<' + tag + start + '>'
      for (const itemLines of items) html += '<li>' + renderItem(itemLines, state.documentPath) + '</li>'
      return html + '</' + tag + '>'
    }

    function renderItem(lines, documentPath) {
      let content = lines
      let prefix = ''
      const task = /^\[([ xX])\]\s+/.exec(content[0] === undefined ? '' : content[0])
      if (task !== null) {
        const checked = task[1].toLowerCase() === 'x' ? ' checked' : ''
        prefix = '<input type="checkbox" disabled' + checked + '> '
        content = [content[0].slice(task[0].length)].concat(content.slice(1))
      }
      const nested = { lines: content, index: 0, documentPath }
      let html = renderBlocks(nested)
      // Unwrap the item's leading paragraph so single-line items stay tight
      // even when a nested list follows.
      const leading = /^<p>([\s\S]*?)<\/p>(?:\n|$)/.exec(html)
      if (leading !== null) html = leading[1] + html.slice(leading[0].length)
      return prefix + html
    }

    function renderParagraph(state) {
      const lines = state.lines
      const collected = []
      let headingLevel = 0
      while (state.index < lines.length) {
        const line = lines[state.index]
        if (isBlank(line)) break
        if (collected.length > 0 && isBlockStart(lines, state.index)) break
        collected.push(line)
        state.index += 1
        if (collected.length === 1 && state.index < lines.length) {
          const underline = lines[state.index].trim()
          if (/^={2,}$/.test(underline)) {
            headingLevel = 1
            state.index += 1
            break
          }
          if (/^-{2,}$/.test(underline) && line.trim() !== '') {
            headingLevel = 2
            state.index += 1
            break
          }
        }
      }
      let text = ''
      for (let index = 0; index < collected.length; index += 1) {
        const line = collected[index]
        const hardBreak = /(?: {2,}|\\)$/.test(line)
        const content = hardBreak ? line.replace(/(?: {2,}|\\)$/, '') : line
        text += inline(content, state)
        if (index < collected.length - 1) text += hardBreak ? '<br>' : ' '
      }
      if (headingLevel > 0) return '<h' + String(headingLevel) + '>' + text + '</h' + String(headingLevel) + '>'
      return '<p>' + text + '</p>'
    }

    function renderBlocks(state) {
      const out = []
      const lines = state.lines
      while (state.index < lines.length) {
        const line = lines[state.index]
        if (isBlank(line)) {
          state.index += 1
          continue
        }
        const fence = /^\s{0,3}(`{3,}|~{3,})\s*([^`~]*)$/.exec(line)
        if (fence !== null) {
          out.push(renderFence(state, fence[1], fence[2].trim()))
          continue
        }
        const heading = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line)
        if (heading !== null) {
          const level = String(heading[1].length)
          out.push('<h' + level + '>' + inline(heading[2], state) + '</h' + level + '>')
          state.index += 1
          continue
        }
        if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) {
          out.push('<hr>')
          state.index += 1
          continue
        }
        if (/^\s{0,3}>/.test(line)) {
          out.push(renderBlockquote(state))
          continue
        }
        if (isTableStart(lines, state.index)) {
          out.push(renderTable(state))
          continue
        }
        if (/^(\s*)([-+*]|\d{1,9}[.)])(\s+)/.test(line)) {
          out.push(renderList(state))
          continue
        }
        out.push(renderParagraph(state))
      }
      return out.join('\n')
    }

    /**
     * Render one Markdown document to escaped HTML.
     * @param source - document text.
     * @param documentPath - Host absolute path of the source, for local images.
     * @returns HTML built only from this function's own tags.
     */
    function renderMarkdown(source, documentPath) {
      const lines = String(source).replace(/\r\n?/g, '\n').split('\n')
      const state = { lines, index: 0, documentPath: typeof documentPath === 'string' ? documentPath : '' }
      let frontmatter = ''
      if (lines.length > 0 && /^---\s*$/.test(lines[0])) {
        let end = -1
        for (let index = 1; index < lines.length; index += 1) {
          if (/^(---|\.\.\.)\s*$/.test(lines[index])) {
            end = index
            break
          }
        }
        if (end > 0) {
          frontmatter = '<pre class="dsh-md-frontmatter">' + escapeHtml(lines.slice(1, end).join('\n')) + '</pre>'
          state.index = end + 1
        }
      }
      return frontmatter + renderBlocks(state)
    }

    /* ------------------------------------------------------------------ */
    /* Routes and copy helpers                                            */
    /* ------------------------------------------------------------------ */

    function failureText(payload, t, prefixKey) {
      const code = payload !== null && typeof payload === 'object' && typeof payload.code === 'string' ? payload.code : ''
      const known = {
        'session-not-live': 'error.notLive',
        'outside-workspace': 'error.outside',
        'too-large': 'error.tooLarge',
        'not-text': 'error.notText',
        'not-found': 'error.notFound',
        'not-regular-file': 'error.notFound',
        'not-markdown': 'error.notMarkdown',
        'symlink': 'error.symlink',
      }
      if (code !== '' && Object.prototype.hasOwnProperty.call(known, code)) return t(known[code])
      const detail = payload !== null && typeof payload === 'object' && typeof payload.message === 'string' ? payload.message : ''
      const base = t(prefixKey === undefined ? 'error.load' : prefixKey)
      return detail === '' ? base : base + ': ' + detail
    }

    function failureMessage(error, t) {
      if (error instanceof Error && error.name === 'AbortError') return t('error.timeout')
      return error instanceof Error ? error.message : String(error)
    }

    /**
     * The active locale as the locale service last reported it. The framework's
     * slot translator resolves our namespace only when its dictionaries are
     * registered; this module keeps its own copy so the labels stay readable
     * even when that registration is unavailable.
     */
    let activeLocale = 'zh'

    function directTranslate(key) {
      const chinese = String(activeLocale).toLowerCase().startsWith('zh')
      const primary = chinese ? ZH : EN
      if (Object.prototype.hasOwnProperty.call(primary, key)) return primary[key]
      if (Object.prototype.hasOwnProperty.call(ZH, key)) return ZH[key]
      return key
    }

    /** Prefer the framework translator when it resolves this namespace, else the local one. */
    function translatorOf(props) {
      if (typeof props.t === 'function') {
        let resolved
        try {
          resolved = props.t('toolbar.split')
        } catch (_error) {
          resolved = undefined
        }
        if (typeof resolved === 'string' && resolved !== 'toolbar.split') return props.t
      }
      return directTranslate
    }

    async function postJson(route, body, timeoutMs) {
      const controller = new AbortController()
      const timer = setTimeout(() => { controller.abort() }, timeoutMs)
      try {
        return await fetch(route, {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timer)
      }
    }

    async function readFileText(sessionId, path) {
      const response = await postJson(READ_ROUTE, { sessionId, path }, READ_TIMEOUT_MS)
      const payload = await response.json().catch(() => null)
      return { response, payload }
    }

    /** Unsaved text kept for the page lifetime, keyed by Session and file path. */
    const drafts = new Map()

    /** View modes this preview supports. */
    const VIEW_MODES = ['ir', 'split', 'source', 'preview']

    /** The view mode the reader last chose; persisted for the next page load. */
    let preferredMode = readStoredMode()

    function readStoredMode() {
      try {
        const stored = window.localStorage.getItem(MODE_STORAGE_KEY)
        if (VIEW_MODES.includes(stored)) return stored
      } catch (_error) {
        // Storage may be unavailable (privacy mode); the default still works.
      }
      return 'split'
    }

    function storeMode(mode) {
      preferredMode = mode
      try {
        window.localStorage.setItem(MODE_STORAGE_KEY, mode)
      } catch (_error) {
        // Same as above: the in-memory preference still holds for this page.
      }
    }

    /** One draft slot per Session file. */
    function draftKeyOf(sessionId, path) {
      return String(sessionId) + '\u0000' + String(path)
    }

    /** Split a leading YAML frontmatter block so the rich editor never rewrites it. */
    function splitFrontmatterText(text) {
      const value = String(text)
      if (!value.startsWith('---')) return { front: '', body: value }
      const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/.exec(value)
      if (match === null) return { front: '', body: value }
      return { front: value.slice(0, match[0].length), body: value.slice(match[0].length) }
    }

    /** Base URL of this package's Host-served Vditor runtime. */
    function vendorCdnBase() {
      try {
        return new URL('markdown-inline-editor/vditor', document.baseURI).href.replace(/\/+$/, '')
      } catch (_error) {
        return ''
      }
    }

    /** Whether the app is currently dark, read from the theme token's luminance. */
    function isDarkTheme() {
      try {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--dsw-alias-bg-base').trim()
        let red
        let green
        let blue
        const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(raw)
        if (hex !== null) {
          const value = hex[1].length === 3 ? hex[1].split('').map((digit) => digit + digit).join('') : hex[1]
          red = parseInt(value.slice(0, 2), 16)
          green = parseInt(value.slice(2, 4), 16)
          blue = parseInt(value.slice(4, 6), 16)
        } else {
          const rgb = /rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(raw)
          if (rgb === null) return false
          red = Number(rgb[1])
          green = Number(rgb[2])
          blue = Number(rgb[3])
        }
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue < 128
      } catch (_error) {
        return false
      }
    }

    /* ------------------------------------------------------------------ */
    /* The preview body                                                   */
    /* ------------------------------------------------------------------ */

    const CSS = [
      '.dsh-md-root{position:absolute;inset:0;display:flex;flex-direction:column;min-height:0;box-sizing:border-box;overflow:hidden;white-space:normal;font-family:var(--dsw-font-family,ui-sans-serif,system-ui,sans-serif)}',
      '.dsh-md-toolbar{display:flex;flex:none;flex-wrap:wrap;align-items:center;gap:6px;padding:4px 8px;border-bottom:0.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}',
      '.dsh-md-group{display:inline-flex;gap:2px;padding:2px;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-2)}',
      '.dsh-md-chip{height:28px;padding:0 10px;border:0;border-radius:var(--dsw-radius-sm,5px);background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;cursor:pointer}',
      '.dsh-md-chip[aria-pressed="true"]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}',
      '.dsh-md-chip:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsh-md-state{margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap}',
      '.dsh-md-state[data-dirty="true"]{color:var(--dsw-alias-state-warn-primary)}',
      '.dsh-md-save{height:28px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,5px);background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;cursor:pointer;white-space:nowrap}',
      '.dsh-md-save[data-primary="true"]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}',
      '.dsh-md-save:disabled{opacity:.5;cursor:default}',
      '.dsh-md-notice{display:flex;flex:none;gap:8px;align-items:center;padding:4px 10px;font-size:11px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-bottom:0.5px solid var(--dsw-alias-border-l1)}',
      '.dsh-md-notice[data-tone="error"]{color:var(--dsw-alias-state-error-primary)}',
      '.dsh-md-notice button{padding:0;border:0;background:transparent;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}',
      '.dsh-md-panes{display:flex;flex:1 1 auto;min-width:0;min-height:0}',
      '.dsh-md-pane{display:flex;flex:1 1 0;min-width:0;min-height:0;flex-direction:column}',
      '.dsh-md-pane[hidden]{display:none}',
      '.dsh-md-source{flex:1 1 auto;width:100%;min-height:0;margin:0;padding:10px 12px;border:0;outline:none;resize:none;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-markdown-code-block,13px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);tab-size:2}',
      '.dsh-md-source:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      '.dsh-md-preview{flex:1 1 auto;min-height:0;overflow:auto;padding:12px 14px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.75;overflow-wrap:anywhere}',
      '.dsh-md-preview:focus{outline:none}',
      '.dsh-md-split-line{flex:none;width:0.5px;background:var(--dsw-alias-border-l1)}',
      '.dsh-md-split-line-h{width:auto;height:0.5px}',
      '.dsh-md-preview h1,.dsh-md-preview h2,.dsh-md-preview h3,.dsh-md-preview h4,.dsh-md-preview h5,.dsh-md-preview h6{margin:18px 0 8px;font-weight:600;line-height:1.35}',
      '.dsh-md-preview h1{font-size:20px}.dsh-md-preview h2{font-size:17px}.dsh-md-preview h3{font-size:15px}.dsh-md-preview h4,.dsh-md-preview h5,.dsh-md-preview h6{font-size:13px}',
      '.dsh-md-preview h1:first-child,.dsh-md-preview h2:first-child,.dsh-md-preview p:first-child{margin-top:0}',
      '.dsh-md-preview p{margin:8px 0}',
      '.dsh-md-preview ul,.dsh-md-preview ol{margin:8px 0;padding-left:22px}',
      '.dsh-md-preview li{margin:2px 0}',
      '.dsh-md-preview li>p{margin:2px 0}',
      '.dsh-md-preview li input[type="checkbox"]{margin:0 6px 0 -18px;vertical-align:middle}',
      '.dsh-md-preview blockquote{margin:8px 0;padding:2px 12px;color:var(--dsw-alias-label-secondary);border-left:2px solid var(--dsw-alias-border-l2)}',
      '.dsh-md-preview hr{margin:16px 0;border:0;border-top:0.5px solid var(--dsw-alias-border-l2)}',
      '.dsh-md-preview a{color:var(--dsw-alias-brand-primary);text-decoration:none}',
      '.dsh-md-preview a:hover{text-decoration:underline}',
      '.dsh-md-preview code{padding:1px 4px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);font:var(--dsw-font-markdown-code-block,12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace)}',
      '.dsh-md-code{margin:10px 0;border:0.5px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}',
      '.dsh-md-lang{display:block;padding:4px 10px;color:var(--dsw-alias-label-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:.04em}',
      '.dsh-md-code pre{margin:0;padding:10px 12px;overflow:auto}',
      '.dsh-md-code code{padding:0;background:transparent;font:var(--dsw-font-markdown-code-block,12px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);white-space:pre}',
      '.dsh-md-frontmatter{margin:0 0 10px;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap}',
      '.dsh-md-table{overflow:auto;margin:10px 0}',
      '.dsh-md-table table{border-collapse:collapse;font-size:12px}',
      '.dsh-md-table th,.dsh-md-table td{padding:4px 10px;border:0.5px solid var(--dsw-alias-border-l2);text-align:left}',
      '.dsh-md-table th{background:var(--dsw-alias-bg-layer-2);font-weight:600}',
      '.dsh-md-preview img{max-width:100%;height:auto;border-radius:4px}',
      '.dsh-md-placeholder{flex:1;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;padding:24px;color:var(--dsw-alias-label-secondary);font-size:12px;text-align:center}',
      '.dsh-md-ir{position:relative;flex:1 1 auto;min-height:0;overflow:auto;background:var(--dsw-alias-bg-base)}',
      '.dsh-md-ir .vditor{height:auto!important;min-height:100%;border:0!important;background:transparent!important}',
      '.dsh-md-ir .vditor-toolbar{display:none!important}',
      '.dsh-md-ir .vditor-reset{color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family,ui-sans-serif,system-ui,sans-serif);font-size:13px;line-height:1.75;padding:12px 16px 24px}',
      '.dsh-md-ir .vditor-ir{padding:0}',
      '.dsh-md-ir .vditor-panel{border:0.5px solid var(--dsw-alias-border-l2);border-radius:6px}',
      '.dsh-md-ir-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);font-size:12px}',
    ].join('\n')

    /**
     * The vendored Vditor instant-render (IR) surface: Markdown that renders as
     * it is typed, in place. Frontmatter is kept out of the engine and attached
     * again on every input, so the YAML block is never rewritten.
     * @param props - current Markdown text, text sink, save handler, and copy.
     * @returns the editor host, or the fallback notice when it cannot mount.
     */
    function VditorPane(props) {
      const t = translatorOf(props)
      const textRef = React.useRef(props.text)
      const inputRef = React.useRef(props.onInput)
      const saveRef = React.useRef(props.onSave)
      const documentPathRef = React.useRef(props.documentPath)
      React.useLayoutEffect(() => {
        textRef.current = props.text
        inputRef.current = props.onInput
        saveRef.current = props.onSave
        documentPathRef.current = props.documentPath
      }, [props.text, props.onInput, props.onSave, props.documentPath])
      const hostRef = React.useRef(null)
      const editorRef = React.useRef(null)
      const frontRef = React.useRef('')
      const bodyRef = React.useRef('')
      const [ready, setReady] = React.useState(false)
      const [failed, setFailed] = React.useState(false)
      const [dark, setDark] = React.useState(isDarkTheme)

      /**
       * Rewrite local image sources to this Host's authenticated file route, the
       * same mapping the split view uses. Lute renders the authored path verbatim,
       * so `pic.png` would otherwise resolve against the page URL.
       */
      const fixImages = React.useCallback(() => {
        const host = hostRef.current
        if (host === null) return
        const images = host.querySelectorAll('img')
        for (let index = 0; index < images.length; index += 1) {
          const image = images[index]
          const lazily = image.getAttribute('data-src')
          const authored = lazily === null ? image.getAttribute('src') : lazily
          if (authored === null || authored === '') continue
          const resolved = resolveImageSource(authored, documentPathRef.current)
          if (resolved === null) continue
          if (image.getAttribute('src') !== resolved) image.setAttribute('src', resolved)
          if (lazily !== null && lazily !== resolved) image.setAttribute('data-src', resolved)
        }
      }, [])

      // Lute re-spins blocks while typing, so re-apply after every insertion.
      React.useEffect(() => {
        const host = hostRef.current
        if (host === null) return undefined
        fixImages()
        if (typeof MutationObserver === 'undefined') return undefined
        let frame = 0
        const schedule = () => {
          if (frame !== 0) return
          frame = window.requestAnimationFrame(() => { frame = 0; fixImages() })
        }
        const observer = new MutationObserver(schedule)
        observer.observe(host, { childList: true, subtree: true })
        return () => {
          observer.disconnect()
          if (frame !== 0) window.cancelAnimationFrame(frame)
        }
      }, [fixImages])

      // The previewed file's Host path can arrive after the editor mounts.
      React.useEffect(() => {
        fixImages()
      }, [fixImages, props.documentPath])

      React.useEffect(() => {
        if (typeof MutationObserver === 'undefined') return undefined
        const observer = new MutationObserver(() => { setDark(isDarkTheme()) })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
        return () => { observer.disconnect() }
      }, [])

      React.useEffect(() => {
        const host = hostRef.current
        if (host === null) return undefined
        const initial = splitFrontmatterText(textRef.current)
        frontRef.current = initial.front
        bodyRef.current = initial.body
        let alive = true
        let mounted = false
        let editor
        const timer = setTimeout(() => {
          if (alive && !mounted) setFailed(true)
        }, IR_READY_TIMEOUT_MS)
        try {
          const darkTheme = isDarkTheme()
          editor = new Vditor(host, {
            mode: 'ir',
            value: initial.body,
            cdn: vendorCdnBase(),
            lang: 'zh_CN',
            cache: { enable: false },
            toolbar: [],
            counter: { enable: false },
            outline: { enable: false },
            height: 'auto',
            theme: darkTheme ? 'dark' : 'classic',
            preview: {
              theme: { current: darkTheme ? 'dark' : 'light' },
              hljs: { enable: true, lineNumber: false, style: 'github' },
            },
            after: () => {
              mounted = true
              if (!alive) return
              clearTimeout(timer)
              setReady(true)
              window.requestAnimationFrame(fixImages)
            },
            input: (value) => {
              if (!alive) return
              bodyRef.current = value
              inputRef.current(frontRef.current + value)
              window.requestAnimationFrame(fixImages)
            },
          })
          editorRef.current = editor
        } catch (error) {
          clearTimeout(timer)
          console.error('[markdown-inline-editor] Vditor mount failed', error)
          setFailed(true)
        }
        return () => {
          alive = false
          clearTimeout(timer)
          try {
            if (editor !== undefined && typeof editor.destroy === 'function') editor.destroy()
          } catch (error) {
            console.error('[markdown-inline-editor] Vditor destroy failed', error)
          }
          editorRef.current = null
          host.innerHTML = ''
        }
      }, [])

      // A failed mount keeps no editor instance behind the fallback notice.
      React.useEffect(() => {
        if (!failed) return
        const editor = editorRef.current
        editorRef.current = null
        try {
          if (editor !== null && typeof editor.destroy === 'function') editor.destroy()
        } catch (error) {
          console.error('[markdown-inline-editor] Vditor destroy failed', error)
        }
      }, [failed])

      // Push disk-side changes into the engine; our own input never comes back.
      React.useEffect(() => {
        const editor = editorRef.current
        if (editor === null) return
        const next = splitFrontmatterText(props.text)
        frontRef.current = next.front
        if (next.body === bodyRef.current) return
        bodyRef.current = next.body
        try {
          if (typeof editor.setValue === 'function') editor.setValue(next.body)
        } catch (error) {
          console.error('[markdown-inline-editor] Vditor setValue failed', error)
        }
      }, [props.text])

      React.useEffect(() => {
        const editor = editorRef.current
        if (editor === null) return
        try {
          if (typeof editor.setTheme === 'function') {
            editor.setTheme(dark ? 'dark' : 'classic', dark ? 'dark' : 'light', 'github')
          }
        } catch (error) {
          console.error('[markdown-inline-editor] Vditor setTheme failed', error)
        }
      }, [dark])

      // The engine's contenteditable swallows key events, so save here instead.
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (!(event.ctrlKey || event.metaKey) || event.altKey) return
          if (event.key !== 's' && event.key !== 'S') return
          const host = hostRef.current
          const active = document.activeElement
          if (host === null || active === null || !host.contains(active)) return
          event.preventDefault()
          event.stopPropagation()
          saveRef.current()
        }
        window.addEventListener('keydown', onKeyDown, true)
        return () => { window.removeEventListener('keydown', onKeyDown, true) }
      }, [])

      if (failed) {
        return h('div', { className: 'dsh-md-ir' },
          h('div', { className: 'dsh-md-placeholder', role: 'alert' },
            h('span', null, t('status.irFailed')),
            h('button', {
              type: 'button',
              className: 'dsh-md-save',
              onClick: () => { props.onFallback() },
            }, t('status.irFallback')),
          ),
        )
      }
      return h('div', { className: 'dsh-md-ir' },
        h('style', { key: 'vditor-css' }, vditorCss),
        h('div', { className: 'dsh-md-vditor', ref: hostRef }),
        ready ? null : h('div', { className: 'dsh-md-ir-loading', role: 'status' }, t('status.irLoading')),
      )
    }

    /**
     * The Markdown preview body: a source editor with its live rendered twin.
     * @param props - document body owner inputs and the standard slot props.
     * @returns the editor toolbar, panes, and status surfaces.
     */
    function MarkdownEditor(props) {
      const t = translatorOf(props)
      const sessionId = props.sessionId
      const content = props.content
      const resourceAddress = props.resourceAddress
      const file = props.useResource(resourceAddress)
      const absolutePath = file !== undefined && file.value !== undefined && typeof file.value.absolutePath === 'string'
        ? file.value.absolutePath
        : undefined
      const metadataVersion = file !== undefined && file.value !== undefined && typeof file.value.version === 'string'
        ? file.value.version
        : undefined
      const revision = content !== undefined && content.kind === 'renderer' ? content.revision : -1

      const [doc, setDoc] = React.useState({ phase: 'loading', text: '', baseline: '', mtimeMs: 0, failure: null })
      const [mode, setMode] = React.useState(preferredMode)
      const [saving, setSaving] = React.useState(false)
      const [overwrite, setOverwrite] = React.useState(false)
      const [notice, setNotice] = React.useState(null)
      const [external, setExternal] = React.useState(false)
      const [stacked, setStacked] = React.useState(false)
      const stateRef = React.useRef(doc)
      React.useLayoutEffect(() => { stateRef.current = doc }, [doc])
      const lastWrittenRef = React.useRef(null)
      const savingRef = React.useRef(false)
      const rootRef = React.useRef(null)

      // Load (or reload) the file whenever the owner asks for a new revision or
      // the resource reports a new version.
      React.useEffect(() => {
        if (content === undefined || content.kind !== 'renderer') return undefined
        if (typeof absolutePath !== 'string' || absolutePath === '') return undefined
        if (typeof metadataVersion !== 'string' || metadataVersion === '') return undefined
        const key = draftKeyOf(sessionId, absolutePath)
        let cancelled = false
        const fail = (failure) => {
          const latest = stateRef.current
          if (latest.phase === 'ready') {
            // Keep what the reader has: a failed re-read is a notice, not a wipe.
            setNotice({ tone: 'error', text: failure })
            return
          }
          if (typeof content.failed === 'function') content.failed()
          setDoc({ phase: 'failure', text: '', baseline: '', mtimeMs: 0, failure })
        }
        void (async () => {
          try {
            const { response, payload } = await readFileText(sessionId, absolutePath)
            if (cancelled) return
            if (response.status === 401 || response.status === 403) {
              fail(t('error.unauthorized'))
              return
            }
            if (!response.ok || payload === null || typeof payload.text !== 'string') {
              fail(failureText(payload, t, 'error.load'))
              return
            }
            const incoming = payload.text
            const mtimeMs = typeof payload.mtimeMs === 'number' ? payload.mtimeMs : 0
            const latest = stateRef.current
            // A read started before a save can land after it; ignore that answer.
            if (mtimeMs !== 0 && latest.mtimeMs !== 0 && mtimeMs < latest.mtimeMs) return
            const draft = latest.phase === 'ready' ? undefined : drafts.get(key)
            if (typeof draft === 'string' && draft !== incoming) {
              // Unsaved text from a previous mount of this file.
              setDoc({ phase: 'ready', text: draft, baseline: incoming, mtimeMs, failure: null })
              setNotice({ tone: 'info', text: t('status.draft') })
            } else if (latest.text === incoming) {
              setDoc({ phase: 'ready', text: latest.text, baseline: incoming, mtimeMs, failure: null })
            } else if (latest.phase !== 'ready' || latest.text === latest.baseline) {
              setDoc({ phase: 'ready', text: incoming, baseline: incoming, mtimeMs, failure: null })
              setExternal(false)
            } else if (lastWrittenRef.current === incoming) {
              // Our own save came back; keep the newer local edits.
              setDoc({ phase: 'ready', text: latest.text, baseline: incoming, mtimeMs, failure: null })
            } else if (mtimeMs !== 0 && mtimeMs === latest.mtimeMs) {
              // The same file version re-read on demand: take the disk text.
              setDoc({ phase: 'ready', text: incoming, baseline: incoming, mtimeMs, failure: null })
              setExternal(false)
            } else {
              setDoc({ phase: 'ready', text: latest.text, baseline: latest.baseline, mtimeMs, failure: null })
              setExternal(true)
            }
            if (typeof content.loaded === 'function') content.loaded(metadataVersion)
          } catch (error) {
            if (cancelled) return
            fail(t('error.load') + ': ' + failureMessage(error, t))
          }
        })()
        return () => { cancelled = true }
      }, [revision, absolutePath, metadataVersion, sessionId, t])

      // Observe the pane width so the split stacks instead of squeezing.
      React.useEffect(() => {
        const element = rootRef.current
        if (element === null || typeof ResizeObserver === 'undefined') return undefined
        const observer = new ResizeObserver((entries) => {
          const width = entries[0] === undefined ? 0 : entries[0].contentRect.width
          setStacked(width > 0 && width < STACKED_BELOW_PX)
        })
        observer.observe(element)
        return () => { observer.disconnect() }
      }, [])

      const dirty = doc.phase === 'ready' && doc.text !== doc.baseline
      const previewRef = React.useRef(null)
      const previewScrollRef = React.useRef(0)
      const bindPreview = React.useCallback((element) => {
        previewRef.current = element
        if (typeof props.scrollportRef === 'function') props.scrollportRef(element)
      }, [props.scrollportRef])

      const reloadFromDisk = React.useCallback(async () => {
        if (typeof absolutePath !== 'string' || absolutePath === '') return
        try {
          const { response, payload } = await readFileText(sessionId, absolutePath)
          if (!response.ok || payload === null || typeof payload.text !== 'string') {
            setNotice({ tone: 'error', text: failureText(payload, t, 'error.load') })
            return
          }
          const key = draftKeyOf(sessionId, absolutePath)
          drafts.delete(key)
          lastWrittenRef.current = payload.text
          setDoc({
            phase: 'ready', text: payload.text, baseline: payload.text,
            mtimeMs: typeof payload.mtimeMs === 'number' ? payload.mtimeMs : 0, failure: null,
          })
          setExternal(false)
          setOverwrite(false)
          setNotice({ tone: 'info', text: t('status.reloaded') })
        } catch (error) {
          setNotice({ tone: 'error', text: t('error.load') + ': ' + failureMessage(error, t) })
        }
      }, [absolutePath, sessionId, t])

      const save = React.useCallback(async () => {
        const current = stateRef.current
        if (current.phase !== 'ready' || savingRef.current) return
        if (typeof absolutePath !== 'string' || absolutePath === '') {
          setNotice({ tone: 'error', text: t('error.noPath') })
          return
        }
        const savingText = current.text
        savingRef.current = true
        setSaving(true)
        setNotice(null)
        try {
          const response = await postJson(SAVE_ROUTE, {
            sessionId,
            path: absolutePath,
            text: savingText,
            ifMtimeMs: current.mtimeMs,
            force: overwrite,
          }, SAVE_TIMEOUT_MS)
          const payload = await response.json().catch(() => null)
          const latest = stateRef.current
          if (response.status === 401 || response.status === 403) {
            setNotice({ tone: 'error', text: t('error.unauthorized') })
            return
          }
          if (!response.ok) {
            const code = payload !== null && typeof payload === 'object' && typeof payload.code === 'string' ? payload.code : ''
            if (code === 'changed-on-disk') {
              setOverwrite(true)
              setNotice({ tone: 'error', text: t('error.changed') })
              return
            }
            setOverwrite(false)
            setNotice({ tone: 'error', text: failureText(payload, t, 'error.save') })
            return
          }
          lastWrittenRef.current = savingText
          drafts.delete(draftKeyOf(sessionId, absolutePath))
          setOverwrite(false)
          setExternal(false)
          const stillDirty = latest.text !== savingText
          setDoc({
            phase: 'ready',
            text: latest.text,
            baseline: savingText,
            mtimeMs: payload !== null && typeof payload.mtimeMs === 'number' ? payload.mtimeMs : latest.mtimeMs,
            failure: null,
          })
          setNotice(stillDirty ? null : { tone: 'info', text: t('toolbar.saved') })
        } catch (error) {
          setNotice({ tone: 'error', text: t('error.save') + ': ' + failureMessage(error, t) })
        } finally {
          savingRef.current = false
          setSaving(false)
        }
      }, [absolutePath, overwrite, sessionId, t])

      const onKeyDown = React.useCallback((event) => {
        if (event.isComposing || event.keyCode === 229) return
        if ((event.ctrlKey || event.metaKey) && !event.altKey && (event.key === 's' || event.key === 'S')) {
          event.preventDefault()
          void save()
        }
      }, [save])

      const applyText = React.useCallback((text) => {
        const previous = stateRef.current
        setDoc((current) => (current.phase === 'ready'
          ? { ...current, text }
          : { phase: 'ready', text, baseline: '', mtimeMs: 0, failure: null }))
        if (previous.phase === 'ready' && text === previous.baseline) drafts.delete(draftKeyOf(sessionId, absolutePath))
        else drafts.set(draftKeyOf(sessionId, absolutePath), text)
        setNotice(null)
      }, [absolutePath, sessionId])

      const onChange = React.useCallback((event) => {
        applyText(event.target.value)
      }, [applyText])

      const deferredText = React.useDeferredValue(doc.text)
      const html = React.useMemo(() => (
        mode === 'source' || mode === 'ir' ? '' : renderMarkdown(deferredText, absolutePath)
      ), [deferredText, absolutePath, mode])

      // Replacing the rendered HTML resets the pane's scroll; put the reader's
      // place back after every re-render so typing does not jump.
      React.useLayoutEffect(() => {
        const element = previewRef.current
        if (element === null) return
        if (element.scrollTop !== previewScrollRef.current) element.scrollTop = previewScrollRef.current
      }, [html, mode])

      const chip = (id, label) => h('button', {
        key: id,
        type: 'button',
        className: 'dsh-md-chip',
        'aria-pressed': mode === id ? 'true' : 'false',
        onClick: () => { storeMode(id); setMode(id) },
      }, label)

      const toolbar = h('div', { className: 'dsh-md-toolbar' },
        h('div', { className: 'dsh-md-group', role: 'group', 'aria-label': t('viewer.label') },
          chip('ir', t('toolbar.ir')),
          chip('split', t('toolbar.split')),
          chip('source', t('toolbar.source')),
          chip('preview', t('toolbar.preview')),
        ),
        h('span', {
          className: 'dsh-md-state',
          'data-dirty': dirty ? 'true' : 'false',
        }, dirty ? t('toolbar.dirty') : ''),
        h('button', {
          type: 'button',
          className: 'dsh-md-save',
          'data-primary': 'true',
          disabled: saving || doc.phase !== 'ready',
          title: t('toolbar.hint'),
          onClick: () => { void save() },
        }, saving ? t('toolbar.saving') : (overwrite ? t('toolbar.overwrite') : t('toolbar.save'))),
      )

      const statusRows = []
      if (notice !== null) {
        statusRows.push(h('div', {
          key: 'notice',
          className: 'dsh-md-notice',
          'data-tone': notice.tone === 'error' ? 'error' : 'info',
          role: 'status',
        }, h('span', null, notice.text)))
      }
      if (external) {
        statusRows.push(h('div', {
          key: 'external',
          className: 'dsh-md-notice',
          'data-tone': 'error',
          role: 'status',
        },
          h('span', null, t('status.external')),
          h('button', { type: 'button', onClick: () => { void reloadFromDisk() } }, t(dirty ? 'status.reloadDirty' : 'status.reload')),
        ))
      }

      const retry = () => { if (content !== undefined && typeof content.reload === 'function') content.reload() }
      const metadataFailed = file !== undefined && file.failure !== undefined
      if (doc.phase === 'failure') {
        return h('div', { className: 'dsh-md-root', ref: rootRef, onKeyDown },
          h('style', { key: 'dsh-md-css' }, CSS),
          h('div', { className: 'dsh-md-placeholder', role: 'alert' },
            h('span', null, doc.failure),
            h('button', { type: 'button', className: 'dsh-md-save', onClick: retry }, t('dialog.retry')),
          ),
        )
      }
      if (doc.phase === 'loading') {
        return h('div', { className: 'dsh-md-root', ref: rootRef, onKeyDown },
          h('style', { key: 'dsh-md-css' }, CSS),
          h('div', { className: 'dsh-md-placeholder', role: 'status' },
            h('span', null, metadataFailed ? t('error.load') : t('status.loading')),
            metadataFailed ? h('button', { type: 'button', className: 'dsh-md-save', onClick: retry }, t('dialog.retry')) : null,
          ),
        )
      }

      const showSource = mode !== 'preview'
      const showPreview = mode !== 'source'
      const irPane = mode === 'ir'
        ? h('div', { className: 'dsh-md-panes' }, h(VditorPane, {
          text: doc.text,
          documentPath: absolutePath,
          onInput: applyText,
          onSave: () => { void save() },
          onFallback: () => {
            storeMode('split')
            setMode('split')
            setNotice({ tone: 'error', text: t('status.irFailed') })
          },
          t,
        }))
        : null
      const panes = h('div', {
        className: 'dsh-md-panes',
        style: { flexDirection: stacked ? 'column' : 'row' },
      },
        h('div', { className: 'dsh-md-pane', hidden: !showSource },
          h('textarea', {
            className: 'dsh-md-source',
            value: doc.text,
            spellCheck: false,
            wrap: 'soft',
            'aria-label': t('source.label'),
            onChange,
          }),
        ),
        showSource && showPreview
          ? h('div', { key: 'divider', className: stacked ? 'dsh-md-split-line dsh-md-split-line-h' : 'dsh-md-split-line' })
          : null,
        h('div', { className: 'dsh-md-pane', hidden: !showPreview },
          h('div', {
            className: 'dsh-md-preview',
            ref: bindPreview,
            tabIndex: -1,
            role: 'document',
            'aria-label': t('preview.label'),
            onMouseDown: (event) => { event.currentTarget.focus() },
            onScroll: (event) => { previewScrollRef.current = event.currentTarget.scrollTop },
            dangerouslySetInnerHTML: { __html: html === '' ? '<p></p>' : html },
          }),
        ),
      )

      return h('div', { className: 'dsh-md-root', ref: rootRef, onKeyDown },
        h('style', { key: 'dsh-md-css' }, CSS),
        toolbar,
        ...statusRows,
        irPane === null ? panes : irPane,
      )
    }

    return {
      inject: ['slots', 'locale', 'documentPreviews'],
      apply(ctx) {
        ctx.effect(() => {
          const disposers = []
          try {
            if (ctx.locale !== undefined && ctx.locale !== null) {
              // The typed form every shipped package uses; the single-locale
              // overload stays as a fallback for a namespace outside its table.
              try {
                disposers.push(ctx.locale.register(NS, { zh: ZH, en: EN }))
              } catch (error) {
                console.error('[markdown-inline-editor] dictionary registration failed', error)
                disposers.push(ctx.locale.register(NS, 'zh', ZH))
                disposers.push(ctx.locale.register(NS, 'en', EN))
              }
            }
          } catch (error) {
            console.error('[markdown-inline-editor] locale registration failed', error)
          }
          try {
            if (ctx.locale !== undefined && ctx.locale !== null && typeof ctx.locale.getLocale === 'function') {
              activeLocale = ctx.locale.getLocale().active
              const unsubscribe = ctx.locale.subscribe(() => {
                try {
                  activeLocale = ctx.locale.getLocale().active
                } catch (error) {
                  console.error('[markdown-inline-editor] locale read failed', error)
                }
              })
              disposers.push(unsubscribe)
            }
          } catch (error) {
            console.error('[markdown-inline-editor] locale tracking failed', error)
          }
          return () => {
            for (const dispose of disposers) {
              try {
                dispose()
              } catch (error) {
                console.error('[markdown-inline-editor] locale disposal failed', error)
              }
            }
          }
        }, 'markdown-inline-editor: dictionaries')
        ctx.effect(() => ctx.documentPreviews.register({
          id: BODY_ID,
          extensions: ['md', 'markdown'],
          priority: 'extension',
          title: () => directTranslate('viewer.label'),
          loading: 'renderer',
        }), 'markdown-inline-editor: Markdown implementation')
        ctx.effect(() => ctx.slots.inject('sidebar.right.tab.document', () => ctx.slots.register({
          name: 'sidebar.right.tab.document',
          key: BODY_ID,
          locale: NS,
        }, MarkdownEditor)), 'markdown-inline-editor: editor body')
      },
      /** Internal: the renderer is exercised by this package's own checks. */
      __renderMarkdown: renderMarkdown,
    }
  },
})

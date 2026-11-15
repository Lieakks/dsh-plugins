# @lieakks/dsh-markdown-editor

*Edit Markdown inside the right Sidebar preview: a Typora-style instant-render mode (Vditor IR), a split live preview, source, and preview — all saved back to the same workspace file.*

English | [中文](docs/README.zh.md)

## Summary

The Sidebar's Markdown preview is the editor, with four modes:

- **WYSIWYG** — the IR (instant-render) mode of the bundled Vditor 4.0.1, close to Typora: edit the rendered document directly and Markdown syntax forms as you type.
- **Split** — Markdown source on the left, live rendered output on the right (this package's own renderer).
- **Source** — the raw Markdown only.
- **Preview** — the rendered document only.

Ctrl/Cmd+S (or **Save**) writes the same file on disk; a changed file turns the button into **Overwrite**; a disk-side change offers **Reload**. A leading YAML frontmatter block is split off in WYSIWYG mode and reattached unchanged, so the editor never rewrites it. Images with relative or local destinations resolve beside the source file through the same authenticated `api/file` route the split view uses.

The workspace file Remote (`@deepseek-ai/dsh-api-workspace-files`) exposes no mutation operation, so the write channel is this package's Host half. It also serves the Vditor runtime from the package itself (`/markdown-inline-editor/vditor/...`), so the editor is **fully offline and never touches a CDN**.

## Where it appears

- **The preview itself** — this package's Markdown implementation (`extension` band, selected before the built-in `builtin` renderer); the viewer dropdown still offers the built-in read-only renderer.
- **The toolbar** — `WYSIWYG / Split / Source / Preview`, the unsaved marker, and **Save** (**Overwrite** after a conflict). The chosen mode is remembered.
- **Notice rows** — save failures, out-of-date files (with **Reload**), and a failed WYSIWYG mount (with **Switch to Split**).

The split stacks vertically when the pane is narrower than about 620px.

## Usage

1. Open a Markdown file from the workspace tree or a file link.
2. The last used mode opens; press **WYSIWYG** to edit on the rendered document (the first switch loads the ~3.7MB Lute parser from the local Host route).
3. Ctrl/Cmd+S saves; if the file changed on disk the button reads **Overwrite** and the next press writes deliberately.
4. Use **Source** or **Split** when exact formatting matters, and **Preview** to read.

## Build and runtime

- `src/client.js` is the browser half; `build/build.mjs` bundles it with Vditor's script and stylesheet into `client.js` (~372 KB) using esbuild.
- Dependencies live in `build/`: `cd build && npm install && node build.mjs`.
- Vditor's lazily loaded assets (Lute, i18n, icons, highlight.js, diagram/math engines) are copied to `vendor/vditor/js` and served by the Host route with an extension whitelist and no path escaping.
- License: Vditor 4.0.1 is MIT; the libraries inside its runtime are listed in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## What the Host routes require

Both editing routes ask the composition's `connection` service for a rejection first (Host/Origin fence and browser authentication), then require:

- a live Session of this Host (`sessions`);
- an absolute path that resolves, through its real path, inside that Session's effective working directory (`workingDirectory`, falling back to the Session header's project);
- an existing regular Markdown file that is not itself a symbolic link;
- a JSON body under 8 MiB and text under 2 MiB that is valid UTF-8.

Nothing is created: a missing file is refused. The vendor route reads only files under `vendor/vditor`, whitelists js/css/json/map/svg/png/gif/jpg/jpeg/webp/woff/woff2/ttf, and refuses `..`, backslashes, and encoded traversal.

## Known Limitations

- **WYSIWYG normalizes Markdown** — Vditor serializes the document itself on save, so list markers, table alignment, and some whitespace can change. Frontmatter is preserved by splitting it out; byte-identical formatting is not guaranteed. Use **Source** when exact formatting matters.
- **First WYSIWYG mount loads Lute** (~3.7MB over the local Host route).
- **Markdown only, existing files only** — no creation, rename, or delete; 2 MiB text ceiling.
- **Live Sessions only** — a Session not live in this Host can be previewed but not saved.
- **No collaborative merge** — a changed file is reported, not merged.
- **No cross-page drafts** — unsaved text survives tab, pane, and mode switches while the page lives; a page reload discards it.

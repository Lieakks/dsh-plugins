/**
 * Bundle the plugin's browser half with the vendored Vditor editor runtime.
 *
 * Vditor's own lazy assets (Lute, i18n, icons, highlight.js, …) are NOT bundled
 * here: the Host half serves the copied `vendor/vditor/js` tree, and the
 * editor points its `cdn` option at that route. This script inlines only the
 * editor's main script and its stylesheet.
 */
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

const fromHere = (relative) => fileURLToPath(new URL(relative, import.meta.url))

await build({
  entryPoints: [fromHere('../src/client.js')],
  outfile: fromHere('../client.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome110'],
  // The source lives one level up, while the dependencies are installed here.
  nodePaths: [fromHere('node_modules')],
  minify: true,
  legalComments: 'none',
  loader: { '.css': 'text' },
  define: { 'process.env.NODE_ENV': '"production"' },
  banner: {
    js: '/* @local/dsh-markdown-editor — bundles Vditor 4.0.1 (MIT); see THIRD-PARTY-NOTICES.md */',
  },
  logLevel: 'info',
})

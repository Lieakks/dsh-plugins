# Third-party notices

## Vditor 4.0.1 — MIT

This package bundles the Vditor editor runtime into `client.js` and copies its
lazily loaded assets into `vendor/vditor/js`, served to the page by this
plugin's Host route (`/markdown-inline-editor/vditor/...`).

Upstream: <https://github.com/Vanessa219/vditor> · <https://www.npmjs.com/package/vditor>

```text
MIT License

Copyright (c) 2019-present B3log 开源, b3log.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Libraries redistributed inside Vditor's runtime

Vditor's `dist/js` tree also carries unmodified third-party builds that the
editor loads on demand (only when a document uses the matching syntax):
highlight.js (BSD-3-Clause; its license ships in
`vendor/vditor/js/highlight.js/LICENSE`), KaTeX (MIT), Mermaid (MIT),
MathJax (Apache-2.0), and the other diagram-rendering bundles shipped by
`vditor@4.0.1` (ECharts, WaveDrom, abcjs, flowchart.js, PlantUML, markmap,
smiles-drawer, graphviz).

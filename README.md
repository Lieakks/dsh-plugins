# DSH 本地插件集（DeepSeek Harness）

本仓库收录三个本地 Harness 插件，均以 bundle 形式安装在 `desktop` profile 中：

| 目录 | 插件包名 | 中文名 | 作用 |
|---|---|---|---|
| [`dsh-account-balance`](dsh-account-balance) | `@local/dsh-account-balance` | 账号余额 | 左侧边栏底部常驻显示账号余额，带增量提示与动效 |
| [`dsh-skins`](dsh-skins) | `@local/dsh-skins` | 皮肤 | 整站配色皮肤 + 自定义背景图，位于 设置 → 皮肤 |
| [`dsh-quota-meter`](dsh-quota-meter) | `@local/dsh-quota-meter` | 额度消耗 | 输入框下方显示本会话已消耗额度 |

## 安装与更新

三个包都以 `link:` 方式装在当前 profile 里（`$DSH_PROFILE_DIR/package.json`），因此**改完源码必须重装一次**，浏览器才会加载新的 client bundle：

```
plugin_manager remove_bundle  target=@local/dsh-account-balance
plugin_manager install_bundle target=<本仓库检出目录>/dsh-account-balance
```

（其余两个同理，target 换成 `<本仓库检出目录>/dsh-skins` / `<本仓库检出目录>/dsh-quota-meter`。）

- 只改 Host 半（`index.js`）时无需重装，Loader HMR 会接管。
- 只改 `client.js` 时必须重装：client bundle 是快照，HMR 只在 bundle 元数据变化时才替换。

## dsh-account-balance

- **挂载点**：`sidebar.footer.action`（root 作用域，不开会话也可见；侧栏收成 56px 窄栏时只留图标）
- **数据来源**：`ctx.remote.account.getBalance()`。凭据只在 Host 侧换取，浏览器拿到的是金额，拿不到 token。
- **刷新**：页面可见时每 30s 一次；点击立即刷新；切回窗口刷新；失败保留上次读数并标 `!`。
- **视觉**：渐变胶囊、呼吸指示点、数值滚动动画、消耗增量 `−¥0.03` 浮出、数值回弹、加载流光；尊重 `prefers-reduced-motion`。
- **状态**：未登录 / 读取失败 / 加载中各有独立文案与配色，均可点击重试。

## dsh-skins

- **挂载点**：`settings.section` + `settings.section.icon`，id `skins`，order 5（常规之后、模型之前）
- **配色皮肤**：默认 / 极光青 / 暖沙 / 森林 / 霓虹紫，每套同时定义浅色与深色，通过 `ctx.theme.overrideTokens` 覆盖 14 个 alias token，不碰主题注册表，可随时退回默认。
- **背景图**：本地文件（最长边压到 2560；不透明图存 JPEG q0.92，带透明通道的图存 WebP q0.92、浏览器不支持时回退 PNG，alpha 完整保留；编码后上限 12MB）或粘贴 http(s)/data 链接；`本地路径` 会被单独识别并提示改用文件选择。
- **存储**：图片二进制存 IndexedDB（库 `dsh-skins` / 对象仓 `assets` / 键 `wallpaper`），按 Blob 原样保存，不再转 base64；`localStorage["dsh-skins:state:v1"]` 只留皮肤、滑杆、文字配色与壁纸类型（`{kind:'blob'}`）。旧版本的内联 data URL 壁纸会在启动时自动迁移进 IndexedDB 并清出 localStorage。壁纸是异步读取的，刷新后界面先出现、图随后贴上。
- **可调**：`暗化`（0–85%）、`面板通透度`（0–95%，控制卡片/侧栏/弹层的透明程度）、`遮罩浓度`（0–90%，设置等模态背后的雾化遮罩，默认 55%）、`面板明暗`（自动 / 深色 / 浅色，决定玻璃底取向）、`文字配色`（自动 / 高对比 / 柔和 / 自定义）。
- **文字适配**：设了壁纸后，先把壁纸缩成 1×1 量平均亮度（<0.5 判为深色壁纸）决定玻璃取向；**文字配色与玻璃取向解耦**——`自动` 跟随玻璃、`高对比` 把次级文字拉到接近正文（灰字最先被照片吃掉）、`柔和` 略微降对比、`自定义` 用两个取色器分别选正文与次级文字颜色。蒙层与描边跟着**文字**亮度走（浅字配深色描边、深字配浅色描边），与文字方向不一致时以文字为准。面板不透明度按 `1 − 通透度 × 系数` 线性计算（卡片/侧栏系数 0.95、嵌套层 0.9、弹层 0.6），只在最末端保留 6% 的硬底——所以 0–95% 全程都是有效行程，不会出现"拉到 85% 之后没反应"。
- **浮层底板**：改用"给背衬层雾化"的做法——识别**视口级浮层**（固定/绝对定位、宽高都 ≥ 视口 90%、仍接收指针事件、自身已有一层半透明底色），在它上面叠一层可调的雾化遮罩（默认 55%）+ 22px 模糊，并取消其内部文字描边。这样不再猜"哪个元素是设置面板"：面板常接近满屏，按尺寸猜会误判；而遮罩一定是视口级且自带底色。浓度拉到 0 就只剩模糊。标记是**粘滞**的：一旦命中就保留到该元素离开文档，且每个 portal 只标记面积最大的那层，避免两个雾化层叠加；扫描由 `MutationObserver` 节流（空闲后首帧立即扫，其余 150ms），雾化本身带 200ms 过渡——这三点合起来消除了"面板在通透与模糊之间跳动"。
- **灰色文字**：除 `label-primary` / `label-secondary` 外，额外把 `--dsw-alias-label-tertiary` 与 `--dsw-alias-label-disabled` 也钉到次级文字色，覆盖插件列表描述这类不在文档 token 集里的淡灰。
- **存储**：设置项在 `localStorage["dsh-skins:state:v1"]`，壁纸像素在 IndexedDB；都仅本机浏览器生效，不随账号同步。

## dsh-quota-meter

- **挂载点**：`conversation.composer.dock`，order 2（排在自带的 activity、usage 之后）
- **显示内容**：状态点 + `本会话已用 ¥0.03` + 刷新按钮；刷新失败标 `!`，悬停显示统计起点与最后更新时间。**不再显示余额**，余额只在侧边栏看。
- **消耗算法**：会话第一次挂载时把当时的总余额记为基线，消耗 = 基线 − 当前总余额；检测到余额上升（充值/退款）会把基线上移。基线存在 `localStorage["dsh-quota-meter:sessions"]`，按会话 id 记录，最多保留 100 条。
- **刷新节奏**：有任务在跑时每 15s 一轮；任务结束 2s 后补读一次（结算滞后）；空闲超过 60s 会在下一轮补读；监听 `api-session/status` 与账号登出/过期事件，登出会清空基线。
- **数据来源**：与余额插件同一个 `ctx.remote.account.getBalance()`。

## 已知限制

- 三个插件的外观都只在真实页面里人工确认过，没有自动化截图或视觉回归。
- 壁纸依赖界面用 `--dsw-alias-bg-base` 铺画布；若某个界面区域自带不透明底色，那部分就不会透出图片。
- 远程壁纸若不允许跨域读取（没有 CORS 头），画布无法测量亮度，`文字对比度=自动` 会退化为跟随外观的浅色/深色。
- 窄窗口（<768px）下设置面板铺满视口，会被当作遮罩排除在浮层底板之外，此时只靠面板自身表面。
- 皮肤与壁纸选择都是浏览器本地状态，换浏览器或清缓存会回到默认。

## 历史位置

`dsh-quota-meter` 原先放在另一个工作区的插件目录里，现已复制进本仓库、profile 的 `link:` 指向仓库内的 `dsh-quota-meter`，原目录已删除。

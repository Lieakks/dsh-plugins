# DSH 本地插件集（DeepSeek Harness）

本仓库收录三个本地 Harness 插件，均以 bundle 形式安装在 `desktop` profile 中：

| 目录 | 插件包名 | 中文名 | 作用 |
|---|---|---|---|
| [`dsh-account-balance`](dsh-account-balance) | `@local/dsh-account-balance` | 账号余额 | 左侧边栏底部常驻显示账号余额，带增量提示与动效 |
| [`dsh-skins`](dsh-skins) | `@local/dsh-skins` | 皮肤 | 整站配色皮肤 + 自定义背景图，位于 设置 → 皮肤 |
| [`dsh-quota-meter`](dsh-quota-meter) | `@local/dsh-quota-meter` | 额度消耗 | 输入框下方显示本会话已消耗额度 |

## 安装与更新

三个包都以 `link:` 方式装在 profile 里（`C:\Users\Administrator\.dsh\profiles\desktop\package.json`），因此**改完源码必须重装一次**，浏览器才会加载新的 client bundle：

```
plugin_manager remove_bundle  target=@local/dsh-account-balance
plugin_manager install_bundle target=G:\DSH_WorkSpace\dsh-account-balance
```

（其余两个同理，target 换成 `G:\DSH_WorkSpace\dsh-skins` / `G:\DSH_WorkSpace\dsh-quota-meter`。）

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
- **背景图**：本地文件（浏览器内压到最长边 1920 的 JPEG，失败自动降档到 1280 / 1100）或粘贴 http(s)/data 链接；`本地路径` 会被单独识别并提示改用文件选择。
- **可调**：`暗化`（0–85%）、`面板通透度`（0–85%，控制卡片/侧栏/弹层的透明程度）、`文字对比度`（自动 / 浅字 / 深字）。
- **文字适配**：设了壁纸后，界面按"深底浅字"或"浅底深字"整体取向——先把壁纸缩成 1×1 量平均亮度（<0.5 判为深色壁纸），再同时切换面板底色与文字色，并给正文加一层同向描边；面板另设最低不透明度地板（卡片 36%、弹层 65%），避免拉到最透时设置页和工作区文字糊在图片上。
- **存储**：`localStorage["dsh-skins:state:v1"]`，仅本机浏览器生效，不随账号同步。

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
- 皮肤与壁纸选择都是浏览器本地状态，换浏览器或清缓存会回到默认。

## 历史位置

`dsh-quota-meter` 原先位于 `C:\Users\Administrator\Documents\deepseek-harness\default-workspace\plugins\dsh-quota-meter`，现已复制进本仓库、profile 的 `link:` 指向 `G:\DSH_WorkSpace\dsh-quota-meter`，原目录已删除。

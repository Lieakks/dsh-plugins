# @lieakks/dsh-account-balance

DeepSeek Harness 侧边栏的**账号余额胶囊**：随时看到还剩多少钱。

## 功能

- 侧栏底部常驻显示账户余额，悬停可看**充值额度、赠送额度与更新时间**
- 余额下降时浮出本次增量，方便判断刚才那轮消耗了多少
- 页面可见时每 30 秒自动刷新，点击也立即刷新
- 侧栏收窄成图标栏时只留钱包图标，金额放进悬停提示
- 未登录、读取失败各有独立提示，点一下就重试

## 安装

```
plugin_manager install_bundle target=@lieakks/dsh-account-balance
```

从源码仓库安装也可以（`link:` 指向克隆目录，改代码立刻生效）：

```
plugin_manager install_bundle target=<本仓库路径>/dsh-account-balance
```

装完刷新页面；开关在 设置 → 插件 里。

## 说明

- 余额通过 Harness 自带的账号接口读取，**浏览器侧不接触登录凭据**
- 只在浏览器本地缓存读数，不上传任何数据
- 兼容 DSH `>=0.2.2-0 <0.3.0`

## 与其它插件的关系

- 配合 [`@lieakks/dsh-quota-meter`](https://www.npmjs.com/package/@lieakks/dsh-quota-meter) 可以把余额变化分摊到具体会话

## 许可

MIT

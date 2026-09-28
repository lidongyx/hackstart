---
displayed_sidebar: usecaseSidebar
sidebar_position: 9
---

# Chrome 扩展

![浏览器工作流示意](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-in-app-browser-light.webp)

Chrome 扩展让 Codex 使用你已有的 Chrome 登录态、cookie、扩展和标签页，适合检查需要登录的真实网页。

## 官方内容整理

- Chrome 扩展让 Codex 使用你已有的 Chrome 登录态、cookie、扩展和标签页，适合检查需要登录的真实网页。
- 它与内置浏览器不同：内置浏览器偏向本地预览和无需登录页面；Chrome 扩展偏向你真实浏览器中的登录场景。
- 使用前需要在 Browser 设置里安装和配置扩展。
- Codex 在已登录页面上的点击、表单提交和页面操作可能被网站视为你的账号行为。

## 实践补充

- 只有任务确实依赖登录态或扩展时才用 Chrome。
- 操作前关闭无关敏感标签页，并明确不能点击哪些按钮。
- 让 Codex 先观察页面和复述计划，再允许动作。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请使用 Chrome 扩展检查我已登录的管理后台。只观察和整理问题，不要提交、删除、发布或付款。先告诉我你看到的页面和准备检查的流程。
```


---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 3
---

# Chrome 插件

Chrome 插件让 Codex 使用你本机的 Chrome 状态，包括已登录网站、当前标签页、cookie 和扩展。它比 Browser 更贴近真实用户环境，也更需要谨慎授权。

## 适合场景

- 任务依赖已有登录态。
- 需要访问只在你 Chrome 里登录的网站。
- 需要检查 Chrome 扩展、用户脚本或真实浏览器设置。
- 需要从当前打开的网页读取上下文。

## 不适合场景

- 只是测试本地页面，优先用 Browser。
- 有公开 API 或官方 Connector，优先用 API/Connector。
- 涉及敏感网站且你不希望 Codex 看到页面内容。

## 典型提示词

```text
请使用 Chrome 查看当前打开的控制台页面，只读取页面状态，不要点击任何会提交或保存的按钮。
```

```text
请用 Chrome 打开我已登录的后台页面，帮我记录这个表单有哪些字段。不要提交表单。
```

## 安全提醒

Chrome 页面可能包含私人信息。让 Codex 使用 Chrome 前，最好明确：

- 可以读哪些标签页。
- 是否允许点击。
- 是否允许输入。
- 哪些按钮绝对不能碰。

对“发送”“保存”“删除”“支付”这类动作，要求 Codex 停下来等你确认。

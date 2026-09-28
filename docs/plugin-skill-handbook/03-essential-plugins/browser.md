---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 2
---

# Browser 插件

Browser 是 Codex 的内置浏览器控制插件，适合测试本地网页和文件页面。它的重点不是“替你上网搜索”，而是让 Codex 打开、点击、输入、截图、检查你正在开发的页面。

## 适合场景

- 打开 `localhost` 或 `127.0.0.1` 本地站点。
- 检查 Docusaurus、Vite、Next.js、React 页面。
- 验证按钮、表单、导航、布局响应式。
- 对前端改动做截图回归。
- 检查 `file://` 本地 HTML 页面。

## 典型提示词

```text
请用 Browser 打开 http://127.0.0.1:3007/docs/，检查插件与技能小册的导航和侧边栏是否正常。
```

```text
我已经启动了本地开发服务器。请用 Browser 走一遍注册页面，截图检查移动端和桌面端布局。
```

## 使用边界

Browser 更适合本地开发调试。如果任务依赖你 Chrome 里的登录状态、cookie 或扩展，应改用 Chrome 插件。

## 验证方式

让 Codex 明确汇报：

- 打开的 URL。
- 点击过哪些入口。
- 看到的页面标题或关键文本。
- 截图中是否有遮挡、错位、空白。
- 是否发现控制台或网络错误。

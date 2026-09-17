---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 5
---

# playwright

`playwright` skill 适合通过真实浏览器自动化检查网页。它和 Browser 插件目标接近，但更偏命令行和可重复测试。

## 什么时候用

- 需要打开页面、点击、输入、截图。
- 要检查本地 Web 应用。
- 要从网页提取结构化信息。
- 要做可重复的 UI 流程验证。

## 典型提示词

```text
$playwright
请打开 http://127.0.0.1:3007/docs/，截图检查桌面端和移动端导航。
```

```text
$playwright
请走一遍登录表单，验证错误提示和成功跳转，不要提交真实付款或删除操作。
```

## Browser 和 playwright 怎么选

- 临时查看本地页面：Browser 更轻。
- 需要脚本化、截图、重复跑：playwright 更稳。
- 需要用户 Chrome 登录态：Chrome 插件更合适。

## 验证建议

让 Codex 输出：

- 浏览器打开的 URL。
- 每一步操作。
- 截图路径。
- 是否有控制台错误。
- 是否发现文字遮挡、布局错位或按钮不可点。

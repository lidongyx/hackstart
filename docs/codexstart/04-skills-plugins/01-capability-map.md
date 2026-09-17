---
displayed_sidebar: codexstartSidebar
sidebar_position: 1
description: 用一张地图理解 Prompt、AGENTS.md、Skill、Plugin、MCP、Connector 和 CLI 的分工。
---

# Skill、Plugin、MCP 到底怎么选

## 一张简单的判断表

| 你遇到的需求 | 优先选择 | 原因 |
| --- | --- | --- |
| 这次任务怎么做 | Prompt | 只影响当前任务 |
| 这个仓库长期遵守什么规则 | `AGENTS.md` | 进入项目就能看到 |
| 同类任务反复出现 | Skill | 把步骤和验证沉淀下来 |
| 想把能力分发给别人 | Plugin | 打包技能、工具和说明 |
| 需要调用外部工具或数据 | MCP / Connector | 接入浏览器、设计、邮件等系统 |
| 想从终端批量运行 | CLI | 让流程可脚本化和重复执行 |

## 用一个例子理解

你每天都要检查文档站：

- Prompt：今天检查某一篇文章。
- `AGENTS.md`：规定必须运行 `pnpm typecheck` 和 `pnpm build`。
- Skill：规定如何检查链接、侧边栏、移动端和截图。
- Plugin：把这个 Skill 和相关工具安装给团队。
- Browser 或 Playwright：打开页面并执行操作。
- CLI：在 CI 中重复跑同样的检查。

不要为了“一次性任务”安装整套插件，也不要把一套稳定流程永远藏在聊天记录里。

## 课后任务

列出你最近重复做的 3 类工作，分别判断它们应该留在 Prompt、项目规则、Skill、Plugin 还是 CLI 中，并说明理由。


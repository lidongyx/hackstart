---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 9
---

# chatgpt-apps

`chatgpt-apps` skill 适合构建 ChatGPT Apps SDK 应用。它通常会同时涉及 MCP server、前端 widget、工具 schema 和 ChatGPT 运行环境。

## 什么时候用

- 你要做一个 ChatGPT 内运行的小应用。
- 需要 MCP server 暴露工具给 ChatGPT。
- 需要 widget UI 与工具结果联动。
- 要处理 Apps SDK 的 metadata、CSP、资源注册。

## 典型提示词

```text
$chatgpt-apps
请帮我设计一个 ChatGPT App，用于查询 HackStart API 用量。先给工具 schema 和 widget 结构，不要直接写代码。
```

## 实践建议

Apps SDK 变化较快。使用这个技能时，最好同时要求 Codex 使用 `openai-docs` 查最新官方文档。

一个好的 Apps 项目至少要明确：

- 用户在 ChatGPT 里看到什么。
- MCP 工具有哪些输入输出。
- widget 如何展示状态。
- 是否需要登录或外部 API key。
- 如何本地调试。

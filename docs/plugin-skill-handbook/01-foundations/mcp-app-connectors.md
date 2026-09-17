---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 3
---

# MCP 与 App Connector

MCP 和 App Connector 都能让 Codex 接触外部系统，但它们的角色不同。

## MCP 解决工具问题

MCP 全称是 Model Context Protocol。它让 Codex 能调用外部工具或读取外部上下文，例如：

- 读取 OpenAI 官方文档。
- 从 Figma 获取设计结构和截图。
- 控制 Playwright 浏览器做页面测试。
- 查询 GitHub issue、PR 或仓库信息。
- 访问内部数据库、日志系统、知识库。

MCP 更像“工具接口”。它可以是本地进程，也可以是 HTTP 服务。

## App Connector 解决授权问题

App Connector 更偏向“连接你的账号数据”。比如 Gmail、Slack、Google Drive、Notion、Zoom 这类应用，需要用户登录并授权。插件可以带 App Connector，但安装插件不等于已经授权外部应用。

如果插件安装成功，但 Codex 仍不能读取某个外部应用，通常不是插件坏了，而是还没完成授权、权限不够，或工作区策略禁用了连接。

## Plugin 可以打包 MCP

插件可以把 MCP server 一起打包。这样用户安装插件后，不需要手动写一大段 `config.toml`。但插件里的 MCP 仍然有权限边界，你可以在配置里控制启用状态、工具白名单和审批策略。

## 实践建议

- 官方文档类：优先用 OpenAI Docs MCP、Context7 这类文档 MCP。
- 浏览器调试类：用 Browser、Playwright 或 Chrome DevTools MCP。
- 设计稿类：用 Figma MCP。
- 私有数据类：优先用官方 App Connector，不要把密钥直接塞进 Prompt。
- 内部系统：适合写自己的 MCP，再用 plugin 分发给团队。

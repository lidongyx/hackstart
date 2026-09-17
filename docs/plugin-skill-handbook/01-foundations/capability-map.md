---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 1
---

# Codex 扩展能力地图

Codex 的能力可以分成两层：一层是你给它的指令，另一层是它能调用的工具。插件、技能、MCP、Prompt 和 CLI 并不是互相替代的概念，它们解决的问题不一样。

## 一张关系表

| 名称 | 解决什么问题 | 最适合什么时候用 |
| --- | --- | --- |
| Prompt | 本次任务要做什么 | 一次性需求、临时约束、具体交付 |
| Goal | 长任务的持续目标 | 多步骤迁移、长期排障、复杂交付 |
| AGENTS.md | 仓库级持久规则 | 项目约定、验证命令、部署边界 |
| config.toml | Codex 本机或项目配置 | 模型、沙箱、MCP、插件启停、权限策略 |
| CLI | 从终端启动、诊断和自动化 Codex | 脚本化、批处理、本地工程任务 |
| Skill | 可复用工作流 | 重复任务、领域方法、验证步骤 |
| Plugin | 可安装能力包 | 分发 skills、MCP、App 连接、资源和元数据 |
| MCP | 给 Codex 接入外部工具和上下文 | Figma、浏览器、GitHub、文档、内部系统 |
| App Connector | 授权访问第三方应用数据 | Gmail、Slack、Google Drive、Notion 等 |

可以把它理解成：Prompt 是“这次怎么做”，Skill 是“以后遇到这类事都这么做”，Plugin 是“把一套能力安装给别人用”，MCP 和 App Connector 是“让 Codex 能接触外部世界”。

## 最小选择原则

不要一上来就做插件。先按最小范围选择：

- 只做一次：写清楚 Prompt。
- 同一个仓库长期遵守：写进 `AGENTS.md`。
- 同一种任务反复出现：做成 Skill。
- 要分发给别人安装：打包成 Plugin。
- 需要访问工具、账号或实时数据：接 MCP 或 App Connector。
- 要从命令行自动跑：用 CLI、`codex exec` 或自建 CLI。

## 一个真实例子

假设你经常让 Codex 检查 Docusaurus 文档站：

- Prompt：这次让 Codex 修改某篇教程。
- AGENTS.md：规定必须运行 `pnpm typecheck` 和 `pnpm build`。
- Skill：沉淀“文档站改动检查清单”。
- Plugin：把这个 skill、校验脚本和团队说明打包，发给团队成员。
- MCP：接入 Notion、GitHub 或 Figma，读取真实资料和设计稿。
- CLI：封装 `docs-check`，让 Codex 或 CI 一条命令完成检查。

这才是 Codex 扩展体系真正有价值的地方：不是装很多东西，而是把重复劳动变成稳定流程。

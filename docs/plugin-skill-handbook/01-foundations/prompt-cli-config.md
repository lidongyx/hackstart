---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 4
---

# Prompt、CLI 与配置文件

很多人一开始会把 Prompt 写得越来越长，最后变成一坨不好维护的“万能咒语”。更好的做法是把不同层级的信息放到不同位置。

## Prompt：只放本次任务

Prompt 应该描述这次要完成什么，包括：

- 目标。
- 输入材料。
- 修改范围。
- 不要做什么。
- 验证标准。

Prompt 不适合长期保存项目规则，也不适合塞大量工具说明。那些内容应该进入 AGENTS.md、Skill 或插件。

## CLI：让 Codex 进入自动化场景

Codex CLI 适合三类场景：

- 在终端里启动本地工程任务。
- 用 `codex exec` 做非交互式批处理。
- 管理插件、MCP、登录状态、诊断信息。

高频命令包括：

```bash
codex --version
codex doctor
codex plugin list
codex plugin marketplace list
codex mcp --help
codex exec "检查这个仓库的文档链接"
```

CLI 是把 Codex 接进工程自动化的入口。它不替代 skill，但它能运行 skill 需要的验证命令、脚本和工具。

## AGENTS.md：项目规则

`AGENTS.md` 适合写项目内长期有效的规则，例如：

- 主要仓库在哪里。
- 不要动哪些线上配置。
- 修改后必须运行哪些命令。
- 部署、证书、密钥有哪些边界。

它的作用是让 Codex 进入项目时先知道“这里的地形”。

## config.toml：本机和项目配置

`config.toml` 管理 Codex 的行为设置，例如：

- MCP server。
- 插件启停。
- 沙箱和审批。
- 功能开关。
- 模型和 provider。

不要把一次性任务要求写进 `config.toml`。配置文件应该保持稳定，适合跨线程复用。

## Custom Prompts 的位置

Codex 仍支持本地 custom prompts，但官方更推荐用 skills 承载可复用工作流。原因很简单：custom prompt 需要显式调用，而 skill 可以通过描述被 Codex 自动匹配，也能携带参考、脚本和元数据。

如果你有一段常用提示词，优先考虑把它升级成 skill。

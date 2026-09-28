---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 3
---

# 权限、安全与排障

插件和技能能让 Codex 更强，也会扩大它能接触的文件、应用和外部服务。安装前要先理解权限边界。

## 插件不是免审批通行证

安装插件只表示 Codex 可以使用这组能力。它不代表 Codex 可以绕过你的审批设置，也不代表外部 App 已经授权。

对于这些动作，仍然建议保留人工确认：

- 发送消息、邮件、评论。
- 删除文件、数据或远程资源。
- 部署生产环境。
- 付款、下单、修改订阅。
- 修改 DNS、证书、WAF、权限策略。

## 外部 App 的数据边界

Gmail、Slack、Google Drive、Notion、Zoom 这类插件可能读取私有数据。使用前要确认：

- 是否是你自己的账号或团队授权账号。
- Codex 能读取哪些范围。
- 是否允许写入或发送。
- 是否有工作区管理员策略限制。

如果只是公开资料，不要让 Codex 通过私人账号绕一圈读取。

## MCP 的工具白名单

MCP server 可能暴露多个工具。对不熟悉的 MCP，可以先只开放只读工具，确认稳定后再放开写操作。

常见策略：

- 文档 MCP：允许 search/read。
- 浏览器 MCP：先允许 open/screenshot，再允许 click/type。
- GitHub MCP：先允许 read，再允许 issue/PR 写操作。
- 内部系统 MCP：默认只读，写操作单独审批。

## 常见排障顺序

遇到插件或技能不可用，按这个顺序查：

1. `codex plugin list` 看是否安装并启用。
2. `codex plugin marketplace list` 看 marketplace 是否存在。
3. 检查 `~/.codex/config.toml` 是否禁用了插件或 skill。
4. 重启 Codex 或开新线程。
5. 外部 App 插件检查是否完成授权。
6. MCP 插件检查 server 是否能启动、token 是否存在、工具是否被禁用。
7. 运行 `codex doctor` 看本机环境诊断。

不要第一反应就删除重装。大多数问题是路径、授权、启停状态或新线程未加载。

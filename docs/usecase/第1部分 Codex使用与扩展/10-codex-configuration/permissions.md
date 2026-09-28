---
displayed_sidebar: usecaseSidebar
sidebar_position: 5
---

# 权限与沙盒

权限配置用 read、write、deny 描述文件系统访问；更具体路径覆盖更宽泛路径。

## 官方内容整理

- 权限配置用 read、write、deny 描述文件系统访问；更具体路径覆盖更宽泛路径。
- deny 优先于 write，write 优先于 read。
- 路径可用 :root、:minimal、:workspace_roots、:tmpdir、:slash_tmp、绝对路径和 home 路径。
- 网络权限可以启用后按域名 allow 或 deny；默认会防护本地和私有网络访问。
- Permission profiles 可描述可复用的文件系统和网络权限组合。

## 实践补充

- 默认只给 workspace 写权限。
- 对 .env、SSH、密钥和生成凭据使用 deny。
- 需要网络时尽量 allowlist 具体域名或本地地址。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请为当前项目设计一个安全的 Codex permission profile。要求能修改工作区代码，不能读取 .env 和 SSH 目录，默认禁止网络，只允许访问本地开发服务器。
```


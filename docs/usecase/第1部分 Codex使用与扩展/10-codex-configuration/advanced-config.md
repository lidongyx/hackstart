---
displayed_sidebar: usecaseSidebar
sidebar_position: 2
---

# 高级配置

Profiles 可以保存命名配置层，使用 --profile 切换。每个 profile 是独立 TOML 文件，只写与基础配置不同的 key。

## 官方内容整理

- Profiles 可以保存命名配置层，使用 --profile 切换。每个 profile 是独立 TOML 文件，只写与基础配置不同的 key。
- --config 可为单次运行覆盖任意配置 key，值按 TOML 解析。
- 项目 .codex/config.toml 会从项目根到当前目录逐层加载，最近配置优先。
- 自定义 model provider 可配置 base_url、wire_api、env_key、headers 或命令式认证。
- shell_environment_policy 控制 Codex 启动子进程时传递哪些环境变量。

## 实践补充

- 把“日常开发、深度审查、只读审计”做成不同 profile。
- provider、凭证、telemetry 和通知类设置不要放项目级配置。
- 环境变量策略要从少量必要变量开始，避免泄露密钥。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请为我设计三个 Codex profile：日常开发、深度 review、只读审计。每个 profile 说明模型、reasoning、sandbox、approval、network 和适用场景。
```


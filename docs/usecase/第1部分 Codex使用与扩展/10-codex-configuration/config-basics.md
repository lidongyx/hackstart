---
displayed_sidebar: usecaseSidebar
sidebar_position: 1
---

# 配置基础

Codex 的个人默认配置通常存放在 CODEX_HOME 下的 config.toml 中。

## 官方内容整理

- Codex 的个人默认配置通常存放在 CODEX_HOME 下的 config.toml 中。
- 项目可以添加 .codex/config.toml 作为项目级配置；只有受信任项目才会加载项目 .codex 配置、hooks 和 rules。
- 配置优先级从高到低通常是 CLI flag 或 --config、项目配置、profile、用户配置、系统配置、内置默认。
- 常见配置包括默认模型、审批策略、sandbox、MCP、web search、reasoning effort、personality、features。

## 实践补充

- 个人偏好放用户配置，团队共享约束放项目配置。
- 临时实验用 --config，不要为了测试频繁改持久配置。
- 国内代理或 HackStart Base URL 这类 provider 相关配置应放用户级。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请检查当前 Codex 配置层级。列出用户配置、项目配置、profile 和 CLI override 的优先级冲突，并建议哪些设置应该放在哪里。
```


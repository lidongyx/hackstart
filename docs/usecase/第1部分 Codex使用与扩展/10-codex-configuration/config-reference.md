---
displayed_sidebar: usecaseSidebar
sidebar_position: 3
---

# 配置参考速查

配置参考覆盖模型、provider、sandbox、approval、web search、features、hooks、permissions、telemetry 等 key。

## 官方内容整理

- 配置参考覆盖模型、provider、sandbox、approval、web search、features、hooks、permissions、telemetry 等 key。
- model 决定默认模型；model_provider 决定请求走哪个供应商。
- approval_policy 决定 Codex 何时停下来请你批准；sandbox_mode 或 permission profiles 决定命令访问范围。
- features 表用于启用或关闭功能；web_search 控制缓存搜索、实时搜索或关闭搜索。

## 实践补充

- 不用背所有 key，先掌握模型、权限、sandbox、MCP、web search。
- 修改配置前备份原文件，修改后用小任务验证。
- 配置说明最好写注释，方便以后知道为什么这么设。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请把我的 config.toml 做一次配置审查。输出每个关键设置的含义、风险、是否建议保留，以及如果要改应该如何验证。
```


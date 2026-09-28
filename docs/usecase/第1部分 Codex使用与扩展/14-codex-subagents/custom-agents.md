---
displayed_sidebar: usecaseSidebar
sidebar_position: 3
---

# 自定义代理

Codex 内置 default、worker 和 explorer 代理。你也可以定义自己的 custom agent。

## 官方内容整理

- Codex 内置 default、worker 和 explorer 代理。你也可以定义自己的 custom agent。
- 个人代理放在用户 agents 目录，项目代理放在项目 .codex/agents。
- 每个 custom agent 文件至少需要 name、description 和 developer_instructions。
- 可选字段包括 nickname_candidates、model、reasoning、sandbox、MCP 和 skills 配置。
- 如果自定义名称与内置代理相同，自定义版本优先。

## 实践补充

- 自定义代理要窄而有观点，不要做万能代理。
- 为 reviewer、explorer、data-checker 这类明确角色写不同指令。
- 用小任务试跑后再加入常用工作流。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请为我设计一个自定义 reviewer agent。它专注代码正确性、安全、行为回归和缺失测试。给出 TOML 内容、适用场景、sandbox 建议和测试提示词。
```


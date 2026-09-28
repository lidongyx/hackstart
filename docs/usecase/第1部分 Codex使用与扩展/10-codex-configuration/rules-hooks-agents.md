---
displayed_sidebar: usecaseSidebar
sidebar_position: 6
---

# Rules、Hooks 与 AGENTS.md

AGENTS.md 适合写项目说明、目录边界、常用命令、验证方式和长期约定。

## 官方内容整理

- AGENTS.md 适合写项目说明、目录边界、常用命令、验证方式和长期约定。
- Rules 适合表达更机械、可判断的行为约束，例如阻止危险命令或保护路径。
- Hooks 可在工具调用前后执行本地命令，用于策略检查、日志、格式化、通知或安全门禁。
- 项目级 hooks 和 rules 只有在项目受信任时加载；用户级配置独立于项目 trust。

## 实践补充

- AGENTS.md 写给人和模型读，Rules/Hooks 更偏执行约束。
- 先用 AGENTS.md 说明项目，再为高风险动作加 Rules 或 Hooks。
- Hook 脚本要小、可靠、有超时。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请帮我设计这个项目的 Codex 持久约束：AGENTS.md 写哪些说明，Rules 阻止哪些风险动作，Hooks 在哪些命令前做检查。
```


---
displayed_sidebar: usecaseSidebar
sidebar_position: 4
---

# Subagents 配置

全局 subagent 设置包括最大并发线程、嵌套深度和批量任务超时。

## 官方内容整理

- 全局 subagent 设置包括最大并发线程、嵌套深度和批量任务超时。
- agents.max_threads 控制同时打开的 agent 线程数量。
- agents.max_depth 控制代理嵌套深度；默认通常只允许直接子代理。
- 提高嵌套深度可能导致递归 fan-out，增加 token、延迟和资源消耗。
- nickname_candidates 可让多个同类代理有更易读的显示名。

## 实践补充

- 从默认值开始，不要过早提高深度。
- PR 多维审查可以提高一点并发，但保持 max_depth 保守。
- 长任务设置合理超时，避免拖住汇总。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请根据我的机器和使用习惯建议 subagents 配置。目标是支持 PR 多维审查，但避免过多并发。说明 max_threads、max_depth、timeout 和昵称策略。
```


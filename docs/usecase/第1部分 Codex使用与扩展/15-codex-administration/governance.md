---
displayed_sidebar: usecaseSidebar
sidebar_position: 8
---

# Governance 治理

Governance 帮助企业了解 Codex 的使用情况、评审活动和合规记录，从而把 Codex 纳入现有的工程管理、安全审计和成本观察体系。

## 官方内容整理

- 管理员可以查看 Codex usage analytics，理解团队如何使用 Codex。
- 分析数据可以覆盖 credits、threads、turns、文本 token、活跃用户和连续使用情况。
- Code Review 活动可以统计已评审 PR、不同优先级问题、评论、回复、reaction 和反馈情绪。
- 如果工作区启用了技能调用、agent identity 或 access token，也可以在治理数据中观察相关使用情况。
- 管理员可以导出 Codex analytics 数据，格式包括 CSV 和 JSON。
- Analytics API 面向自动化报表和内部 dashboard，可按天或周返回工作区级、用户级、客户端级和 Code Review 维度数据。
- API 返回分页结果，适合接入数据仓库、BI 或内部工程仪表盘。
- Compliance API 面向安全、法务和治理，提供可审计记录和元数据。
- 合规记录可用于回答谁运行了任务、何时运行、使用哪个模型、处理了多少内容、谁创建或撤销了访问令牌等问题。
- 使用 ChatGPT 身份认证的 Codex 活动会进入 ChatGPT 工作区的合规导出；API Key 认证的 Codex 使用则遵循 API 组织设置。

## 实践补充

治理的目标不是监控每个开发者的每句话，而是回答组织层面的关键问题：Codex 是否真的提升了交付效率，哪些场景最有价值，哪些权限过度开放，哪些任务应该沉淀成模板或自动化。

对中国国内团队来说，建议把治理结果做成月度工程效率复盘：展示 Codex 使用增长、Code Review 发现、自动化节省时间、风险事件和下月改进项。这样 Codex 不只是“新工具”，而会进入团队管理节奏。

## 推荐工作流

1. 先定义治理指标：活跃用户、任务量、评审量、自动化成功率、人工采纳率、风险事件。
2. 区分 local、cloud、CI、Slack、Code Review 等来源。
3. 把 analytics 数据接入内部报表，按团队和项目归因。
4. 把 compliance 数据接入审计流程，不把它当作日常产品指标。
5. 每月复盘一次高价值提示词、失败案例、权限调整和培训需求。

## 示例提示词

```text
请设计一个 Codex 治理看板。指标包括 adoption、usage、Code Review 质量、自动化任务、access token 使用、风险审批和团队排行。请说明每个指标的含义、数据来源和行动建议。
```

```text
请把这份 Codex 使用导出数据整理成管理层月报，突出采用情况、典型收益、风险信号、下月改进项和需要管理员决策的问题。
```

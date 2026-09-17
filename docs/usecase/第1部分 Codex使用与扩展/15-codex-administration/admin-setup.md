---
displayed_sidebar: usecaseSidebar
sidebar_position: 7
---

# Admin Setup 管理员设置

Admin Setup 面向 ChatGPT Enterprise 管理员，帮助组织启用 Codex、配置角色、管理本地和云端能力，并建立治理与安全边界。

## 官方内容整理

- 企业管理员需要先确定 rollout 负责人：ChatGPT 工作区 owner、安全负责人、分析或合规负责人。
- Codex local 包括桌面 App、CLI 和 IDE 扩展，agent 在开发者自己的电脑或受控环境中运行。
- Codex cloud 包括托管任务、iOS、Code Review，以及从 Slack、Linear 等入口创建的任务，agent 在托管容器中运行。
- 企业可以只启用 local、只启用 cloud，或同时启用两者。
- Codex local 通常由工作区设置里的 “Allow members to use Codex Local” 控制。关闭后，用户会看到未授权错误。
- CLI 在远程或无交互环境中可以使用设备码认证，但管理员需要在工作区安全设置里允许。
- Codex cloud 需要 GitHub 云托管仓库，并需要管理员或工程负责人有对应仓库访问权限。
- 启用 Cloud 后，用户可以从 ChatGPT 侧边栏进入 Codex。变更可能需要等待一段时间才出现在用户界面中。
- 管理员可以控制 Codex Slack app 是否在任务完成后把完整答案发回 Slack。
- 默认情况下，Codex Cloud agent 运行时不访问互联网。管理员可配置允许的域名、可信站点和 HTTP 方法。
- RBAC 可用于控制 Codex local、cloud 和管理权限。建议建立 Codex Users 与 Codex Admin 两类组。
- Codex Admin 可以查看工作区分析、管理云端策略、分配 managed policies、管理 cloud environments。
- 本地约束可以通过 cloud-managed `requirements.toml` 下发，控制审批、沙盒、网络、MCP、功能开关和命令规则。

## 实践补充

管理员设置的重点不是“让所有人都能用”，而是“让不同人用到刚好需要的能力”。工程师需要本地开发能力，平台团队可能需要管理 cloud environments，安全团队需要审计和策略，业务团队可能只需要从 Slack 发起任务。

推广初期建议先选一个低风险团队试点：开启 local、限定 workspace-write、保留人工审批、收集使用问题；等团队形成提示词、权限和审计习惯后，再扩大到 cloud、CI 和跨工具自动化。

## 推荐工作流

1. 明确 rollout 范围：试点团队、项目类型、Codex surface 和成功指标。
2. 建立用户组和管理员组，避免把管理权限给所有 Codex 用户。
3. 为 local 和 cloud 分别定义默认权限与网络策略。
4. 对 access token、managed configuration、analytics、compliance API 设定负责人。
5. 用一份内部 FAQ 解释登录、权限、审批、数据治理和故障反馈路径。

## 示例提示词

```text
请为一家 80 人研发团队设计 Codex Enterprise 管理员启用计划。分阶段覆盖 Local、Cloud、Slack、Code Review、RBAC、managed configuration、analytics 和培训材料。
```

```text
请把下面的组织结构映射成 Codex 角色与权限方案：普通研发、前端平台、后端平台、安全团队、工程经理、外包协作人员。输出哪些人能用 local、cloud、admin、access token 和 analytics。
```

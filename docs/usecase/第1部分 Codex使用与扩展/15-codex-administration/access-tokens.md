---
displayed_sidebar: usecaseSidebar
sidebar_position: 2
---

# Access tokens 访问令牌

Codex access token 是面向可信自动化的 ChatGPT 工作区身份令牌。它让脚本、定时任务和私有 CI runner 可以在没有浏览器登录的情况下运行 Codex 本地工作流。

## 官方内容整理

- Codex access token 当前面向 ChatGPT Business 和 Enterprise 工作区。
- 令牌由工作区成员在管理员允许后创建，绑定创建者的 ChatGPT 用户和工作区身份。
- Codex 会在运行开始时校验令牌，并把本次运行关联到对应工作区身份，因此企业可以继续做治理、审计和归属分析。
- 如果 Platform API Key 已经满足自动化需求，应继续使用 API Key。只有当自动化需要 ChatGPT 工作区权限、ChatGPT 管理的 Codex 权益或企业工作区控制时，才使用 Codex access token。
- access token 适用于 `codex exec`、本地脚本、可信调度器和企业内部 runner。
- access token 不等同于 Workspace Agent access token，也不适合拿来调用普通 OpenAI API。
- 管理员可以开启或关闭成员创建 access token 的权限，也可以设置最长过期时间。
- 创建令牌时需要命名、选择过期时间、复制一次性显示的令牌，并存入 secret manager 或 CI secret store。
- 轮换流程通常是：创建新令牌，更新运行环境，做 smoke test，然后撤销旧令牌。
- 工作区所有者和管理员可以查看并撤销工作区内令牌；普通成员只能管理自己创建的令牌。

## 实践补充

access token 的价值在于“用 ChatGPT 工作区身份跑自动化”，不是替代所有 API Key。对于公共仓库、fork PR、共享机器或不可信 runner，应该避免使用 access token，因为令牌泄漏后会以创建者身份启动 Codex 运行。

为每个自动化流程创建单独令牌，比多个团队共用同一个人的令牌更容易追踪责任和排查问题。令牌名称建议包含业务、环境和负责人，例如 `release-review-prod-ownername`。

## 推荐工作流

1. 确认自动化是否真的需要 ChatGPT 工作区身份。
2. 由流程负责人创建令牌，而不是让平台团队共用个人令牌。
3. 给令牌设置有限过期时间，并在内部日历或密钥系统里登记轮换提醒。
4. 在 runner 中只把令牌暴露给 Codex 这一步，不要让构建脚本、测试脚本和第三方 action 同时读到。
5. 定期从工作区审计视角检查令牌使用记录、创建者、最后使用时间和异常调用。

## 示例提示词

```text
请把我们现有的 Codex 夜间巡检脚本改造成 access token 认证方案。输出需要改的环境变量、secret 命名、令牌过期策略、轮换步骤和失败回滚方案。
```

```text
请设计一个 Codex access token 台账模板，字段包含用途、创建者、运行环境、过期时间、权限边界、轮换责任人、最近一次 smoke test 结果。
```

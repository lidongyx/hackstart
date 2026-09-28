---
displayed_sidebar: usecaseSidebar
sidebar_position: 9
---

# Managed configuration 托管配置

Managed configuration 让企业管理员统一约束本地 Codex 行为。它分为强制要求和托管默认值：前者用户不能覆盖，后者只是启动时的默认配置。

## 官方内容整理

- Requirements 是管理员强制约束，用户本地配置不能放宽。
- Managed defaults 是启动时应用的默认值，用户可以在会话中修改，下次启动再重新应用。
- Requirements 可约束审批策略、审批 reviewer、自动评审策略、沙盒模式、权限 profile、Web search 模式、managed hooks，以及可启用的 MCP server。
- 如果用户本地配置与强制要求冲突，Codex 会回退到兼容值，并通知用户。
- 如果配置了 MCP server allowlist，Codex 只有在 server 名称和身份都匹配时才启用。
- Requirements 也可以通过 `[features]` 约束功能开关，例如 Browser Use、in-app browser、Computer Use、personality 和 unified exec。
- 新版本推荐使用 permission profiles 与 `allowed_permission_profiles`；旧版本可能仍使用 `allowed_sandbox_modes`。
- Requirements 来源按优先级处理：cloud-managed requirements、macOS MDM managed preferences、系统级 `requirements.toml`。
- Cloud-managed requirements 适用于 ChatGPT Business 或 Enterprise 登录用户，并覆盖 App、CLI 和 IDE 扩展。
- 管理员可以按用户组分配不同 requirements，也可以设置默认 fallback policy。用户命中多个组时，使用第一个匹配规则。
- Codex 会缓存 managed requirements。网络失败时，如果本地有有效缓存，会继续使用缓存。
- 管理员可以控制权限 profile、网络访问要求、特性开关、Computer Use 锁屏行为、自动审批审查、deny-read 路径和命令规则。

## 实践补充

托管配置适合把组织共识写成机器可执行的边界。比如：普通研发只能 workspace-write，安全团队可以 read-only 扫描更多目录，CI 自动修复只能访问构建域名，外包人员禁用 Computer Use 和浏览器。

不要把所有限制堆到一个全局策略里。更好的方式是先建立 baseline，再为平台、安全、CI、远程开发等场景建立小而明确的变体。

## 推荐工作流

1. 盘点团队使用场景，先写出 baseline requirements。
2. 将敏感目录、凭证路径和生产配置加入 deny-read。
3. 给网络访问建立允许域名列表，而不是默认放开全部出口。
4. 为 Browser Use、Computer Use、in-app browser 设定明确启用人群。
5. 每次修改 managed configuration 后，用测试账号和测试项目验证实际生效结果。

## 示例提示词

```text
请为我们公司设计三套 Codex managed requirements：普通研发、CI 自动修复、安全审计。每套需要包含 permission profiles、审批策略、网络域名、deny-read 路径、功能开关和适用用户组。
```

```text
请审查这份 requirements.toml 是否存在冲突、过度授权或无法在旧版 Codex 客户端生效的问题，并给出迁移到 permission profiles 的建议。
```

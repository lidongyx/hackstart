---
displayed_sidebar: usecaseSidebar
sidebar_position: 1
---

# Authentication 认证

Codex 支持通过 ChatGPT 账号或 API Key 登录。不同登录方式决定了可用能力、计费方式、企业策略和数据治理规则。

## 官方内容整理

- 使用 OpenAI 模型时，Codex 支持两种认证方式：ChatGPT 登录和 API Key 登录。
- Codex Cloud 需要 ChatGPT 登录；Codex CLI 和 IDE 扩展同时支持 ChatGPT 登录与 API Key 登录。
- ChatGPT 登录会继承 ChatGPT 工作区权限、角色控制、企业保留策略和数据驻留策略。
- API Key 登录会继承 OpenAI API 组织的计费、数据保留和数据使用设置，适合程序化、脚本化和 CI/CD 场景。
- CLI 默认优先引导用户使用 ChatGPT 登录。登录完成后，Codex 会缓存凭证，后续启动时自动复用。
- CLI 和 IDE 扩展共享本地登录缓存。任意一边退出登录后，另一边下次使用也需要重新认证。
- 本地凭证可以存放在系统凭证库，也可以存放在 `CODEX_HOME` 下的 `auth.json` 文件中。企业环境通常更适合使用系统凭证库或受控的凭证管理方案。
- 无浏览器、远程机器或 localhost 回调受限时，可以使用设备码登录；也可以先在有浏览器的机器上登录，再把认证缓存安全地复制到目标机器。
- 企业管理员可以强制登录方式，例如只允许 ChatGPT 登录，或限定用户必须登录到指定工作区。
- 企业自动化如果需要 ChatGPT 工作区身份，可以使用 Codex access token；普通 OpenAI API 调用仍应使用 Platform API Key。
- 如果公司网络使用私有根证书或 TLS 代理，可以通过 CA 证书配置让登录、HTTPS 请求和安全 WebSocket 连接都使用同一套信任链。

## 实践补充

认证方式可以按使用场景拆开：个人本地开发优先 ChatGPT 登录，CI 和一次性脚本优先 API Key，企业内的受控自动化再考虑 access token。不要为了“方便”把用户浏览器会话、工作区身份和 CI 运行时混在一起。

远程开发机、容器、跳板机和企业内网常见的问题不是 Codex 本身不可用，而是浏览器回调、证书链、环境变量继承和凭证缓存位置不一致。排查时先确认当前 Codex 进程读到的 `CODEX_HOME`、凭证存储方式、网络代理和 CA 配置。

## 推荐工作流

1. 先判断任务运行在哪里：本地电脑、远程开发机、CI runner、容器，还是 Codex Cloud。
2. 再选择身份类型：个人交互用 ChatGPT，程序化调用用 API Key，企业受控自动化用 access token。
3. 用 `/status` 或登录诊断日志确认当前登录身份、模型提供方、工作区和配置是否符合预期。
4. 对远程或无头环境，优先使用设备码登录；如果必须复制缓存，只在受信机器之间复制。
5. 企业团队应把认证方式、凭证过期策略、轮换责任人和使用场景写进内部运行手册。

## 示例提示词

```text
请帮我检查这个团队的 Codex 登录方案。我们有本地开发、远程开发机、GitHub Actions 和夜间任务四种场景，请分别建议使用 ChatGPT 登录、API Key 还是 access token，并说明风险、配置入口和轮换方式。
```

```text
我在一台无浏览器的远程 Linux 机器上使用 Codex CLI。请给我一个排查清单，覆盖设备码登录、localhost 回调、认证缓存、系统凭证库、代理和自定义 CA。
```

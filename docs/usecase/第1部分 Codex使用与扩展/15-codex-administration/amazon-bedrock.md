---
displayed_sidebar: usecaseSidebar
sidebar_position: 6
---

# Amazon Bedrock 模型提供方

Codex 可以配置为通过 Amazon Bedrock 使用可用的 OpenAI 模型。此时 Codex 仍在本地运行，但模型请求走 AWS 管理的认证与访问控制。

## 官方内容整理

- 使用 Amazon Bedrock 作为模型提供方时，OpenAI 托管的 Responses API 不在请求路径中。
- Codex 会向 Bedrock 发送模型请求，Bedrock 提供兼容 Responses API 的 OpenAI 模型能力。
- 认证使用 AWS 原生方式，不使用 ChatGPT 登录，也不使用 `OPENAI_API_KEY`。
- 使用前需要确认账号有 Bedrock 中对应 OpenAI 模型的访问权限，所选 AWS Region 支持对应模型，并且 AWS 身份已经配置好。
- 配置时在 Codex 配置文件中设置模型提供方为 `amazon-bedrock`。模型可以显式指定，也可以根据环境使用默认配置。
- Bedrock 认证优先检查 Bedrock API key，然后检查 AWS SDK credential chain。
- AWS SDK credential chain 可以来自共享配置文件、环境变量、控制台凭证、AWS SSO profile 或企业自定义 federation。
- 桌面 App 和 IDE 扩展不一定继承 shell 环境变量，必要时可以把所需值放入 Codex 的环境配置文件，并重启应用。
- 验证时应检查 `/status` 中的模型提供方，确认所选模型在 Region 可用，并确认 AWS 身份有访问权限。
- Bedrock 配置支持本地 Codex 工作流；依赖 OpenAI 托管云服务、托管工具或云端发现能力的部分功能可能不可用。

## 实践补充

Bedrock 路线适合已经把模型访问、审计、区域和 IAM 管理放在 AWS 里的企业。它不是普通个人用户的默认入门路线，也不一定覆盖所有 Codex 云端体验。

在团队内推广时，要把“Codex 客户端在哪里运行”和“模型请求走哪个 provider”分开解释。Bedrock 改的是模型访问路径，不等于把 Codex App、CLI、权限、沙盒和本地文件访问全部交给 AWS。

## 推荐工作流

1. 先由云平台负责人确认 Region、模型、IAM 和费用归属。
2. 在一台测试机器上配置最小可用 Codex CLI。
3. 用 `/status` 和一个只读任务确认 provider 与模型生效。
4. 再扩展到 App、IDE 扩展和团队配置。
5. 把不可用功能、默认模型、Region 差异和排查步骤写入内部文档。

## 示例提示词

```text
请帮我设计 Codex 接入 Amazon Bedrock 的企业试点方案。要求覆盖 AWS 身份、Region、模型选择、本地配置、验证命令、不可用能力、回滚方式和团队 FAQ。
```

```text
请根据这份 Codex 配置和 AWS profile 设置，判断为什么 Codex 没有走 amazon-bedrock provider。请只读分析，不要修改任何凭证或系统配置。
```

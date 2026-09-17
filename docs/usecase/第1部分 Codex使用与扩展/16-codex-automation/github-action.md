---
displayed_sidebar: usecaseSidebar
sidebar_position: 5
---

# Codex GitHub Action

Codex GitHub Action 可以在 GitHub Actions 中运行 Codex，用于 PR 评审、CI 质量门禁、自动修复建议、发布准备和重复代码任务。

## 官方内容整理

- Codex GitHub Action 会安装 Codex CLI，在提供 API Key 时启动 Responses API proxy，并按 workflow 中的权限运行 `codex exec`。
- 它适合在 CI/CD 中自动生成 Codex 反馈，而不需要自己维护 CLI 安装和运行细节。
- 常见用途包括 PR 自动评审、质量检查、release prep、迁移任务和失败 CI 的修复建议。
- workflow 需要先 checkout 仓库，再调用 action。
- prompt 可以直接写在 workflow 里，也可以放在仓库中的 prompt 文件里。
- action inputs 可以配置 prompt、prompt-file、额外 codex 参数、模型、推理 effort、sandbox、输出文件、Codex 版本和 Codex home。
- `final-message` output 可以传给后续 job，例如把 Codex 结果评论到 PR。
- `output-file` 可以把最终消息保存为文件，便于上传 artifact 或后续处理。
- `safety-strategy` 默认会移除 sudo，降低 secrets 暴露风险。Windows runner 需要使用 unsafe。
- 可以用 unprivileged user 让 Codex 以低权限用户运行。
- `allow-users` 和 `allow-bots` 可以限制谁能触发 workflow。默认只有有写权限的用户能运行。
- 安全上应限制触发者，清理来自 PR、commit message 或 issue body 的 prompt 输入，保护 API Key，并让 Codex 尽量作为 job 的最后一步运行。

## 实践补充

最稳的设计是“双 job 模式”：第一个 job 只读权限运行 Codex，生成报告或 patch artifact；第二个 job 在更高权限环境中应用 patch、提交分支或打开 PR。这样 OpenAI API Key 和仓库写权限不会同时暴露给同一段不可信代码。

PR 评审 prompt 应要求 Codex 以代码 review 姿态输出问题，而不是泛泛总结。自动修复 prompt 则应限定最小修改、运行验证命令、不要重构无关文件。

## 推荐工作流

1. 从 PR review 开始试点，先只发表评论，不自动修改代码。
2. 把 prompt 存进 `.github/codex/prompts/`，像代码一样版本管理。
3. 为 action 设置最小 GitHub permissions 和合适的 safety strategy。
4. 需要生成 patch 时，把生成 patch 和打开 PR 拆成两个 job。
5. 保存 Codex 输出文件和关键日志，方便审计与 prompt 迭代。

## 示例提示词

```text
请为这个仓库生成一份 Codex GitHub Action PR review workflow。要求只读权限、使用 prompt-file、保存 final message，并把结果评论到 PR。请同时给出 prompt 文件内容。
```

```text
请设计一个 CI 失败后自动生成修复 PR 的 workflow。要求第一个 job 只有 contents: read，运行 Codex 生成 patch artifact；第二个 job 才有 contents: write 和 pull-requests: write，用来应用 patch 并创建 PR。
```

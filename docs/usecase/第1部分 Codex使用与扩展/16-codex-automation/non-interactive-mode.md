---
displayed_sidebar: usecaseSidebar
sidebar_position: 1
---

# Non-interactive mode 非交互模式

`codex exec` 让 Codex 在脚本、CI 和命令管道中运行。它适合可重复、可记录、可审查的自动化任务。

## 官方内容整理

- 非交互模式通过 `codex exec` 运行，不进入全屏 TUI。
- 可以直接传入提示词，也可以把 stdin 作为上下文传给 Codex。
- `--json` 会把 stdout 变成 JSON Lines 事件流，便于自动化系统捕获线程、turn、工具调用、文件修改和最终状态。
- 如果只需要最终消息，可以用输出文件参数保存最后一条回复。
- `--output-schema` 可以要求最终输出符合 JSON Schema，适合自动化下游继续消费。
- `codex exec` 默认复用 CLI 已保存的认证；在 CI 中也可以显式提供 API Key。
- GitHub Actions 场景优先使用 Codex GitHub Action，而不是自己在 workflow 里安装 CLI 和暴露 API Key。
- API Key 不应作为 job-level 环境变量暴露给同一 job 中的所有构建脚本、测试脚本和依赖生命周期钩子。
- 如果需要 ChatGPT 账号身份，可以在可信 runner 上使用高级认证缓存方案或 access token。
- 非交互会话可以通过 `resume` 继续，适合多阶段 pipeline。
- Codex 默认要求在 Git 仓库里运行，以降低破坏性变更风险；确有必要时可以显式跳过该检查。
- 常见自动化模式包括：CI 失败自动定位、生成补丁、总结日志、准备 PR 评论、结构化提取项目元数据。

## 实践补充

非交互模式最重要的是输出契约。人类聊天可以含糊，自动化不能含糊。提示词里要写清楚输入来源、允许动作、输出字段、失败状态和退出条件。

如果要让 Codex 生成补丁，建议把“生成补丁”和“打开 PR”拆成两个 job。前一个 job 只读或低权限运行 Codex 并上传 patch，后一个 job 再用仓库写权限应用 patch、提交分支和创建 PR。

## 推荐工作流

1. 先用交互模式把提示词跑通，再迁移到 `codex exec`。
2. 为自动化任务固定 sandbox、审批策略、模型和输出 schema。
3. 用 JSONL 事件流记录完整过程，用最终消息或结构化 JSON 作为下游输入。
4. 将读取日志、分析原因、生成补丁、开 PR 拆成权限更小的阶段。
5. 失败时保留 prompt、事件流、工作区 diff 和关键日志，方便复盘。

## 示例提示词

```text
请根据 stdin 中的测试日志，提取失败测试、最可能根因、建议修复文件、最小验证命令，并输出符合 schema 的 JSON。不要修改文件。
```

```text
请在当前仓库中复现 CI 失败，找出最小修复并修改代码。只改必要文件，运行相关测试，最后输出修改摘要、验证命令和残余风险。
```

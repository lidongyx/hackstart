---
displayed_sidebar: usecaseSidebar
sidebar_position: 6
---

# Worktrees 工作树

![Codex Worktree 模式](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-worktree-light.webp)

Worktree 让 Codex 在同一 Git 项目中并行处理多个独立任务，而不干扰你的 Local 工作区。

## 官方内容整理

- Worktree 让 Codex 在同一 Git 项目中并行处理多个独立任务，而不干扰你的 Local 工作区。
- 它基于 Git worktree：每个 worktree 有自己的文件副本，但共享 Git 元数据。
- 新线程可以选择 Worktree 模式，并选择基于哪个分支创建。默认情况下，Codex 管理的 worktree 通常处于 detached HEAD 状态。
- Handoff 可以把线程和代码在 Local 与 Worktree 之间移动。这个过程由 Codex 处理必要 Git 操作。
- 一个 Git 分支不能同时在多个 worktree 中 checkout；如果要本地检查同一分支，应该通过 Handoff 而不是手动抢占。

## 实践补充

- 探索性任务、并行修复和后台自动化优先用 Worktree。
- 需要用你常用 IDE 或本地开发服务器检查时，再 handoff 到 Local。
- 定期清理不用的 worktree，避免依赖和构建缓存占用磁盘。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请在 Worktree 中为当前项目尝试这个方案。不要影响 Local 工作区。完成后总结改动、验证方式、是否建议 handoff 到 Local，以及是否需要创建分支。
```


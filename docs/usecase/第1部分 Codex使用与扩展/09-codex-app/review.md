---
displayed_sidebar: usecaseSidebar
sidebar_position: 4
---

# Review 面板

![Codex Git 与 Review 工作流](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-git-commit-light.webp)

Review 面板用于理解 Codex 或你自己在 Git 仓库中的改动。它显示的是 Git 工作区状态，不只包含 Codex 本轮编辑。

## 官方内容整理

- Review 面板用于理解 Codex 或你自己在 Git 仓库中的改动。它显示的是 Git 工作区状态，不只包含 Codex 本轮编辑。
- 默认聚焦未提交改动，也可以查看分支相对基线的全部改动，或只看最近一轮 assistant 改动。
- 你可以在 diff 中给具体代码行留下行内评论，随后要求 Codex 按评论修复。
- 在 PR 分支上，如果 GitHub CLI 已安装并认证，Codex App 可以读取 PR 上下文和 review 评论，帮助你在同一线程里处理反馈。
- 使用 /review 运行代码审查时，结果也可以显示在 Review 面板里。

## 实践补充

- 在让 Codex 修复前，先区分哪些改动是 Codex 做的、哪些是你已有改动。
- 行内评论比“这里不对”更有效，应写清期望行为和限制范围。
- 处理完评论后再次运行测试和 review，不要只看模型回复。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请处理 Review 面板里的行内评论。只修改评论相关范围，不要重构无关代码。修复后运行相关测试，并逐条说明评论如何解决。
```


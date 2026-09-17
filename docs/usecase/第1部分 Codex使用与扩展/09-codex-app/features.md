---
displayed_sidebar: usecaseSidebar
sidebar_position: 2
---

# 核心功能

![Codex 多项目与多线程](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-multitask-light.webp)

Codex App 支持在一个窗口中跨项目处理任务。每个代码库都可以添加为项目；同一仓库中相互独立的应用，也建议拆成不同项目。

## 官方内容整理

- Codex App 支持在一个窗口中跨项目处理任务。每个代码库都可以添加为项目；同一仓库中相互独立的应用，也建议拆成不同项目。
- 线程可以选择 Local、Worktree 或 Cloud 模式。Local 直接在当前项目工作；Worktree 用 Git worktree 隔离改动；Cloud 在远程环境运行。
- App 内置 Git diff、行内评论、暂存、回退、提交、推送和创建 PR 等功能。
- 每个线程有集成终端，可用来运行测试、构建、Git 命令和开发服务器；Codex 也能读取终端输出辅助诊断。
- 内置浏览器、Computer Use、非代码产物预览、IDE 同步、线程自动化、MCP 支持和图片生成都是桌面端的重要能力。

## 实践补充

- 把常用命令配置成本地环境 Actions，可以减少重复输入。
- 前端任务用内置浏览器做视觉评论和验证；桌面 GUI 任务用 Computer Use。
- 长任务需要用 Review 面板和任务侧边栏持续检查产物。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请根据当前项目特点，为我设计 Codex App 工作流：项目如何拆分、哪些任务用 Worktree、哪些命令做成 Actions、什么时候用浏览器检查、什么时候用 Review 面板。
```


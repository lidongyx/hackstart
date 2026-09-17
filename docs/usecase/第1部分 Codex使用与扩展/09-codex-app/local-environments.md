---
displayed_sidebar: usecaseSidebar
sidebar_position: 7
---

# 本地环境

![Codex 集成终端](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-integrated-terminal-light.webp)

Local environments 用来为 worktree 配置 setup scripts，也可以把常用任务配置成 App 顶部的 Actions。

## 官方内容整理

- Local environments 用来为 worktree 配置 setup scripts，也可以把常用任务配置成 App 顶部的 Actions。
- Setup scripts 会在 Codex 创建新 worktree 时自动运行，用于安装依赖、构建、生成必要文件或准备环境。
- Actions 适合放启动开发服务器、运行测试、构建项目等常用命令，它们会在集成终端里运行。
- 配置保存在项目根目录的 .codex 文件夹中，可以提交到仓库与团队共享。
- 如果脚本存在平台差异，可以分别为 macOS、Windows 和 Linux 定义不同脚本。

## 实践补充

- 把“每次新建 worktree 都要手动做”的步骤放进 setup。
- 把 npm start、pnpm test、pnpm build 之类高频命令做成 Actions。
- 共享前删除本机私有路径和密钥。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请为当前项目设计 Local Environment。包括 worktree setup script、Run/Test/Build 三个 Actions、平台差异说明，以及失败时 Codex 应如何报告。
```


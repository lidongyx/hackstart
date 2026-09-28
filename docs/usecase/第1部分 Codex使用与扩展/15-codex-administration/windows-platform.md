---
displayed_sidebar: usecaseSidebar
sidebar_position: 10
---

# Windows platform Windows 平台

![Codex Windows 界面](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-windows-codex-windows-light.webp)

Codex 支持 Windows 原生 App、CLI、IDE 扩展和 WSL2 环境。Windows 团队需要特别关注终端、沙盒、路径、Computer Use 和远程控制差异。

## 官方内容整理

- Windows 可以使用原生 Codex App、CLI 和 IDE 扩展。
- Windows App 支持核心工作流，包括并行 agent 线程、worktrees、自动化、Git 功能、内置浏览器、artifact 预览等。
- Windows 上的 Computer Use 在前台运行，更适合专用机器或明确任务窗口，不适合和用户日常鼠标键盘操作抢占同一桌面。
- Windows host 可以被 Mac 或 ChatGPT 手机端远程控制；Windows 当前不能作为 Codex App 去控制另一台 Windows 电脑。
- CLI 可以在 PowerShell 中使用原生 Windows 沙盒，也可以在 WSL2 中使用 Linux 沙盒实现。
- WSL2 适合已有 Linux 工具链、包管理器和服务依赖的项目。
- 路径配置需要区分 Windows 原生路径、home-relative 路径、UNC 路径和 WSL 路径。
- 如果使用 shell、构建工具、Node、Python、Git 或 SSH，应该确认 Codex 启动环境能读到正确 PATH。
- 企业 managed configuration 也可以应用到 Windows 客户端，但部分沙盒细节会随原生 Windows、PowerShell、WSL2 而不同。

## 实践补充

Windows 用户最常遇到的问题是“同一台机器有两套开发环境”：PowerShell 原生环境和 WSL2 Linux 环境。Codex 进入哪个环境，决定了路径、命令、依赖、Git 配置和沙盒行为。

如果项目主要服务端或前端构建依赖 Linux 工具链，建议直接在 WSL2 项目目录里使用 Codex CLI 或让 Codex App 连接 WSL/SSH 环境。若项目是 .NET、Windows 桌面或需要操作原生应用，则使用 Windows 原生 App 更自然。

## 推荐工作流

1. 先确定项目运行在 PowerShell、WSL2，还是远程 Linux。
2. 在目标环境里确认 `git status`、依赖安装、测试命令和构建命令。
3. 对 Computer Use 任务使用专用桌面或明确窗口，避免干扰用户当前操作。
4. 对路径、环境变量和凭证分别写 Windows 与 WSL2 版本。
5. 团队文档中明确推荐入口：App、CLI、IDE 扩展或 WSL2。

## 示例提示词

```text
请帮我为 Windows 开发团队写一份 Codex 使用规范。覆盖 PowerShell、WSL2、路径写法、Git、Node/Python 依赖、Computer Use、远程控制和常见故障。
```

```text
请检查这个 Windows 项目的 Codex 运行环境。先只读确认当前 shell、工作目录、Git 状态、PATH、Node/Python/.NET 版本、测试命令和可能的路径兼容问题。
```

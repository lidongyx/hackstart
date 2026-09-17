---
displayed_sidebar: usecaseSidebar
sidebar_position: 12
---

# Windows 使用

![Codex Windows 界面](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-windows-codex-windows-light.webp)

Windows 版 Codex 可以使用 Windows-native agent，在 PowerShell 中运行命令，也可以切换到 WSL。

## 官方内容整理

- Windows 版 Codex 可以使用 Windows-native agent，在 PowerShell 中运行命令，也可以切换到 WSL。
- Windows 原生 sandbox 可在不依赖 WSL 或虚拟机的情况下提供权限边界。
- 常用开发工具包括 Git、Node.js、Python、.NET SDK 和 GitHub CLI。
- 如果 PowerShell 执行策略阻止 npm 或脚本运行，需要调整执行策略或使用合适终端。
- Windows App 与 WSL 中的 CLI 默认不共享同一个 Codex home，需要显式配置才会共享。

## 实践补充

- 先安装常用开发工具，再添加项目。
- 根据项目位置选择 Windows-native 或 WSL agent。
- 不要随意用管理员权限运行，除非任务确实需要。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请检查我的 Windows Codex 环境：Git、Node.js、Python、.NET SDK、GitHub CLI、PowerShell 执行策略、WSL 设置和默认终端。只输出检查清单和修复建议。
```


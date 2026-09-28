---
displayed_sidebar: usecaseSidebar
sidebar_position: 10
---

# Computer Use

![Computer Use 权限确认](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-computer-use-approval-light.webp)

Computer Use 让 Codex 看见并操作 macOS 或 Windows 图形界面。它适合命令行、文件和结构化插件无法覆盖的任务。

## 官方内容整理

- Computer Use 让 Codex 看见并操作 macOS 或 Windows 图形界面。它适合命令行、文件和结构化插件无法覆盖的任务。
- macOS 上需要屏幕录制和辅助功能权限；Windows 上 Codex 会操作当前前台桌面。
- 适合测试桌面 App、复现 GUI-only bug、操作浏览器、修改应用设置、检查没有插件的数据源。
- Codex 只应操作你允许的应用，并且可能在敏感或破坏性动作前请求确认。
- Computer Use 不能自动化终端 App 或 Codex 自身，也不能替你批准系统级安全权限。

## 实践补充

- 每次只给一个明确 App 或流程。
- 保持敏感应用关闭，遇到付款、账号、密钥、系统设置要人工在场。
- 如果 Codex 操作错误窗口，应立即停止。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请用 Computer Use 打开目标应用并复现这个 GUI bug。每一步说明你看到的界面、点击位置和实际结果。找到原因后只做最小修复，再用同样流程验证。
```


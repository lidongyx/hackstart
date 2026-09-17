---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 4
---

# Computer Use 插件

Computer Use 让 Codex 能操作本机桌面应用。它适合处理浏览器之外的 GUI 任务，例如打开 App、读窗口内容、点击按钮、输入文字。

## 适合场景

- 操作 macOS 桌面应用。
- 检查 Xcode、模拟器、系统设置、文件窗口。
- 使用没有 API 的内部工具。
- 完成需要视觉识别和点击的桌面流程。

## 为什么要谨慎

Computer Use 的能力很强，因为它看到的是你的真实桌面。使用前要明确允许操作哪些 App，哪些窗口不能碰。

## 典型提示词

```text
请使用 Computer Use 查看当前打开的 Xcode 项目，运行测试并告诉我失败信息。不要修改项目设置。
```

```text
请只读取当前 Finder 窗口里的文件名，整理成列表，不要移动或删除文件。
```

## 检查是否启用

```bash
codex plugin list | grep -i computer
```

如果插件列表里没有，但 Codex App 声称支持 Computer Use，可以检查 `~/.codex/config.toml` 里是否有：

```toml
[plugins."computer-use@openai-bundled"]
enabled = true
```

修改配置后重启 Codex。

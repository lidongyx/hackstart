---
displayed_sidebar: usecaseSidebar
sidebar_position: 3
---

# 设置面板

![Codex 设置中的主题选择](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-theme-selection-light.webp)

Codex App 的设置面板用于调整应用行为、文件打开方式、外部工具连接、外观、Git、浏览器、Computer Use、MCP 和个性化。

## 官方内容整理

- Codex App 的设置面板用于调整应用行为、文件打开方式、外部工具连接、外观、Git、浏览器、Computer Use、MCP 和个性化。
- General 中可以选择文件打开方式、命令输出展示、终端标签默认行为、多行提示词提交方式，以及线程运行时是否阻止电脑休眠。
- Profile 可查看活动洞察、token 使用、最长任务和个人资料；Keyboard Shortcuts 用于搜索和修改快捷键。
- Agent configuration 会继承 CLI 和 IDE Extension 的同一套配置；常见选项可在 App 内调整，高级选项仍可编辑 config.toml。
- Browser 设置可安装或启用 Browser 插件、配置 Chrome 扩展、管理允许和阻止的网站，并控制开发者模式。

## 实践补充

- 第一次安装后先检查默认编辑器、终端、模型、权限、浏览器和 MCP。
- 如果启用 Memory 或个性化指令，要确认它适合当前工作和隐私要求。
- 开发者模式能力很强，只建议在可信页面和明确调试任务中使用。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请帮我检查 Codex App 设置是否适合当前项目。重点看默认编辑器、终端、Agent 配置、浏览器、MCP、Computer Use、Git 和个性化设置。
```


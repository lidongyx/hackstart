---
displayed_sidebar: usecaseSidebar
sidebar_position: 11
---

# Appshots

![Codex 产物预览与上下文](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-artifact-viewer-light.webp)

Appshots 可以把当前最前方 App 窗口发送到 Codex 线程。它适合把你正在看的界面、错误、设计、邮件或设置面板作为上下文提供给 Codex。

## 官方内容整理

- Appshots 可以把当前最前方 App 窗口发送到 Codex 线程。它适合把你正在看的界面、错误、设计、邮件或设置面板作为上下文提供给 Codex。
- Appshot 捕获最前方窗口的图片，以及应用能提供的可访问文本。
- macOS Codex App 可使用 Appshots。默认会创建新线程；如果最近刚和某个线程交互，可能加入最近线程。
- 某些网页或文档可能只能提供可见截图，无法提供完整离屏文本；如果有对应插件，优先用插件读取完整内容。

## 实践补充

- 截图前确认窗口里没有不必要的敏感信息。
- Appshot 是上下文附件，不代表授权 Codex 操作应用。
- 如果需要 Codex 操作界面，应明确启用 Computer Use。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
我刚添加了一个 Appshot。请根据截图里的错误状态解释可能原因，列出需要检查的文件或设置。先不要修改代码，等我确认方向。
```


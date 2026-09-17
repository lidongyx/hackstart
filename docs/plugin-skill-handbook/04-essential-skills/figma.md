---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 7
---

# figma

`figma` skill 用来通过 Figma MCP 获取设计上下文、截图、变量和资源。它是 Figma 到代码工作流的基础入口。

## 适合场景

- 读取 Figma URL 或 node。
- 获取设计结构和截图。
- 下载实现所需资源。
- 排查 Figma MCP 配置。

## 典型提示词

```text
$figma
请读取这个 Figma node 的设计 token、文本和截图，告诉我实现时需要注意哪些细节。
```

## 实践建议

给具体 node，不要只给整个 Figma 文件。范围越小，Codex 越容易准确实现。

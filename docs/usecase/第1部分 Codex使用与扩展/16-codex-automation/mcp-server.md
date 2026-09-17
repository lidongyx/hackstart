---
displayed_sidebar: usecaseSidebar
sidebar_position: 4
---

# MCP Server

Codex 可以作为 MCP server 被其他 MCP client 调用，也可以在 Agents SDK 工作流中作为一个可编排的代码执行与修改能力。

## 官方内容整理

- 启动 Codex MCP server 后，外部 MCP client 可以调用 Codex 来开始或继续一个 Codex 会话。
- MCP server 暴露的核心工具包括开始 Codex session 的工具，以及继续既有 thread 的工具。
- 启动新会话时可以传入 prompt、approval policy、sandbox、cwd、model、profile、base instructions、配置覆盖和是否包含 plan tool。
- 继续会话时需要 thread ID 和下一条 prompt。
- 工具调用结果会返回 thread ID，后续调用可以用它继续同一条 Codex 线程。
- 可以把 Codex MCP server 接入 OpenAI Agents SDK，让其他 agent 把具体代码实现工作交给 Codex。
- 在多 agent 工作流中，可以让一个 agent 写需求或设计 brief，另一个 agent 通过 Codex MCP 实现代码。
- MCP server 保持 Codex 作为一个可调用工具，而不是把所有工作都塞进一个模型 prompt。

## 实践补充

Codex MCP server 适合构建“外层有编排，内层由 Codex 改代码”的系统。外层 agent 负责需求拆解、流程控制、质量门禁和跨工具协调；Codex 负责进入仓库、读代码、改文件、跑命令和产出 diff。

这类集成要特别注意 thread ID 管理。一次任务最好对应一个明确 thread，后续修复、评审和继续执行都用同一个 thread，避免上下文散落。

## 推荐工作流

1. 用 MCP Inspector 或最小 client 验证 Codex MCP server 能启动。
2. 先做单 agent 工作流：输入需求，Codex 实现，外层收集结果。
3. 再增加需求分析、评审、测试和发布等多个 agent。
4. 把 thread ID、工作目录、权限、模型和输出结果记录下来。
5. 对多 agent handoff 设计清晰的输入输出契约，避免重复修改同一文件。

## 示例提示词

```text
请设计一个 Agents SDK + Codex MCP 的代码交付工作流。包含需求分析 agent、实现 agent、测试 agent、评审 agent，以及它们之间传递的字段、thread ID 管理和失败回退。
```

```text
请把这个浏览器小游戏需求拆成两个 agent：Game Designer 输出三句话设计 brief，Game Developer 通过 Codex MCP 在当前目录生成 index.html，并用 workspace-write 和 never approval 运行。
```

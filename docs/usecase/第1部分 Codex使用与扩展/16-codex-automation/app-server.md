---
displayed_sidebar: usecaseSidebar
sidebar_position: 3
---

# Codex App Server

Codex App Server 是 Codex 用来支撑富客户端的接口。它适合做深度产品集成：认证、对话历史、审批和 streamed agent events 都可以通过它进入自己的应用。

## 官方内容整理

- App Server 是 Codex 富客户端使用的底层接口，例如 IDE 扩展这类深度集成。
- 如果只是自动化作业或 CI 任务，优先使用 Codex SDK 或非交互模式。
- App Server 使用 JSON-RPC 风格消息，支持 stdio、WebSocket、Unix socket 和关闭本地 transport。
- WebSocket transport 处于实验状态。localhost 或 SSH port forwarding 适合本地工作流，不应直接暴露在共享或公网环境。
- WebSocket 模式支持健康检查接口，也支持基于 capability token 或 signed bearer token 的认证。
- 不应把原始 bearer token 放在命令行参数里；更适合放在文件或独立 secret store 中。
- App Server 的基本对象包括 Thread、Turn 和 Item。
- 客户端连接后必须先发送 initialize，再发送 initialized，然后才能调用其他方法。
- 可以新建线程、恢复线程、fork 线程、开始 turn、向活跃 turn 追加输入、流式接收事件，并在完成时收到最终状态。
- App Server 可以按当前 Codex 版本生成 TypeScript schema 或 JSON Schema，便于客户端类型约束。
- 部分方法和字段需要通过 experimentalApi capability 显式启用。

## 实践补充

App Server 是“做 Codex 客户端”的接口，不是普通自动化的第一选择。只有当你需要自己实现类似 IDE 扩展、内部工作台、企业任务面板、审批控制台时，它才比 SDK 或 CLI 更合适。

开发 App Server 客户端时，最容易忽视的是连接生命周期和事件背压。客户端要能处理初始化失败、重复初始化、事件流中断、server overloaded、用户取消和长任务恢复。

## 推荐工作流

1. 先确认是否真的需要 App Server；简单自动化优先 SDK 或 `codex exec`。
2. 选择 transport：stdio 用于本地子进程，Unix socket 用于本机服务，WebSocket 仅用于受控实验。
3. 实现 initialize handshake、事件循环、错误处理和超时。
4. 把 thread、turn、item 映射到自己的数据库或前端状态。
5. 为审批、取消、恢复、归档、日志和 schema 版本建立兼容策略。

## 示例提示词

```text
请帮我设计一个 Codex App Server 客户端架构。前端需要展示线程、turn、工具调用、diff、审批请求和最终状态；后端需要管理 transport、认证、事件流、重试和 schema 版本。
```

```text
请审查这个 App Server 集成设计是否适合生产使用。重点检查 WebSocket 暴露、认证 token、initialize 流程、事件背压、错误重试和实验 API 使用。
```

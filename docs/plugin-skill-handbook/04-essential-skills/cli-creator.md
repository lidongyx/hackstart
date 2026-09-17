---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 8
---

# cli-creator

`cli-creator` 用来把 API、后台、脚本或网页操作封装成可复用命令行工具。它适合高级一点的 Codex 用户，因为 CLI 一旦做好，以后每个线程都能直接调用。

## 什么时候用

- 你经常让 Codex 调同一个 API。
- 某个后台没有好用的 SDK。
- 你反复复制 curl 命令。
- 你想给 Codex 一个稳定、可测试、返回 JSON 的工具。

## 典型提示词

```text
$cli-creator
请根据这个 OpenAPI 文档创建一个 hackstart-admin CLI，支持 list-users、get-usage、disable-key，输出稳定 JSON。
```

## 好 CLI 的标准

- 可以从任何仓库运行。
- 命令名短。
- 输出 JSON 稳定。
- 错误码清楚。
- 认证方式安全，不把 token 写进代码。
- 有 `--help` 和最小测试。

## CLI 与 Skill 的组合

最强的组合通常是：

- CLI 负责可靠执行。
- Skill 负责判断什么时候用、怎么解释结果、怎么验证。
- Plugin 负责把 CLI 说明、skill 和安装信息分发出去。

---
displayed_sidebar: usecaseSidebar
sidebar_position: 3
---

# Agent approvals & security 审批与安全

![Computer Use 权限确认](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-computer-use-approval-light.webp)

Codex 的安全模型由沙盒、审批策略、网络访问控制和自动审批审查共同组成。核心思想是：让低风险动作在边界内自动完成，让越界动作停下来等待确认或审查。

## 官方内容整理

- Codex 默认关闭 agent 的命令网络访问。本地运行时，Codex 会使用操作系统级沙盒限制文件和命令能触达的范围。
- 沙盒模式决定 Codex 技术上能做什么，例如能写哪些目录、能否访问网络、能否越过工作区。
- 审批策略决定 Codex 什么时候必须暂停并询问，例如访问沙盒外路径、执行需要网络的命令，或调用带副作用的工具。
- Codex Cloud 在隔离容器中运行，不接触用户主机系统。Cloud 环境有 setup 和 agent 两个阶段：setup 可以安装依赖，agent 阶段默认离线，除非管理员或环境配置允许访问互联网。
- CLI、IDE 扩展和桌面 App 使用本机 OS 机制执行沙盒策略。默认常见组合是 workspace write 加 on-request 审批。
- `read-only` 适合只读分析；`workspace-write` 适合在项目内编辑和运行常规命令；`danger-full-access` 会移除主要边界，应只在非常明确的场景使用。
- 网络访问可以先整体开启，再通过网络代理策略按域名、私有网络、Unix socket 等维度收紧。
- Web search 与命令网络访问不是同一个控制面。Web search 可以使用缓存模式、禁用模式或 live 模式。
- 自动审批审查可以把原本给用户看的审批请求交给 reviewer agent。它不会扩大沙盒，只是在已有审批点上帮助判断是否允许。
- 自动审查关注数据外泄、凭证探测、持久化安全弱化和破坏性动作。高风险请求需要足够授权，关键风险会被拒绝。
- 企业可以用 managed configuration 约束审批策略、沙盒模式、权限 profile、网络访问、功能开关和自动审查策略。

## 实践补充

安全配置不应该只追求“最严格”，而要和工作流匹配。只读审计、代码评审、文档整理、自动修复、部署发布需要的权限不同，最好的方式是按场景建立几个固定 profile，让团队成员不用每次重新判断。

对于中文团队推广 Codex，建议把“Codex 能不能自己运行命令”和“Codex 什么时候要问我”分开解释。前者是沙盒，后者是审批；两个概念一旦混在一起，用户会误以为只要开启审批就等于安全。

## 推荐工作流

1. 给常见任务定义权限档位：只读分析、项目内编辑、需要网络、发布部署。
2. 对每个档位写明默认沙盒、审批策略、网络策略和人工确认点。
3. 给 CI、远程主机和本地桌面分别建立配置，不要把本地临时 full access 习惯带进自动化。
4. 将敏感目录、环境文件、密钥目录和生产凭证路径加入 deny-read 或受控 profile。
5. 对带副作用的 app、MCP、浏览器和桌面操作，要求 Codex 先说明动作、目标对象和回滚方式。

## 示例提示词

```text
请根据这个仓库的开发流程，帮我设计三套 Codex 权限 profile：只读审计、日常开发、CI 自动修复。每套说明适合场景、沙盒模式、审批策略、网络访问、禁止路径和典型命令。
```

```text
请审查当前 Codex 配置是否过度授权。重点检查 sandbox、approval policy、network proxy、writable roots、MCP server、Computer Use 和浏览器功能开关。
```

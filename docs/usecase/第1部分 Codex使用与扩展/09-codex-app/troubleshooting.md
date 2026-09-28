---
displayed_sidebar: usecaseSidebar
sidebar_position: 13
---

# 故障排查

![用终端排查 Codex 任务](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-app-integrated-terminal-light.webp)

Codex 故障通常来自配置、权限、sandbox、工具链、网络、插件授权、项目状态或外部服务。

## 官方内容整理

- Codex 故障通常来自配置、权限、sandbox、工具链、网络、插件授权、项目状态或外部服务。
- 排查时应先确认问题发生在哪个表面：App、CLI、IDE、浏览器、Computer Use、MCP、插件还是模型请求。
- 命令失败要看集成终端输出、当前目录、PATH、环境变量和依赖安装。
- 权限问题要区分 Codex approval、sandbox、系统隐私权限和外部账号授权。
- 配置问题要检查用户 config.toml、项目 .codex、profile、CLI override 和管理策略。

## 实践补充

- 一次只改变一个变量，避免无法归因。
- 不要第一反应用 danger-full-access 解决所有问题。
- 排查时不要粘贴密钥、token 或 SSH key。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请帮我排查这个 Codex 问题。先不要修改配置。请根据错误信息判断它属于权限、sandbox、网络、插件、模型、工具链还是项目状态问题，并给出最小验证步骤。
```


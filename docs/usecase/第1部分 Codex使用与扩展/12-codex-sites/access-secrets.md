---
displayed_sidebar: usecaseSidebar
sidebar_position: 3
---

# 访问控制与密钥

![Sites 访问与项目管理](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-sites-sites-list-light.jpg)

新站点默认应保持较小访问范围，通常先限 owner 和 workspace admins。

## 官方内容整理

- 新站点默认应保持较小访问范围，通常先限 owner 和 workspace admins。
- 可设置为全 workspace 或自定义用户与用户组。
- 运行时环境变量和 secrets 应在 Sites 面板配置，不应写进源码或 hosting 配置文件。
- 更新环境值后，需要重新部署批准版本，才能让部署使用新配置。

## 实践补充

- 分享 URL 前检查访问范围。
- 源码里只保留 .env.example 的 key 名，不保留真实值。
- 对内部站点，先确认哪些用户组真的需要访问。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请检查这个 Sites 项目的发布安全性。确认访问范围、环境变量、源码里是否有密钥、是否需要重新部署，以及分享 URL 前还要做哪些检查。
```


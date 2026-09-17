---
displayed_sidebar: usecaseSidebar
sidebar_position: 3
---

# 构建自己的插件

![插件调用示意](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-plugins-plugin-github-invoke.png)

当团队有重复工作流、内部工具或私有 MCP 时，可以构建插件进行安装和分享。

## 官方内容整理

- 当团队有重复工作流、内部工具或私有 MCP 时，可以构建插件进行安装和分享。
- 插件需要清晰 manifest，描述名称、版本、技能、MCP、应用和元数据。
- 技能适合写可复用工作方法；MCP 适合提供工具和私有数据；App 适合连接外部服务。
- 插件可以通过 marketplace source 分发给个人、项目或团队。

## 实践补充

- 先确认这个能力是否值得插件化，而不是只需要一个脚本或 skill。
- 插件不要内置密钥。
- 发布前测试安装、启用、调用、禁用和升级。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请帮我设计一个团队质量检查插件。输出插件结构、包含的 skills、是否需要 MCP、manifest 字段、安装测试步骤和安全边界。
```


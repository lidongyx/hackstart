---
displayed_sidebar: usecaseSidebar
sidebar_position: 4
---

# 环境变量

Codex 持久设置优先用 config.toml；环境变量适合 shell 级覆盖、自动化密钥、安装脚本和诊断。

## 官方内容整理

- Codex 持久设置优先用 config.toml；环境变量适合 shell 级覆盖、自动化密钥、安装脚本和诊断。
- CODEX_HOME 控制 Codex 状态根目录，包括配置、认证、日志、会话、技能和包元数据。
- CODEX_API_KEY 适合单次 codex exec；CODEX_ACCESS_TOKEN 适合受信任自动化和登录流程。
- CODEX_CA_CERTIFICATE 和 SSL_CERT_FILE 可处理企业 TLS 拦截或私有根证书。
- RUST_LOG 和 log_dir 可用于诊断。

## 实践补充

- 临时 key 尽量 inline 到单个命令，不要 job-wide 暴露给不可信仓库代码。
- provider API key 推荐通过 env_key 指向你自定义的环境变量名。
- 诊断完成后清理临时环境变量。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请帮我梳理当前任务需要哪些 Codex 环境变量。区分必须、可选、诊断用和不应该设置的变量，并说明应该在哪个 shell 或自动化中设置。
```


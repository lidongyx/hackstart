---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 12
---

# cloudflare-deploy

`cloudflare-deploy` 用于 Cloudflare Workers、Pages 和相关平台服务部署。

## 适合场景

- 部署 Worker。
- 部署 Pages。
- 检查 `wrangler` 配置。
- 分析路由、环境变量和构建设置。

## 典型提示词

```text
$cloudflare-deploy
请检查这个 Worker 项目的 wrangler 配置，说明部署前需要确认的账号、路由和环境变量。
```

## 风险边界

DNS、SSL/TLS、WAF、Workers 路由等线上入口配置不要让 Codex 擅自修改。生产动作前先列计划。

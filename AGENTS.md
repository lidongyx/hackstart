# HackStart 前端

- 当前目录为完整 Docusaurus 网站，远程仓库 `lidongyx/hackstart`，默认分支 `master`。
- 使用 pnpm，开发端口 `3010`，构建输出 `build/`，目标为 Amplify 的 `i.hackstart.org`。
- 原站 `/Users/lidong/Documents/sub2api/hackstart-docs` 仅作迁移基线；未经用户单独要求不得修改、精简或部署原站。
- 所有资源、社区、会员、课程和个人资料接口使用 Hackadmin。统一登录、令牌刷新、资料同步、API 控制台使用 Sub2API。
- 不迁入 Sub2API 控制台、凭据、服务器部署脚本、Git 元数据、生成缓存或依赖目录。
- 本次迁移阶段不部署、不更改 DNS、Amplify 或线上后端配置。
- 改动后运行 `pnpm typecheck`、`pnpm test`、`pnpm build`；交互测试使用模拟接口，不能创建真实支付订单或发布测试帖子。
- 当前 CourseAccessGate 只隐藏浏览器内容；会员正文仍在静态 JS。正文移出公开构建并由服务端鉴权前，不得宣称已实现安全会员阅读。
- Hackadmin 部署目标限制遵循父目录 AGENTS.md，绝不可发送至 Sub2API 服务器。

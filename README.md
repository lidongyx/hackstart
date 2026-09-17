# HackStart

完整的 Docusaurus 3 前端，目标域名为 `https://i.hackstart.org`，使用 AWS Amplify Hosting。
从 `/Users/lidong/Documents/sub2api/hackstart-docs` 的 `a45efb9` 迁入全部文档、资源、社区、会员、下载与主题交互。
原仓库保持不变；不包含 Sub2API 的 API 控制台实现。

## 开发与检查

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

本地地址为 `http://127.0.0.1:3010/`，避开旧站的 `3007`。构建产物是 `build/`，不再是 Vite 的 `dist/`。

## 内容与接口

- 文档位于 `docs/`，包括接入教程、Codex 案例、插件与技能小册、CodexStart。
- `/` 为资源库，`/resources/detail/` 展示案例、技能及媒体详情。
- `/community/`、`/community/post/`、`/community/mine/` 保留帖子、回复、编辑、图片上传及个人内容。
- `/membership/` 提供会员购买、续费、二维码、订单和支付轮询。
- `/account/` 为会员概览，`/profile/` 支持资料和头像更新。
- 资源、课程、会员、社区与资料由 Hackadmin 提供；登录、刷新令牌、资料同步与 API 控制台由 Sub2API 提供。
- 软件镜像仍读取 `downloads.hackstart.org`，同步服务不迁入此项目。

登录跳转到 `https://hackstart.org/login`，携带新站返回地址。返回 fragment 中的 token 被消费并移除，支持刷新令牌。
各站 localStorage 不共享，不能仅凭旧站已登录推断新站也已登录。

## Amplify

`amplify.yml` 使用固定版本 pnpm、锁文件安装，并发布 `build/`。不要添加把所有路径重写到首页的 Vite SPA 规则。
在 Amplify 配置 `SITE_URL=https://i.hackstart.org`；可覆盖的公开接口地址见 `docusaurus.config.ts` 与 `.env.example`。
配置通过构建进程环境变量读取，不会自动加载 Vite 的 `.env`。旧的 `VITE_*` 配置不再生效。
Hackadmin/Sub2API 需放行新站 CORS；Sub2API 登录 redirect 白名单和支付返回地址需与新域名一致。
本次迁移不修改 Amplify、DNS、后端配置或部署。

## 会员正文安全

**当前继承旧站的浏览器权限门，不是安全的正文保护方案。** Markdown/MDX 正文仍会进入公开静态 JS。
不能仅凭页面要求登录就发布需要保密的会员正文。

正式发布付费内容前，必须将会员正文移出公开构建产物，改为 Hackadmin 在服务端校验会员后返回正文；
目录和课程介绍可以继续静态发布。还应保护正文中的私有附件，校验过期会员、匿名请求和直接资源请求。
新增课程目录会自动生成 sidebar 和课程清单，但仍需在 Hackadmin 上架、同步清单并配置访问模式。

迁移清单与验收状态见 `migration/README.md`。本地 mock 交互通过不等同于线上支付、登录或安全验收通过。

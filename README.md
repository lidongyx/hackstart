# HackStart 会员中心

`i.hackstart.org` 的独立会员网站，部署在 AWS Amplify，后端使用
`hackadmin.hackweek.org`。这个项目与 `sub2api`、`hackstart-docs` 分开维护。

## 本地开发

```bash
npm install
npm run dev
```

默认地址：`http://127.0.0.1:3010/`

## 认证设计

- 登录入口仍使用 `https://hackstart.org/login`，通过 `redirect` 参数回到本站。
- 登录结果中的 `auth_token` 位于 URL fragment，本站消费后只保存到自己的
  `localStorage`，不会通过 URL 请求发送给服务器。
- 会员资料请求带同一个 Sub2API Bearer token，先访问 Hackadmin，再同步昵称和
  头像 URL 到 Sub2API。
- 生产环境必须在 Hackadmin 和 Sub2API 的 CORS 配置中放行
  `https://i.hackstart.org`。

## 构建

```bash
npm run typecheck
npm run build
```

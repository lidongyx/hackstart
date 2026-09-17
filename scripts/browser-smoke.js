async (page) => {
  const base = 'http://127.0.0.1:3010';
  const checks = [];
  const errors = [];
  const unexpected = [];
  await page.unrouteAll({behavior: 'ignoreErrors'});
  page.removeAllListeners('pageerror');
  page.on('pageerror', error => errors.push(error.message));
  const assert = (condition, message) => {if (!condition) throw new Error(message);};
  const visible = async text => {await page.getByText(text, {exact: false}).first().waitFor({state: 'visible'});};
  const visit = async path => {await page.goto(`${base}${path}`);};
  let member = false;
  let profile = {id: 5, email: 'mock@example.test', nickname: '测试会员', username: '测试会员', role: 'student', city: '上海', github_username: '', website_url: '', avatar_url: ''};
  const courses = [
    {code: 'integration', title: '接入教程', docs_path: 'integration', access_mode: 'public', position: 1, published: true},
    {code: 'usecase', title: 'Codex案例', docs_path: 'usecase', access_mode: 'public', position: 2, published: true},
    {code: 'plugin-skill-handbook', title: '插件与技能小册', docs_path: 'plugin-skill-handbook', access_mode: 'public', position: 3, published: true},
    {code: 'codexstart', title: 'CodexStart 零基础课程', docs_path: 'codexstart', access_mode: 'member', position: 4, published: true},
  ];
  const topic = {id: 1, name: '实践交流', slug: 'practice', description: '实践', color: '#0d6b61', post_count: 1};
  let post = {id: 1, title: '模拟社区讨论', content: '## 模拟正文\n\n这里是讨论内容。', status: 'published', pinned: false, view_count: 5, comment_count: 0, created_at: '2026-09-17T00:00:00Z', updated_at: '2026-09-17T00:00:00Z', author: profile, topic, comments: [], can_edit: true};
  let orders = [];
  let polling = 0;
  let uploads = 0;
  const resource = {id: 7, category: 'modeling', title: '模拟案例', summary: '模拟案例摘要', body: '## 模拟案例正文\n\n完整详情', tags: ['实践'], image_url: `${base}/img/hackstart.jpeg`, author_name: 'HackStart', source_platform: 'website'};
  const skill = {id: 8, full_name: 'demo/skill', owner_login: 'demo', description_zh: '模拟技能简介', readme_zh: '# 技能说明\n\n这是中文 README。', stars: 100, forks: 10, category_key: 'coding', category_name: '编程', avatar_url: `${base}/img/hackstart.jpeg`};
  const handle = async route => {
    const request = route.request();
    // The CLI sandbox has no URL constructor; all mocked endpoints have fixed paths.
    const path = request.url().replace(/^https:\/\/[^/]+/, '').split('?')[0];
    const query = decodeURIComponent(request.url().split('?')[1] || '');
    const method = request.method();
    let body; let status = 200;
    const payload = () => request.postDataJSON();
    if (path === '/api/v1/auth/me') body = {data: profile};
    else if (path === '/api/me' && method === 'GET') body = profile;
    else if (path === '/api/me' && method === 'PATCH') {profile = {...profile, ...payload()}; body = profile;}
    else if (path === '/api/me/avatar') {uploads++; profile = {...profile, avatar_url: `${base}/img/hackstart.jpeg`}; body = profile;}
    else if (path === '/api/v1/user') body = {data: profile};
    else if (path.endsWith('/auth/logout')) body = {};
    else if (path === '/api/hackstart/courses') body = {items: courses};
    else if (path.startsWith('/api/hackstart/course-access/')) body = {allowed: member, reason: member ? '' : 'membership_required'};
    else if (path === '/api/hackstart/membership/orders') {
      orders = [{id: 1, trade_order_id: 'MOCK-ONLY', title: '年度会员', amount_cents: 6800, status: 'pending', provider: 'mock', url_qrcode: `${base}/img/hackstart.jpeg`, created_at: '2026-09-17T00:00:00Z'}];
      body = {order: orders[0], url_qrcode: orders[0].url_qrcode};
    } else if (path === '/api/hackstart/membership') {
      if (orders.length && ++polling >= 3) {member = true; orders[0].status = 'paid';}
      body = {product: {code: 'annual', title: '年度会员', amount_cents: 6800, duration_days: 365}, membership: {active: member, member, purchase_count: member ? 1 : 0, started_at: null, expires_at: member ? '2027-09-17T00:00:00Z' : null}, orders, provider_enabled: true};
    } else if (path === '/api/resources') body = {items: query.includes('search=不存在') ? [] : [resource], total: 1, page: 1, pages: 1};
    else if (path === '/api/resources/7') body = resource;
    else if (path === '/api/hackstart/skills') body = {items: [skill], categories: [{category_key: 'coding', category_name: '编程', count: 1}], total: 1, page: 1, pages: 1};
    else if (path === '/api/hackstart/skills/8') body = skill;
    else if (path === '/api/community/topics') body = {items: [topic]};
    else if (path === '/api/community/posts' && method === 'GET') body = {items: [post], pagination: {page: 1, pages: 1, total: 1}};
    else if (path === '/api/community/posts' && method === 'POST') {post = {...post, ...payload()}; body = post;}
    else if (path === '/api/community/posts/1/comments') {post.comments.push({id: 1, ...payload(), created_at: post.created_at, author: profile}); post.comment_count++; body = post.comments[0];}
    else if (path === '/api/community/posts/1' && method === 'PATCH') {post = {...post, ...payload()}; body = post;}
    else if (path === '/api/community/posts/1') body = post;
    else if (path === '/api/community/mine/posts') body = {items: [post], pagination: {page: 1, pages: 1, total: 1}};
    else if (path === '/api/community/mine/comments') body = {items: post.comments.map(comment => ({...comment, post: {id: 1, title: post.title}})), pagination: {page: 1, pages: 1, total: 1}};
    else if (path === '/api/community/media') {uploads++; body = {url: `${base}/img/hackstart.jpeg`};}
    else {unexpected.push(`${method} ${path}`); body = {message: 'Unmocked API'}; status = 501;}
    await route.fulfill({status, contentType: 'application/json', body: JSON.stringify(body), headers: {'access-control-allow-origin': '*'}});
  };
  await page.route('https://hackadmin.hackweek.org/**', handle);
  await page.route('https://hackstart.org/api/v1/**', handle);
  await page.route('https://downloads.hackstart.org/downloads/manifest.json', route => route.fulfill({contentType: 'application/json', body: JSON.stringify({apps: [{id: 'codex', name: 'Codex', officialPage: 'https://example.test', items: [{id: 'mac', system: 'macOS', chip: 'Apple', arch: 'arm64', fileName: 'Codex.dmg', sourceUrl: 'https://example.test/Codex.dmg', downloadUrl: 'https://example.test/mirror.dmg', mirrored: true}]}]})}));
  await page.setViewportSize({width: 1440, height: 1000});
  await visit('/'); await page.evaluate(() => localStorage.clear()); await page.reload(); await visible('模拟案例');
  await page.screenshot({path: 'output/playwright/home-desktop.png', fullPage: true});
  await page.getByRole('button', {name: '切换暗色主题'}).click();
  assert(await page.locator('html').getAttribute('data-theme') === 'dark', 'Theme switch failed');
  await page.getByRole('button', {name: '切换亮色主题'}).click();
  await page.getByRole('link', {name: /模拟案例/}).click(); await visible('模拟案例正文'); checks.push('案例详情/主题');
  await visit('/?category=skills'); await visible('demo/skill'); await page.getByRole('link', {name: /demo\/skill/}).click(); await visible('技能说明'); checks.push('技能分类/中文 README');
  await visit('/docs/integration/codex-desktop/download/'); await visible('Codex.dmg'); checks.push('公开文档/下载清单');
  await visit('/docs/codexstart/intro/'); await visible('CodexStart 零基础课程');
  const chapter = await page.locator('a[href^="/docs/codexstart/"]').filter({hasText: 'Codex 到底是什么'}).first().getAttribute('href');
  assert(chapter, 'Course chapter missing');
  await visit(chapter); await visible('本课程仅限会员阅读');
  const login = await page.getByRole('link', {name: '登录后继续'}).getAttribute('href');
  const redirect = await page.evaluate(raw => new URL(raw).searchParams.get('redirect'), login);
  assert(redirect.startsWith(base), 'Login return points at old site'); checks.push('匿名会员门禁/深链接回跳');
  await visit('/account/#auth_token=mock-token&refresh_token=mock-refresh&expires_in=3600'); await visible('尚未开通会员');
  assert(!page.url().includes('auth_token'), 'Fragment token remains');
  await visit(chapter); await visible('加入 HackStart 年度会员后'); checks.push('非会员门禁');
  await visit('/membership/'); await page.getByRole('button', {name: '开通年度会员'}).click(); await visible('扫码加入会员');
  await page.getByRole('button', {name: '刷新支付状态'}).click(); await visible('会员已生效'); checks.push('模拟订单/二维码/支付生效');
  await visit(chapter); await page.locator('article').first().waitFor();
  assert(await page.getByText('本课程仅限会员阅读', {exact: true}).count() === 0, 'Member still locked'); checks.push('有效会员阅读');
  await visit('/profile/'); await page.getByLabel('昵称', {exact: true}).fill('迁移测试会员'); await page.getByRole('button', {name: '保存资料'}).click(); await visible('资料已保存，并已同步');
  await page.locator('input[type="file"]').setInputFiles('/Users/lidong/Documents/hacklist/hackstart/static/img/hackstart.jpeg');
  await page.locator('img[alt="个人头像"]').waitFor({state: 'visible'});
  await page.screenshot({path: 'output/playwright/profile-desktop.png', fullPage: true}); checks.push('资料修改/头像上传/账号同步');
  await visit('/community/'); await visible('模拟社区讨论'); await page.getByRole('button', {name: '发起讨论'}).click();
  await page.getByPlaceholder('清晰描述你想讨论的问题').fill('迁移模拟帖子');
  await page.locator('#community-markdown-editor').fill('模拟 Markdown 正文');
  await page.locator('input[type="file"]').setInputFiles('/Users/lidong/Documents/hacklist/hackstart/static/img/hackstart.jpeg');
  await page.waitForFunction(() => document.getElementById('community-markdown-editor').value.includes('![图片]'));
  await page.getByRole('button', {name: '发布帖子', exact: true}).click(); await visible('迁移模拟帖子');
  await page.getByRole('link', {name: /迁移模拟帖子/}).click(); await visible('模拟 Markdown 正文');
  await page.getByRole('link', {name: '编辑帖子', exact: true}).click(); await visible('编辑帖子');
  await page.getByPlaceholder('清晰描述你想讨论的问题').fill('迁移模拟帖子已编辑');
  await page.getByRole('button', {name: '发布帖子', exact: true}).click();
  await page.getByRole('link', {name: /迁移模拟帖子已编辑/}).click(); await visible('模拟 Markdown 正文');
  await page.getByPlaceholder('写下你的回复').fill('迁移模拟回复'); await page.getByRole('button', {name: '发表评论'}).click(); await visible('迁移模拟回复');
  await page.getByRole('button', {name: '收藏', exact: true}).click();
  await visit('/community/mine/?tab=favorites'); await visible('迁移模拟帖子');
  await visit('/community/mine/?tab=comments'); await visible('迁移模拟回复'); checks.push('模拟发帖/编辑/图片上传/Markdown/回复/收藏/我的内容');
  for (const path of ['/', '/docs/codexstart/intro/', '/membership/', '/profile/', '/community/post/?id=1']) {
    await page.setViewportSize({width: 390, height: 844}); await visit(path);
    await page.getByRole('navigation', {name: '移动端底部导航'}).waitFor();
    await page.screenshot({path: `output/playwright/mobile-${path.split('/')[1] || 'home'}.png`, fullPage: true});
    const dimensions = await page.evaluate(() => ({width: window.innerWidth, scroll: document.documentElement.scrollWidth}));
    assert(dimensions.scroll <= dimensions.width + 1, `Horizontal overflow: ${path}`);
  }
  await page.getByRole('button', {name: '我的', exact: true}).click(); await page.getByRole('link', {name: '个人资料', exact: true}).click(); await visible('迁移测试会员'); checks.push('手机导航/五类页面无横向溢出');
  await page.getByRole('button', {name: '退出登录', exact: true}).click(); await visible('前往统一登录'); checks.push('退出登录');
  assert(uploads === 2, 'Avatar and community image uploads must both be mocked');
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`);
  assert(unexpected.length === 0, `Unexpected mock routes: ${unexpected.join('; ')}`);
  return {checks, errors, unexpected, uploads};
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const root = new URL('../', import.meta.url);
const adapted = new Set([
  'package.json', 'docusaurus.config.ts', 'sidebars.ts',
  'src/lib/sub2api-auth.ts', 'src/lib/courses.ts', 'src/lib/docLibrary.ts',
  'src/pages/index.tsx', 'src/pages/resources/detail/index.tsx', 'src/pages/membership/index.tsx',
  'src/pages/qrcode.tsx', 'src/lib/resources.ts',
  'src/lib/courses.ts',
  'src/pages/community/index.tsx', 'src/pages/community/post/index.tsx', 'src/pages/community/mine/index.tsx',
  'src/pages/workshop/index.tsx', 'src/pages/workshop/tasks.tsx', 'src/pages/workshop/results.tsx',
  'src/css/custom.css',
  'src/components/resources/ResourceSidebar.module.css',
  'src/theme/Navbar/index.tsx',
  'src/components/common/MobileBottomNav.tsx', 'src/components/resources/ResourceSidebar.tsx',
  'src/theme/Navbar/MobileSidebar/PrimaryMenu/index.tsx',
  'src/components/docs/CourseAccessGate.tsx',
  'src/theme/DocSidebar/Desktop/index.tsx',
  'src/theme/DocRoot/Layout/Main/styles.module.css',
  'src/components/courses/CourseSidebarMenu.module.css',
  'src/components/workshops/WorkshopShell.tsx',
  'src/components/workshops/styles.module.css',
  'src/components/workshops/workspace.module.css',
  'src/components/docs/DocLibraryIndex.tsx', 'src/theme/Root/index.tsx', 'src/theme/DocItem/Layout/index.tsx',
  'plugins/hackstart-courses-manifest/index.ts',
  'docs/codexstart/intro.md',
  'docs/index.mdx',
]);
const intentionallyRemovedPrefixes = [
  'docs/integration/',
  'docs/usecase/',
  'docs/plugin-skill-handbook/',
];

test('every original document, asset, page, theme and plugin is present', async () => {
  const inventory = JSON.parse(await readFile(new URL('migration/source-inventory.json', root), 'utf8'));
  assert.ok(Object.keys(inventory.files).length > 300);
  for (const [file, hash] of Object.entries(inventory.files)) {
    if (intentionallyRemovedPrefixes.some((prefix) => file.startsWith(prefix))) continue;
    const content = await readFile(new URL(file, root));
    if (!adapted.has(file)) assert.equal(createHash('sha256').update(content).digest('hex'), hash, file);
  }
});

test('Amplify uses the pnpm lockfile and Docusaurus build directory', async () => {
  const yaml = await readFile(new URL('amplify.yml', root), 'utf8');
  assert.match(yaml, /pnpm install --frozen-lockfile/);
  assert.match(yaml, /baseDirectory: build/);
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  assert.equal(pkg.dependencies['@docusaurus/core'], '3.10.1');
  assert.equal(pkg.scripts.build, 'docusaurus build');
  assert.equal(pkg.dependencies.vite, undefined);
});

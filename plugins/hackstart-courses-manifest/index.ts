import fs from 'node:fs/promises';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';

const publicCourseCodes = new Set([
  'integration',
  'usecase',
  'plugin-skill-handbook',
  'codex-knowledge-base',
  'codex-office',
  'codex-video-editing',
  'codex-image-generation',
  'codex-video-production',
  'codex-3d-modeling',
  'codex-game-development',
]);

function secureMemberDocRemarkPlugin() {
  return (tree: {children: Array<Record<string, unknown>>}, file: {path?: string; data?: {frontMatter?: {hide_title?: boolean}}}) => {
    const sourcePath = file.path || '';
    if (file.data?.frontMatter?.hide_title) return;
    if (sourcePath.endsWith(path.join('docs', 'index.mdx'))) return;
    const docsMarker = `${path.sep}docs${path.sep}`;
    const markerIndex = sourcePath.lastIndexOf(docsMarker);
    if (markerIndex < 0) return;
    const relative = path.relative(sourcePath.slice(0, markerIndex + docsMarker.length - 1), sourcePath);
    const parts = relative.split(path.sep);
    if (parts.length < 2) return;
    const courseCode = parts[0];
    // Workshop content is a separate, locally rendered practice library. It
    // must not be rewritten into the remote member-course content flow.
    if (publicCourseCodes.has(courseCode) || courseCode === 'workshops') return;

    const requestPath = parts.slice(1).join('/');
    if (requestPath === 'intro.md' || requestPath === 'intro.mdx' || requestPath === 'info.md' || requestPath === 'info.mdx') {
      tree.children = tree.children.filter((child) =>
        child.type === 'mdxjsEsm' && typeof child.value === 'string' && child.value.includes('DocLibraryIndex') ||
        child.type === 'mdxJsxFlowElement' && child.name === 'DocLibraryIndex',
      );
      return;
    }
    tree.children = [
      {
        type: 'mdxjsEsm',
        value: "import RemoteDocBody from '@site/src/components/docs/RemoteDocBody';",
      },
      {
        type: 'mdxJsxFlowElement',
        name: 'RemoteDocBody',
        attributes: [
          {type: 'mdxJsxAttribute', name: 'course', value: courseCode},
          {type: 'mdxJsxAttribute', name: 'path', value: requestPath},
        ],
        children: [],
      },
    ];
  };
}

type LoadedDoc = {
  id: string;
  title: string;
  description?: string;
  permalink: string;
  source: string;
  sidebarPosition?: number;
};

type CourseChapter = {
  title: string;
  path: string;
  position: number;
  section: string;
  section_key: string;
  section_position: number;
};

type CourseManifestRow = {
  code: string;
  docs_path: string;
  title: string;
  summary: string;
  access_mode: 'public' | 'member';
  position: number;
  chapters: CourseChapter[];
};

const defaultCourseAccessModes: Record<string, CourseManifestRow['access_mode']> = {
  integration: 'public',
  usecase: 'public',
  'plugin-skill-handbook': 'public',
  codexstart: 'member',
  'codex-knowledge-base': 'public',
  'codex-office': 'public',
  'codex-video-editing': 'public',
  'codex-image-generation': 'public',
  'codex-video-production': 'public',
  'codex-3d-modeling': 'public',
  'codex-game-development': 'public',
};

async function readCategory(siteDir: string, docsPath: string, category?: string) {
  const filename = category
    ? path.join(siteDir, 'docs', docsPath, category, '_category_.json')
    : path.join(siteDir, 'docs', docsPath, '_category_.json');
  try {
    const metadata = JSON.parse(await fs.readFile(filename, 'utf8')) as {
      label?: string;
      position?: number;
    };
    return {
      label: String(metadata.label || category || docsPath),
      position: Number(metadata.position) || 1,
    };
  } catch {
    return {label: category || docsPath, position: 1};
  }
}

export default function hackstartCoursesManifestPlugin(context: LoadContext): Plugin {
  let manifest: {courses: CourseManifestRow[]} = {courses: []};

  return {
    name: 'hackstart-courses-manifest',
    async allContentLoaded({allContent}) {
      const instances = allContent['docusaurus-plugin-content-docs'] as Record<string, {
        loadedVersions?: Array<{docs?: LoadedDoc[]}>;
      }> | undefined;
      const docs = Object.values(instances || {}).flatMap((instance) =>
        (instance.loadedVersions || []).flatMap((version) => version.docs || []),
      );
      const docsPaths = Array.from(new Set(docs.map((doc) =>
        doc.source.match(/^@site\/docs\/([^/]+)\//)?.[1],
      ).filter((value): value is string => Boolean(value) && value !== 'workshops')));

      const courses: CourseManifestRow[] = [];
      for (const docsPath of docsPaths) {
        const prefix = `@site/docs/${docsPath}/`;
        const courseDocs = docs.filter((doc) => doc.source.startsWith(prefix));
        const topCategory = await readCategory(context.siteDir, docsPath);
        const intro = courseDocs.find((doc) => doc.id === `${docsPath}/intro`);
        const categoryCache = new Map<string, {label: string; position: number}>();
        const chapters: CourseChapter[] = [];

        for (const [index, doc] of courseDocs.entries()) {
          const relativeSource = doc.source.slice(prefix.length);
          const parts = relativeSource.split('/');
          const nested = parts.length > 1;
          const category = nested ? parts[0] : undefined;
          if (category && !categoryCache.has(category)) {
            categoryCache.set(category, await readCategory(context.siteDir, docsPath, category));
          }
          const section = category ? categoryCache.get(category)! : {label: '课程内容', position: 1};
          chapters.push({
            title: doc.title,
            path: doc.permalink,
            position: Number(doc.sidebarPosition) || index + 1,
            section: section.label,
            section_key: category || '_root',
            section_position: section.position,
          });
        }

        courses.push({
          code: docsPath,
          docs_path: docsPath,
          title: topCategory.label,
          summary: intro?.description || '',
          access_mode: defaultCourseAccessModes[docsPath] || 'member',
          position: topCategory.position,
          chapters,
        });
      }
      manifest = {courses: courses.sort((a, b) => a.position - b.position || a.code.localeCompare(b.code))};
    },
    async postBuild({outDir}) {
      await fs.writeFile(
        path.join(outDir, 'hackstart-courses.json'),
        `${JSON.stringify(manifest, null, 2)}\n`,
        'utf8',
      );
    },
  };
}

export {secureMemberDocRemarkPlugin};

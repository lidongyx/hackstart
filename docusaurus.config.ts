import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import hackstartCoursesManifestPlugin, {secureMemberDocRemarkPlugin} from './plugins/hackstart-courses-manifest';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'HackStart',
  tagline: 'HackStart 资源、课程与社区',
  favicon: 'img/hackstart.jpeg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: {
      fasterByDefault: false,
    }, // Keep the v4 compatibility flags without enabling unstable local Rspack bundling.
  },

  // Set the production url of your site here
  url: process.env.SITE_URL || 'https://i.hackstart.org',
  // This independent frontend does not replace the Sub2API console.
  // Docs are served below /docs/ via the docs plugin routeBasePath.
  baseUrl: '/',

  customFields: {
    hackadminApiBaseUrl: process.env.HACKADMIN_API_BASE_URL || 'https://hackadmin.hackweek.org',
    sub2ApiBaseUrl: process.env.SUB2API_API_BASE_URL || 'https://hackstart.org/api/v1',
    resourcesApiUrl:
      process.env.HACKSTART_RESOURCES_API_URL ||
      'https://hackadmin.hackweek.org/api/resources',
    skillsApiUrl:
      process.env.HACKSTART_SKILLS_API_URL ||
      'https://hackadmin.hackweek.org/api/hackstart/skills',
    coursesApiUrl:
      process.env.HACKSTART_COURSES_API_URL ||
      'https://hackadmin.hackweek.org/api/hackstart/courses',
    courseAccessApiBaseUrl:
      process.env.HACKSTART_COURSE_ACCESS_API_URL ||
      'https://hackadmin.hackweek.org/api/hackstart/course-access',
    courseContentApiBaseUrl:
      process.env.HACKSTART_COURSE_CONTENT_API_URL ||
      'https://hackadmin.hackweek.org/api/hackstart/content',
    membershipLoginUrl:
      process.env.HACKSTART_MEMBERSHIP_LOGIN_URL ||
      'https://hackstart.org/login',
    authApiUrl:
      process.env.HACKSTART_AUTH_API_URL ||
      'https://hackstart.org/api/v1/auth/me',
    membershipApiUrl:
      process.env.HACKSTART_MEMBERSHIP_API_URL ||
      'https://hackadmin.hackweek.org/api/hackstart/membership',
    communityApiBaseUrl:
      process.env.HACKSTART_COMMUNITY_API_BASE_URL ||
      'https://hackadmin.hackweek.org/api/community',
    hackstartWorkshopApiBaseUrl:
      process.env.HACKSTART_WORKSHOP_API_BASE_URL ||
      'https://hackadmin.hackweek.org/api/hackstart',
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lidongyx',
  projectName: 'hackstart',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    mermaid: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          remarkPlugins: [secureMemberDocRemarkPlugin],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [hackstartCoursesManifestPlugin],

  themeConfig: {
    image: 'img/hackstart.jpeg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'HackStart',
      logo: {alt: 'HackStart Logo', src: 'img/hackstart.jpeg', href: '/', target: '_self'},
      items: [],
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['toml', 'nginx'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

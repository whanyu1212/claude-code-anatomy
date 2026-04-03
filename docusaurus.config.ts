import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Claude Code Anatomy',
  tagline: 'How Claude Code actually works, from the decompiled source.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://claude-code-anatomy-sigma.vercel.app',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Claude Code Anatomy',
      style: 'dark',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'anatomySidebar',
          position: 'left',
          label: 'Docs',
          className: 'navbar-docs-link',
        },
        {
          href: 'https://github.com/anthropics/claude-code',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Overview', to: '/'},
            {label: 'Core Architecture', to: '/core/agent-loop'},
            {label: 'Tool System', to: '/tools/tool-architecture'},
          ],
        },
        {
          title: 'Explore',
          items: [
            {label: 'Extensions', to: '/extensions/command-system'},
            {label: 'Security & Permissions', to: '/security/permission-model'},
            {label: 'Runtime & Infrastructure', to: '/core/startup-bootstrap'},
          ],
        },
        {
          title: 'Links',
          items: [
            {label: 'Claude Code on npm', href: 'https://www.npmjs.com/package/@anthropic-ai/claude-code'},
            {label: 'Anthropic', href: 'https://www.anthropic.com'},
          ],
        },
      ],
      copyright: `Claude Code Anatomy — Source analysis of Claude Code CLI v2.1.88`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'typescript'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

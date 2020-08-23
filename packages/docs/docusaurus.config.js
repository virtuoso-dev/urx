const path = require('path')

module.exports = {
  title: 'urx',
  tagline: 'The Tiniest Rective State Management Library',
  url: 'https:urx.virtuoso.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'petyosi', // Usually your GitHub org/user name.
  projectName: 'urx', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'urx Logo',
        src: 'img/urx-logo.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/petyosi/urx',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'README',
          sidebarPath: require.resolve('./sidebars-with-prose.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-typedoc',

      // plugin options
      {
        // list of input files relative to docusaurus.config.js
        inputFiles: ['../src/', '../README.md'],

        // docs directory (defaults to `docs`)
        out: 'docs/',

        // Skip updating of sidebars.json (defaults to `false`).
        skipSidebar: false,

        // Pass in any additional TypeDoc options `(see typedoc --help)`.
        name: 'Documentation',
      },
    ],
  ],
  scripts: ['https://unpkg.com/lz-string@1.4.4/libs/lz-string.min.js', '/js/code-sandbox.js'],
}

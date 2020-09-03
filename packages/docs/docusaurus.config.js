const path = require("path");

module.exports = {
  title: "urx",
  tagline: "Stream-based Reactive State Management Library",
  url: "https://urx.virtuoso.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "petyosi", // Usually your GitHub org/user name.
  projectName: "urx", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "",
      logo: {
        alt: "urx Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/get-started",
          activeBasePath: "docs",
          label: "Documentation",
          position: "left",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/petyosi/urx",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `
      Copyright © ${new Date().getFullYear()} Petyo Ivanov. 
      Built with Docusaurus. 
      <a class="footer__link-credit" href="https://www.freepik.com/vectors/background">Background from freepik</a>. 
      Colors from <a class="footer__link-credit" href="https://www.instagram.com/p/BvRh7rjB--d/">awsmcolor</a>.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: "README",
          sidebarPath: require.resolve("./sidebars-with-prose.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/petyosi/urx/edit/master/packages/docs/docs/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/petyosi/urx/edit/master/packages/docs/docs/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    [
      "docusaurus-plugin-typedoc",
      // plugin options
      {
        // list of input files relative to docusaurus.config.js
        inputFiles: ["../urx/src/", "../react-urx/src/"],
        exclude: "../urx/src/+(index|constants).ts",

        // docs directory (defaults to `docs`)
        out: "docs/",

        // Skip updating of sidebars.json (defaults to `false`).
        skipSidebar: false,

        // Pass in any additional TypeDoc options `(see typedoc --help)`.
        name: "Documentation",
        publicPath: "/",
        stripInternal: true,
      },
    ],
  ],
};

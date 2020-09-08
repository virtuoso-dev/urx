module.exports = {
  title: "urx",
  tagline: "Stream-based Reactive State Management Library",
  url: "https://urx.virtuoso.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "virtuoso-dev", // Usually your GitHub org/user name.
  projectName: "urx", // Usually your repo name.
  stylesheets: ["css/prism.css"],
  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/duotoneLight"),
      darkTheme: require("prism-react-renderer/themes/duotoneDark"),
    },
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
          href: "https://github.com/virtuoso-dev/urx",
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
          homePageId: "get-started",
          sidebarPath: require.resolve("./sidebars-with-prose.js"),
          editUrl:
            "https://github.com/virtuoso-dev/urx/edit/master/packages/docs/docs/",
        },
        blog: {
          showReadingTime: true,
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

module.exports = {
  siteMetadata: {
    name: "Antonio's Portfolio",
    description: "A blog and portfolio site for Antonio Gámiz",
    keywords: [
      "tech",
      "blog",
      "backend developer",
      "antoniogamiz",
      "javascript dev",
    ],
    siteUrl: "https://antoniogamiz.dev",
    siteImage: "images/favicon-128x128.png",
    profileImage: `images/favicon-64x64.png`,
    lang: `en`,
    config: {
      sidebarWidth: 240,
    },
  },
  plugins: [
    {
      resolve: "@pauliescanlon/gatsby-theme-terminal",
      options: {
        source: ["posts", "projects"],
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://antoniogamiz.dev`,
      },
    },
  ],
  pathPrefix: "",
};

function getGuideSidebar() {
  return [
    {
      text: "Introduction",
      children: [
        { text: "What is tools-web", link: "/" },
        { text: "Getting Started", link: "/guide/getting-started" },
        { text: "Usage", link: "/guide/usage" },
        { text: "Basic CLI", link: "/guide/basic-cli" },
      ],
    },
    {
      text: "Developer",
      children: [
        {
          text: "Create Plugin",
          link: "/dev/create-plugin",
        },
        { text: "API Reference", link: "/dev/api" },
      ],
    },
    {
      text: "Plugin",
      children: [
        {
          text: "Codeigniter 4",
          link: "/plugin/codeigniter4",
        },
      ],
    },
  ];
}

module.exports = {
  title: "tools-web",
  description:
    "tools-web is a tool to speed up developing a website using the cli. Such as making new project, components, state management, routes, model, and others.",
  themeConfig: {
    nav: [
      { text: "Github", link: "https://github.com/ferdiansyah0611/tools-web" },
    ],
    sidebar: {
      "/": getGuideSidebar(),
    },
  },
};

function getGuideSidebar() {
	return [
		{
			text: "Introduction",
			items: [
				{ text: "What is Tools Web", link: "/" },
				{ text: "Getting Started", link: "/guide/getting-started" },
				{ text: "Usage", link: "/guide/usage" },
				{ text: "Basic CLI", link: "/guide/basic-cli" },
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
			"/": getGuideSidebar()
		},
		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2023-present <a href="https://github.com/ferdiansyah0611">Ferdiansyah</a>'
		},
		search: {
      provider: 'local'
    }
	},
};

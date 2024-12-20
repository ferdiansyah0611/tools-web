const makeSub = (text, items) => ({ text, items });
const makeSubCollapsed = (text, collapsed, items) => ({ text, items, collapsed });
const makeLink = (text, link) => ({ text, link });

function getGuideSidebar() {
	return [
		makeSub("Introduction", [
			makeLink("Home Pages", "/"),
			makeLink("Getting Started", "/guide/getting-started"),
			makeLink("Basic CLI", "/guide/basic-cli"),
		]),
		makeSub("Library", [
			makeLink("React", "/library/react"),
			makeLink("Vue", "/library/vue"),
			makeLink("Vite", "/library/vite"),
			makeLink("TailwindCSS", "/library/tailwindcss"),
			makeLink("Express", "/library/express"),
			makeLink("Firebase", "/library/firebase"),
		]),
		makeSub("Repository", [
			makeLink("Starter", "/repository/starter"),
			makeLink("React Fully", "/repository/react-fully"),
			makeLink("Laravel", "/repository/laravel"),
		]),
		makeSub("Developer", [
			makeLink("Test", "/dev/test"),
			makeLink("Coming Soon", "/dev")
		])
	];
}


module.exports = {
	title: "Tools Web",
	description:
		"tools-web is a tool to speed up developing a website using the cli. Such as making new project, components, state management, routes, model, and others.",
	themeConfig: {
		nav: [{ text: "Github", link: "https://github.com/ferdiansyah0611/tools-web" }],
		sidebar: {
			"/": getGuideSidebar(),
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: 'Copyright © 2023-present <a href="https://github.com/ferdiansyah0611">Ferdiansyah</a>',
		},
		search: {
			provider: "local",
		},
	},
};
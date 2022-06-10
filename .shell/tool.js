const Tool = function () {
	this.name = "tool";
	this.action = [
		{
			statement: (arg) => arg.join(' ') === 'prettier all',
			console: {
				name: "prettier all",
				description: "Run prettier in the current project",
				tab: 5,
			},
			async action(arg, sh, plug, ROOT) {
				await sh.subprocess(`cd ${sh.env.root} && npx prettier --write .`, {
					close() {},
				});
			},
		},
		{
			name: "test:api",
			maxArg: 1,
			console: {
				name: "test:api [file]",
				description: "Create testing API http using deno",
				tab: 4,
			},
			action: async (arg, sh, plug, ROOT) => {
				const file = sh.SystemFile;
				file.createDirRecursive(sh.root + "/test");
				file.copy(
					sh.config.root + "test/api.js",
					sh.env.root + "/test/" + arg[0]
				);
			},
		},
		{
			name: "git:automate",
			maxArg: 2,
			console: {
				name: "git:automate [remote] [branch]",
				description: "Commit any files & push to repository",
				tab: 2,
			},
			action: async (arg, sh, plug, ROOT) => {
				await sh.subprocess(`cd ${sh.env.root} && git add . && git commit -m "automate push" && git push ${arg[0]} ${arg[1]}`, {
					close() {},
				});
			},
		}
	];
	return this;
};

module.exports = Tool;

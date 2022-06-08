const fs = require("fs");

module.exports = function (sh) {
	this.parseOption = () => {
		if (Array.isArray(sh.arg)) {
			let data = sh.arg.map((item) => {
				if (item.indexOf("--") === 0) {
					if (item.indexOf("=") !== -1) {
						return {
							name: item.slice(2, item.indexOf("=")),
							value: item.slice(item.indexOf("=") + 1),
						};
					} else {
						return item.slice(2);
					}
				}
			});
			let lastOption = 0;
			let cleanup = data.filter((item, key) => {
				if (item !== undefined) {
					if (typeof item === "string" && item !== "help") {
						if (!lastOption) {
							lastOption = key;
						}
						return item;
					}
					if (typeof item === "object" && item.name !== "help") {
						if (!lastOption) {
							lastOption = key;
						}
						return item;
					}
				}
			});
			sh.options = cleanup;
			sh.arg = lastOption ? sh.arg.slice(0, lastOption) : sh.arg;
		}
	};
	this.errorArg = (action) =>
		sh.console(
			`Error: must be ${action.maxArg} argument`.red +
				` *${action.console.name}`
		);
	this.showConsole = (v) =>
		console.log(
			"\t",
			v.console.name,
			"\t".repeat(v.console.tab),
			v.console.description
		);
	this.showTitle = (title) =>
		console.log("\n\t", sh.parse().toUpper(title).cyan, "Commands".cyan);
	this.showHelper = (arr, title = null) => {
		if (title) {
			this.showTitle(title);
		}
		arr.sort((a, b) => (a.name > b.name) - (a.name < b.name)).forEach(
			(v) => {
				this.showConsole(v);
			}
		);
	};
	this.errorArg = (action) =>
		sh.console(
			`Error: must be ${action.maxArg} argument`.red +
				` *${action.console.name}`
		);
	this.generateStyle = (caseName, typeSelect, format) => {
		var type = format;
		var dir = sh.env.root + "/src/style" + "/" + typeSelect;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, {
				recursive: true,
			});
		}
		if (type) {
			var name = type.toLowerCase();
			["css", "sass", "scss"].find((value) => {
				if (name === value) {
					caseName += ".module." + value;
				}
			});
			sh.SystemFile.write(
				`${sh.env.root}/src/style/${typeSelect}/${caseName}`,
				`/*${caseName}*/`
			);
			return caseName;
		}
	};
	this.CORE = () => {
		const { createDirRecursive, copy, read, write, append } = sh.SystemFile;
		return {
			createProject: async (name, end = Function) => {
				var exec =
					"npm create vite@latest " +
					sh.env.root +
					" -- --template " +
					name;
				await sh.subprocess(exec, {
					close: () => {
						var core = sh.core();
						var code = read(
							sh.config.rootShell + "vite.config.js"
						).toString();
						code = code.replace("react", name);
						write(sh.env.root + "/vite.config.js", code);
						write(
							sh.env.root + "/vercel.json",
							'{ "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }] }'
						);
						end();
					},
					hide: true,
					hideLog: true,
				});
			},
			createTailwind: async (type) => {
				var exec =
					sh.env.mode === 1
						? "cd " +
						  sh.env.root +
						  " && npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p"
						: "ls";
				await sh.subprocess(exec, {
					close: () => {
						copy(
							sh.config.rootShell + "tailwind.sass",
							sh.env.root + "/src/tailwind.sass"
						);
						copy(
							sh.config.rootShell + "tailwind.config.js",
							sh.env.root + "/tailwind.config.js"
						);
						var dir =
							sh.env.root +
							(type == "react"
								? "/src/main.jsx"
								: "/src/main.js");
						var code = read(dir).toString();
						write(dir, "import './tailwind.sass'\n" + code);
						sh.log("successfuly setup & install tailwindcss!");
					},
				});
			},
			createFirebaseStorage: () => {
				createDirRecursive(sh.config.directory.service);
				var code = read(
					sh.config.rootShell + "firebase/storage.js"
				).toString();
				write(
					sh.config.directory.service + "/firebase-storage.js",
					code
				);
				var core = sh.core();
				core.success();
			},
			initializeFirebase: () => {
				copy(
					sh.config.rootShell + "firebase/firebase.js",
					sh.env.root + "/src/firebase.js"
				);
				copy(
					sh.config.rootShell + "firebase/validate.js",
					sh.env.root + "/src/service/validate-auth.js"
				);
				var core = sh.core();
				core.success();
			},
			createModelFirestore: (caseName) => {
				caseName = String(caseName).toLowerCase();
				createDirRecursive(sh.env.root + "/src/model");
				var code = read(sh.config.rootShell + "firebase/model.js")
					.toString()
					.replaceAll("model", caseName);
				write(sh.env.root + "/src/model/" + caseName + ".js", code);
				var core = sh.core();
				core.success();
			},
			success: (newline = true) => {
				if (newline) {
					process.stdout.write("\n");
				}
				sh.exit();
			},
		};
	};
	return this;
};

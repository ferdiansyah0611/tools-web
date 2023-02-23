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
	this.showTitle = (title, disableLine = false) =>
		console.log(
			disableLine ? "\t" : "\n\t",
			sh.parse().toUpper(title).cyan,
			"Commands".cyan
		);
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
	this.createVite = async (name, end = Function) => {
		let file = sh.SystemFile;
		var exec = `npm create vite@latest ${sh.env.root} -- --template ${name}`;
		await sh.subprocess(exec, {
			close: () => {
				var code = file
					.read(sh.config.vite + "vite.config.js")
					.toString();
				code = code.replaceAll("react", name);
				file.write(sh.env.root + "/vite.config.js", code);
				file.write(
					sh.env.root + "/vercel.json",
					'{ "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }] }'
				);
				end();
			},
			hide: true,
			hideLog: true,
		});
	};
	this.createTailwind = async (type) => {
		let file = sh.SystemFile;
		var exec =
			sh.env.mode === 1
				? "cd " +
				  sh.env.root +
				  " && npm install -D tailwindcss postcss autoprefixer sass --save && npx tailwindcss init -p"
				: "echo 1";
		await sh.subprocess(exec, {
			close: () => {
				file.copy(
					sh.config.tailwind + "tailwind.sass",
					sh.env.root + "/src/tailwind.sass"
				);
				file.copy(
					sh.config.tailwind + "tailwind.config.cjs",
					sh.env.root + "/tailwind.config.cjs"
				);
				var dir =
					sh.env.root +
					(type == "react" ? "/src/main.jsx" : "/src/main.js");
				var code = file.read(dir).toString();
				file.write(dir, "import './tailwind.sass'\n" + code);
				sh.log("successfuly setup & install tailwindcss!");
			},
		});
	};
	this.runServerNpm = () => {
		sh.subprocess("cd " + sh.root + " && npm run dev", {
			close: () => {},
			notSync: true,
		});
	};
	return this;
};

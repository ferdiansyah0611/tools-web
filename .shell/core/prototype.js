module.exports = function prototype(Shell) {
	// definition
	const fs = require("fs");
	const readline = require("readline");
	const ROOT = require("path").dirname(require.main.filename);
	const colors = require("colors");
	const System = require("./system");
	const SystemFile = require("./file");
	const Utils = require("./utils");
	const input = process.stdin,
		output = process.stdout,
		rl = readline.createInterface({ input, output });

	// initalize
	Shell.prototype.framework = null;
	Shell.prototype.customize = false;
	Shell.prototype.startcli = false;
	Shell.prototype.hasRun = false;
	Shell.prototype.LIST = [];
	Shell.prototype.arg = [];
	Shell.prototype.pid = [];
	Shell.prototype.options = [];
	Shell.prototype.plugin = [];
	// prototype
	Shell.prototype.beforeRun = function (env) {
		env = env || {
			mode: 0,
			root: "myapp",
		};
		this.env = new Proxy(env, {
			get(obj, prop) {
				return obj[prop];
			},
			set(obj, prop, val) {
				obj[prop] = val;
				return true;
			},
		});
		this.root = this.env.root;
		this.isProduction = this.env.mode === 1;
		this.SystemFile = new SystemFile(this);
		this.utils = new Utils(this);
	};
	Shell.prototype.core = function () {
		return this.utils.CORE();
	};
	// input cli
	Shell.prototype.quest = function (msg) {
		return new Promise((resolve) => {
			rl.question(msg, (answer) => {
				resolve(answer);
			});
		});
	};
	// plugin
	Shell.prototype.use = function (Class) {
		var plugin = new Class(this);
		this.LIST.push(Class.name.toLowerCase());
		this.plugin.push(plugin);
	};
	Shell.prototype.cli = async function () {
		if (process.argv.find((item) => item === "--cli")) {
			this.startcli = false;
			this.arg = process.argv.slice(3);
			if (this.hasRun) {
				this.exit(true);
				return true;
			} else {
				this.hasRun = true;
			}
			this.start();
			return true;
		}
		if (this.customize && !this.startcli) {
			return process.exit();
		}
		this.startcli = true;
		const arg = await this.quest(`${this.time()} > `);
		this.arg = arg.split(" ");
		this.start();
	};
	// config directory
	Shell.prototype.configure = function () {
		this.config = {
			rootShell: ROOT + "/.shell/",
			directory: {
				component: this.env.root + "/src/component",
				route: this.env.root + "/src/route",
				store: this.env.root + "/src/store",
				style: this.env.root + "/src/style",
				service: this.env.root + "/src/service",
				model: this.env.root + "/model",
				api: this.env.root + "/api",
			},
		};
	};
	Shell.prototype.start = function (customize = null) {
		return new Promise(async (resolve) => {
			var isFound = false;
			var firstArg = this.arg[0];
			const init = () => {
				if (Array.isArray(customize)) {
					this.customize = true;
					this.arg = customize;
					firstArg = this.arg[0];
				} else if (this.arg.length === 0) {
					firstArg = "-h";
				}
				this.framework = firstArg;
			};
			const showConsole = (v) =>
				console.log(
					"\t",
					v.console.name,
					"\t".repeat(v.console.tab),
					v.console.description
				);
			const showTitle = (title) =>
				console.log(
					"\n\t",
					this.parse().toUpper(title).cyan,
					"Commands".cyan
				);
			const showHelper = (arr, title = null) => {
				if (title) {
					showTitle(title);
				}
				arr.sort(
					(a, b) => (a.name > b.name) - (a.name < b.name)
				).forEach((v) => {
					showConsole(v);
				});
			};
			const errorArg = (action) =>
				this.console(
					`Error: must be ${action.maxArg} argument`.red +
						` *${action.console.name}`
				);
			const parseOption = () => {
				if (Array.isArray(this.arg)) {
					let data = this.arg.map((item) => {
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
							if (
								typeof item === "object" &&
								item.name !== "help"
							) {
								if (!lastOption) {
									lastOption = key;
								}
								return item;
							}
						}
					});
					this.options = cleanup;
					this.arg = lastOption
						? this.arg.slice(0, lastOption)
						: this.arg;
				}
			};
			init();
			parseOption();
			// logic
			if (["-h", "--help"].indexOf(firstArg.toLowerCase()) !== -1) {
				isFound = true;
				this.consoleHelper(() => {
					console.log("\t", "-h --help", "Show help command");
				});
				this.consoleHelper(() => {
					showTitle("Core");
					System.sort(
						(a, b) =>
							(a.console.name > b.console.name) -
							(a.console.name < b.console.name)
					).map((v) => {
						showConsole(v);
						resolve(true);
					});
					this.plugin
						.sort((a, b) => (a.name > b.name) - (a.name < b.name))
						.map((v) => {
							showHelper(v.action, v.name);
							resolve(true);
						});
				});
				return this.exit();
			}
			if (["-v", "--version"].indexOf(firstArg.toLowerCase()) !== -1) {
				isFound = true;
				var file = JSON.parse(
					this.SystemFile.read(ROOT + "/package.json")
				);
				console.log(this.time(), ">", "v" + file.version);
				resolve(true);
				return this.exit();
			}
			var plugin = this.plugin.find((v) => v.name == this.framework);
			if (plugin) {
				isFound = true;
				if (["-h", "--help"].indexOf(this.arg[1]) !== -1) {
					this.consoleHelper(() => showHelper(plugin.action));
					resolve(true);
					this.exit();
					return true;
				} else {
					var action = plugin.action.find(
						(v) => v.name === this.arg[1]
					);
					if (action) {
						if (
							action.maxArg &&
							this.arg.slice(2).length < action.maxArg
						) {
							errorArg(action);
							resolve(true);
							this.cli();
							return true;
						} else {
							try {
								await action.action(this.arg.slice(2));
								resolve(true);
								console.log("")
								this.cli();
								return true;
							} catch (e) {
								this.console(e.message.red);
								this.cli();
								return true;
							}
						}
					}
					resolve(true)
					this.cli()
				}
			}
			if (!isFound) {
				const running = System.find(
					(v) => v.statement(this.arg) !== false
				);
				if (!running) {
					if (this.arg.length > 0 && this.arg[0] !== "" && !isFound) {
						isFound = true;
						await this.subprocess(this.arg.join(" "), {
							close: () => {
								resolve(true);
								this.cli();
							},
							hideLog: true,
						});
					} else {
						resolve(true);
						this.exit();
					}
				} else {
					if (running.maxArg && this.arg.length < running.maxArg) {
						errorArg(running);
						resolve(true);
						this.cli();
					} else {
						isFound = true;
						await running.action(this, ROOT);
						resolve(true);
						this.exit();
					}
				}
			}
		});
	};
	Shell.prototype.consoleHelper = function (options = Function) {
		console.log("");
		console.log("Help Commands: ");
		console.log("\t", `[${this.LIST.join(", ")}] [options]`.underline);
		console.log("options: ");
		options((...arg) => console.log("\t", ...arg));
	};
	Shell.prototype.subprocess = async function (
		run,
		action = {
			close: Function,
		}
	) {
		try {
			const util = require("util");
			const exec = util.promisify(require("child_process").exec);
			(() => {
				if (!action.hideLog) {
					this.console(run.underline.blue);
				}
			})();
			let runExecute = exec(run);
			this.pid.push(runExecute.child.pid);
			if (!action.notSync) {
				runExecute = await runExecute;
				if (runExecute.stderr) {
					this.log(runExecute.stderr);
					action.close(runExecute.stderr);
					return;
				}
				await new Promise((res) => {
					setTimeout(() => res(true), 500);
				});
				if (runExecute.stdout && !action.hide) {
					runExecute.stdout.split("\n").map((v) => {
						if (v) {
							this.console(v);
						}
					});
				}
				action.close(runExecute.stdout);
			}
		} catch (e) {
			e.message.split("\n").map((v) => {
				if (v) {
					this.console(v.red);
				}
			});
			this.core().success(false);
		}
	};
	Shell.prototype.parse = function () {
		return {
			toUpper: (text) =>
				text ? text[0].toUpperCase() + text.slice(1) : null,
			removeFormat: (text) =>
				text
					? text[0].toUpperCase() + text.slice(1, text.indexOf("."))
					: null,
		};
	};
	Shell.prototype.coreFeatureDefault = function (core, options) {
		return [
			{
				name: "install:tailwindcss",
				console: {
					name: "install:tailwindcss",
					description: "Installation & configuration for tailwindcss",
					tab: 4,
				},
				action: async (arg) => {
					core.createTailwind(options.framework);
				},
			},
			{
				name: "make:gcs",
				console: {
					name: "make:gcs",
					description:
						"Generate service firebase-storage for upload & remove (v8)",
					tab: 5,
				},
				action: async (arg) => {
					core.createFirebaseStorage();
				},
			},
			{
				name: "make:firebase",
				console: {
					name: "make:firebase",
					description: "Generate config firebase (v9)",
					tab: 5,
				},
				action: (arg) => {
					core.initializeFirebase();
				},
			},
			{
				name: "make:model:firestore",
				maxArg: 1,
				console: {
					name: "make:model:firestore [file]",
					description: "Generate model firestore (v9)",
					tab: 3,
				},
				action: (arg) => {
					core.createModelFirestore(
						this.parse().removeFormat(arg[0])
					);
				},
			},
			{
				name: "run:server",
				console: {
					name: "run:server",
					description: "Run the server application on the background",
					tab: 5,
				},
				action: async () => {
					this.subprocess("cd " + this.root + " && npm run dev", {
						close: () => {},
						notSync: true,
					});
				},
			},
		];
	};

	Shell.prototype.log = function (log) {
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);
		process.stdout.write(`${this.time()} ${log}\r`);
	};
	Shell.prototype.exit = function (skip = false) {
		if (this.startcli) {
			this.cli();
		} else {
			if (skip || !this.startcli) {
				rl.close();
				process.exit();
			}
		}
	};
	Shell.prototype.console = function (log) {
		console.log(`${this.time()}`, log);
	};
	Shell.prototype.time = function () {
		var date = new Date(),
			minutes = date.getMinutes(),
			hours = date.getHours();

		return `[${hours}:${
			String(minutes).length === 1 ? "0" + minutes : minutes
		}]`;
	};
};

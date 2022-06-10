module.exports = function prototype(Shell) {
	// definition
	const fs = require("fs");
	const readline = require("readline");
	const ROOT = require("path").dirname(require.main.filename);
	const colors = require("colors");
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
		this.use(require("./system"));
		this.root = this.env.root;
		this.isProduction = this.env.mode === 1;
		this.SystemFile = new SystemFile(this);
		this.utils = new Utils(this);
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
	Shell.prototype.add = function (name, action) {
		this.plugin = this.plugin.map((item) => {
			if (item.name === name) {
				item.action.push(action);
			}
			return item;
		});
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
			root: ROOT + "/.shell/",
			source: ROOT + "/.source/",
			express: ROOT + "/.source/express/",
			react: ROOT + "/.source/react/",
			vue: ROOT + "/.source/vue/",
			firebase: ROOT + "/.source/firebase/",
			tailwind: ROOT + "/.source/tailwind/",
			vite: ROOT + "/.source/vite/",
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
			const command = async (plugin, logic) => {
				if (["-h", "--help"].indexOf(this.arg[1]) !== -1 && plugin.name !== 'system') {
					isFound = true;
					this.consoleHelper(() =>
						this.utils.showHelper(plugin.action)
					);
					resolve(true);
					this.exit();
					return true;
				} else {
					var action = plugin.action.find(logic);
					if (action) {
						isFound = true;
						if (
							action.maxArg &&
							this.arg.slice(plugin.name === "system" ? 0 : 2)
								.length < action.maxArg
						) {
							this.utils.errorArg(action);
							resolve(true);
							this.cli();
							return true;
						} else {
							try {
								await action.action(
									this.arg.slice(2),
									this,
									plugin,
									ROOT
								);
								if (
									!action.console.disableNewline &&
									!this.startcli
								) {
									console.log("");
								}
								resolve(true);
								this.cli();
								return true;
							} catch (e) {
								this.console(e.message.red);
								this.cli();
								return true;
							}
						}
					}
				}
			};
			init();
			this.utils.parseOption();
			// logic
			var plugin = this.plugin.find((v) => v.name == this.framework);
			if (plugin) {
				if(!plugin.disabled) {
					await command(plugin, (v) => v.name === this.arg[1]);
				}
			}
			if (!isFound) {
				var system = this.plugin.find((v) => v.name === "system");
				const running = await command(
					system,
					(v) => v.statement(this.arg) !== false
				);
				if (!isFound) {
					if (this.arg.length > 0 && this.arg[0] !== "") {
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
				}
			}
		});
	};
	Shell.prototype.consoleHelper = function (
		command = Function,
		flag = false
	) {
		let listOnString = this.LIST.filter((item) => item !== "system").join(
			", "
		);
		console.log("");
		console.log("Usage: ");
		console.log("\t", `[${listOnString}] [command] [flag]`.underline);
		if (flag) {
			console.log("Flag: ");
			flag();
			console.log("");
		}
		console.log("Command: ");
		command();
		console.log("");
		console.log(
			`Use "[command] --help" for more information about a command.`
		);
		console.log("");
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
			this.success(false)
		}
	};
	Shell.prototype.success = function (newline = true) {
		if (newline) {
			process.stdout.write("\n");
		}
		this.exit();
	}
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

	Shell.prototype.log = function (log) {
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);
		process.stdout.write(`${this.time()} ${log}\r`);
	};
	Shell.prototype.exit = function (skip = false, restart = false) {
		if (this.startcli) {
			this.cli();
		} else {
			if (restart || skip || !this.startcli) {
				rl.close();
				process.exit();
			}
		}
	};
	Shell.prototype.console = function (...log) {
		console.log(`${this.time()}`, ...log);
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

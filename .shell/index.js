class Shell {
	constructor(env) {
		this.beforeRun(env);
		this.configure();
	}
}

require("./prototype")(Shell);

module.exports = Shell;

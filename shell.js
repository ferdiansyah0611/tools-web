class Shell {
	constructor(env) {
		this.beforeRun(env);
		this.configure();
	}
}

require("./.shell/prototype")(Shell);

module.exports = Shell;

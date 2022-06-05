const SystemFile = require("./.shell/core/file");

class Shell {
	constructor(env) {
		this.beforeRun(env);
		this.configure();
	}
}

require("./.shell/core/prototype")(Shell);

module.exports = Shell;

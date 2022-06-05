const SystemFile = require("./.shell/core/file");

class Shell {
	constructor(env) {
		this.beforeRun(env);
		this.config();
	}
}

require("./.shell/core/prototype")(Shell);

module.exports = Shell;

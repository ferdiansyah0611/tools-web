import { output, chalk } from "../lib.js";
import { spawn, spawnSync, SpawnSyncReturns } from "child_process";

type Action = {
	log?: Function;
	onError?: Function;
	close?: Function;
	hideLog?: boolean;
	hideStdout?: boolean;
	background?: boolean;
	sync?: boolean;
};
type ConfigSpawn = {
	shell: boolean;
	signal: any;
	detached?: boolean;
}

class SubProcess {
	controller: AbortController[] = [];
	run(cli: string, action: Action) {
		const { controller, index } = this.addController();
		const show = (value: string) => value.split("\n").forEach((v: string) => v && output.log(v));
		const configSpawn: ConfigSpawn = { shell: true, detached: false, signal: controller.signal };
		try {
			if (action.background) configSpawn.detached = true;
			if (action.sync) delete configSpawn.detached;
			if (!action.hideLog) output.log(`running ${chalk.green(`'${cli}'`)}`);
			// not sync
			if(!action.sync) {
				let running = spawn(cli, configSpawn)
				running.stdout.on("data", (data) => {
					if (action.hideStdout) return;
					if (action.log) return action.log(data.toString());
					return show(data.toString());
				});
				running.stderr.on("data", (data) => {
					if(action.onError) {
						return action.onError(data)
					}
					output.error(data.split("\n"))
				});
				running.on("close", (code) => {
					if (action.close) action.close(code);
					this.detachController(index);
				});
				if (action.background) running.unref();
			} else {
				let running = spawnSync(cli, configSpawn)
				return running;
			}
		} catch (e: any) {
			if(action.onError) {
				return action.onError(e)
			}
			output.error(e.message.split("\n"))
		}
	}
	addController() {
		const controller = new AbortController();
		return { controller, index: this.controller.push(controller) };
	}
	detachController(index: number) {
		this.controller = this.controller.filter((_, i: number) => i !== index);
	}
	error(spawnResult: SpawnSyncReturns<Buffer>) {
		return output.error(spawnResult.stderr.toString());
	}
}

const subprocess = new SubProcess();

export default subprocess;

export function prettier(dir: string, target: string) {
	let execute = `cd ${dir} && npx prettier ${target} --write --loglevel silent`;
	subprocess.run(execute, { sync: true, hideLog: true });
}
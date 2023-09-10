import { ChildProcessWithoutNullStreams, SpawnOptionsWithoutStdio, SpawnSyncReturns, spawn, spawnSync } from "child_process";
import { chalk, output } from "../lib.js";
import { ConfigType } from "./config.js";

export type Option = {
	/**
	 * run command on the background *doRun()
	 */
	background?: boolean;
	/**
	 * callback stdout
	 */
	stdout?: (data: Buffer) => any;
	/**
	 * callback stderr
	 */
	stderr?: (data: Buffer) => any;
	/**
	 * callback close *doRun()
	 */
	close?: (code: number|null) => any;
	/**
	 * log before run "running 'echo 1'"
	 */
	log?: boolean
};

export type Result = {
	/**
	 * running command with stream
	 */
	doRun: () => any;
	/**
	 * running command with sync
	 */
	doSync: () => SpawnSyncReturns<Buffer>;
	/**
	 * change current command
	 */
	change: (callback: (current: string) => string) => any;
	/**
	 * change cli if mode is 1
	 */
	changeOnProduction: (config: ConfigType, callback: (current: string) => string) => any;
	/**
	 * change cli to be "echo 1" if mode is 0
	 */
	changeEcho: (config: ConfigType) => any;
};
/**
 * data for abort controller spawn
 */
export const control: AbortController[] = [];
/**
 * execute instance
 */
export function execute(cli: string, option: Option): Result {
	const result: Result = {
		doRun,
		doSync,
		change,
		changeOnProduction,
		changeEcho
	};
	const controller = new AbortController();
	const callback = (_: Buffer) => {};
	const beforeStart = () => {
		let index = control.push(controller);
		if (option.log) output.log(`running ${chalk.green(`'${cli}'`)}`);

		return() => {
			control.splice(index, 1);
		}
	}

	function change(callback: (current: string) => string) {
		cli = callback(cli);
	}
	function changeOnProduction(config: ConfigType, callback: (current: string) => string) {
		if (config.mode === 1) change(callback);
	}
	function changeEcho(config: ConfigType) {
		if (config.mode === 0) cli = "echo 1";
	}
	function doRun() {
		let closed = beforeStart();
		let spawnOptions: SpawnOptionsWithoutStdio = { shell: true, signal: controller.signal };
		if (option.background) spawnOptions.detached = true;

		let running: ChildProcessWithoutNullStreams = spawn(cli, spawnOptions);
		running.stdout.on("data", option.stdout ? option.stdout : callback);
		running.stderr.on("data", option.stderr ? option.stderr : callback);
		running.on("close", (code) => {
			if (option.close) option.close(code);
			closed();
		});
		// background
		if (option.background) running.unref();
	}
	function doSync() {
		let closed = beforeStart();
		let running: SpawnSyncReturns<Buffer> = spawnSync(cli, { shell: true, signal: controller.signal });
		// after run
		closed();
		// handle run
		if (running.stderr.byteLength) throw Error(running.stderr.toString());
		if (option.stdout) option.stdout(running.stdout);
		return running;
	}

	return result;
}

/**
 * command to run prettier with target
 */
export function prettier(dir: string, target: string) {
	return execute(`cd ${dir} && npx prettier ${target} --write --log-level silent`, {}).doSync();
}
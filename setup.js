import { existsSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).replace("\\src", "");

setup();

function setup() {
	const updateStdout = (value) => {
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);
		process.stdout.write(value + "\r");
	}
	try {
		if (existsSync("./dist")) return updateStdout("Already Setup");
		// ts check
		updateStdout("Check Typescript...");
		let tsc = spawnSync("tsc --version", { shell: true });
		if (tsc.stderr) {
			spawnSync("npm i -g typescript && npm i -g prettier", { shell: true });
		}
		// build
		updateStdout("Building...");
		spawnSync("cd " + __dirname + " && tsc", { shell: true });
		writeFileSync(
			"./dist/config.json",
			JSON.stringify(
				{
					app_path: __dirname + "\\app",
					app_active: "myapp",
					library: [],
					mode: 1,
				},
				null,
				4,
			),
		);
		updateStdout("Successfuly");
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
}
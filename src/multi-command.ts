import { Input, output, readline } from "./lib.js"
import { readdirSync, existsSync } from "fs";
import { spawn, ChildProcessWithoutNullStreams, spawnSync } from "child_process";
import { paths } from "./constraint.js";
import config from "./utils/config.js";

type StateType = {
	process: AbortController[];
}
const state: StateType = {
	process: []
}

process.on("exit", () => {
	state.process.forEach(v => v.abort());
});
main();

function main() {
	process.title = "Tools Web";
	const input = new Input();
	const cli = readdirSync("./src/cli").map(v => v.replace(".ts", "").replace(".js", ""));

	welcome();
	action();

	async function action(argv: string|any = ""): Promise<any> {
		argv = argv || await input.ask("")

		let split: string[] = argv.split(" ")
		let command: string = `node dist/main.js${argv ? ' ' + argv: ''}`
		if(argv === "0") {
			output.log("Process Terminated")
			return process.exit(1)
		}
		if(argv.startsWith(".bg ")) {
			backgroundProcess(argv);
			return action();
		}

		if(argv === "") command += " help";
		else if(argv.includes(" , ")) {
			let todos: string[] = argv.split(" , ");
			todos.forEach(async todo => await action(todo));
		}
		else if(!cli.find(v => v === split[0]) && !["-v", "--version", "-h", "--help"].find(v => v === argv)) command = argv;

		let result: ChildProcessWithoutNullStreams = spawn(command, { shell: true })
		result.stdout.pipe(process.stdout)
		result.stderr.pipe(process.stdout)
		result.on("close", () => {
			return action()
		})
	}
}

function welcome() {
	checkBuild();

	let conf = config.read();

	let message = `
	Welcome to Tools Web
	Namespace\t: ${conf.app_path}
	App\t\t: ${conf.app_active}
	Library\t\t: ${!conf.library.length ? "None": conf.library.filter(v => v.active === true).map(v => v.name).join(", ")}
	Mode\t\t: ${conf.mode === 1 ? "Production": "Development"}
	`
	console.log(message)
}

function backgroundProcess(argv: string|any) {
	const abort = new AbortController();
	spawn(argv.replace(".bg ", ""), { detached: true, shell: true, signal: abort.signal }).unref();
	state.process.push(abort);
}

function checkBuild() {
	let dot =  1;
	let text = "Downloading";
	try {
		if(existsSync("./dist")) return;

		let interval = setInterval(() => {
			output.write(text + ".".repeat(dot))
			dot += 1;
			if (dot === 4) dot = 1;
		}, 500);

		let tsc = spawnSync("tsc --version");
		if(tsc.stderr) {
			spawnSync("npm i -g typescript && npm i -g prettier");
		}
		text = "Building";
		spawnSync("cd " + paths.root + " && tsc");
		clearInterval(interval);
		config.update({
			app_path: paths.root + "\\app",
			app_active: "myapp",
			library: [],
			mode: 1
		});
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0)
		output.write("Successfuly");
	} catch(err) {
		process.exit(1);
	}
}
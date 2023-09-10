import { Input, chalk, output } from "./lib.js"
import { readdirSync } from "fs";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
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
		let value = config.read();

		argv = argv || await input.ask("", chalk.green(`/${value.app_active} `))

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
		result.stdout.on("data", (std: Buffer) => stdOut(std, command.includes("help")));
		result.stderr.pipe(process.stdout)
		result.on("close", () => {
			return action()
		})
	}
}

function stdOut(std: Buffer, isHelp: boolean) {
	let value = std.toString()
	let timer = value.match(/\[.+\]/);
	let oneQuote = value.match(/'.+'/);
	let isError = value.match(/Error:/)
	if(timer) {
		value = value.replace(timer[0], chalk.magentaBright(timer[0]));
	}
	if(oneQuote) {
		value = value.replace(oneQuote[0], chalk.greenBright(oneQuote[0]));
	}
	if(isError) {
		value = chalk.redBright(value);
	}
	if(value.length > process.stdout.columns && !isHelp && !isError) {
		value = value.slice(0, process.stdout.columns) + "...\n"
	}
	process.stdout.write(value);
}

function welcome() {
	let conf = config.read();
	let message = `
	Welcome to Tools Web
	${chalk.magentaBright('Namespace')}\t: ${conf.app_path}
	${chalk.magentaBright('App')}\t\t: ${conf.app_active}
	${chalk.magentaBright('Library')}\t\t: ${!conf.library.length ? "None": conf.library.filter(v => v.active === true).map(v => v.name).join(", ")}
	${chalk.magentaBright('Mode')}\t\t: ${conf.mode === 1 ? "Production": "Development"}
	`
	console.log(message)
}

function backgroundProcess(argv: string|any) {
	const abort = new AbortController();
	spawn(argv.replace(".bg ", ""), { detached: true, shell: true, signal: abort.signal }).unref();
	state.process.push(abort);
}
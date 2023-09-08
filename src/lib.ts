import chalk from 'chalk';
import { program, Option } from 'commander';
import * as readline from 'node:readline';
import logSymbols from 'log-symbols';

// input
interface InputType {
	end: Function;
	ask: Function;
}
class Input implements InputType {
	instance: readline.Interface | null = null;
	constructor() {
		this.instance = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
	}
	end() {
		this.instance?.close();
	}
	async ask(message: string) {
		return await new Promise((resolve, reject) => {
			if(!this.instance) return reject("input not initialized");
			this.instance.question(chalk.whiteBright("> ") + message, resolve)
		})
	}
}

// output
const output = {
	write: function(message: any) {
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);
		process.stdout.write(chalk.cyan("> ") + message + "\r");
	},
	log: function(...message: any[]) {
		console.log(logSymbols.info, ...message)
	},
	error: function(...message: any[]) {
		console.log(logSymbols.error, chalk.redBright(...message))
	},
	warn: function(...message: any[]) {
		console.log(logSymbols.warning, ...message)
	},
	success: function(...message: any[]) {
		console.log(logSymbols.success, ...message)
	}
}

export { program, Option, chalk, output, Input, readline };
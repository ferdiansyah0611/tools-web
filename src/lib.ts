import chalk from 'chalk';
import { program, Option } from 'commander';
import * as readline from 'node:readline';

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
	async ask(message: string, start?: string) {
		return await new Promise((resolve, reject) => {
			if(!this.instance) return reject("input not initialized");
			this.instance.question(start + chalk.blue("$ ") + message, resolve)
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
		console.log(chalk.magentaBright(getTimeLog()), ...message)
	},
	error: function(...message: any[]) {
		console.log(chalk.magentaBright(getTimeLog()), chalk.redBright(...message))
	},
	warn: function(...message: any[]) {
		console.log(chalk.magentaBright(getTimeLog()), ...message)
	},
	success: function(...message: any[]) {
		console.log(chalk.magentaBright(getTimeLog()), ...message)
	}
}

function getTimeLog() {
	let date = new Date();
	return (`[${date.getMinutes()}:${date.getSeconds()}]\t`)
}

export { program, Option, chalk, output, Input, readline };
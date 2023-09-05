import chalk from 'chalk';
import ora from 'ora';
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
	async ask(message: string) {
		return await new Promise((resolve, reject) => {
			if(!this.instance) return reject("input not initialized");
			this.instance.question(chalk.magenta("> ") + message, resolve)
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
		console.log(chalk.cyan(">"), ...message)
	},
	error: function(...message: any[]) {
		output.log(chalk.redBright(...message))
	},
	task: function(message: string) {
		let task = ora(message).start();
		let result = {
			next(text: string) {
				task.text = text
				task.start()
			},
			done(text?: string) {
				task.succeed(text)
				return this;
			},
			fail(text?: string) {
				task.fail(text)
				return this;
			}
		}
		return result;
	}
}

export { program, Option, chalk, output, Input, readline };
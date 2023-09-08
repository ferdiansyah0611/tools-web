import { output } from "../lib.js";

class Task {
	list: string[];

	constructor(list: string[]) {
		this.list = list
	}
	update(choice: number, value: string) {
		this.list[choice] = value;
	}
	start(choice: number): Task {
		output.log(this.list[choice])
		return this;
	}
	success(choice: number): Task {
		output.success(this.list[choice])
		if(this.list[choice + 1]) this.start(choice + 1);
		return this;
	}
	fail(choice: number): Task {
		output.error(this.list[choice])
		return this;
	}
	info(choice: number): Task {
		output.log(this.list[choice])
		return this;
	}
	warn(choice: number): Task {
		output.warn(this.list[choice])
		return this;
	}
}

export default Task;
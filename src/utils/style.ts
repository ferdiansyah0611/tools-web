import { existsSync, mkdirSync } from "fs";
import file from "./file.js";

export function generate(name: string, sub: string, format: string, dir: string): string {
	let directory = `${dir}/src/style/${sub}`;
	if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
	name += `.module.${format}`;
	file.write(`${dir}/src/style/${sub}/${name}`, `/*${name}*/`);
	return name;
}
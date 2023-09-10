import { existsSync, mkdirSync } from "fs";
import { file } from "./file.js";

type ConfigStyle = {
	path: string;
	name: string;
	format: string;
	subfolder?: string;
}

/**
 * generating style with format
 * @return fullpath style
 */
export function generate(dir: string, config: ConfigStyle): string {
	let directory = `${dir}/src/style${(config.subfolder ? `/${config.subfolder}`: "")}/${config.path}`;
	if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
	let name = config.name + ".module." + config.format;
	file.write(`${directory}/${name}`, `/*${name}*/`);
	return `${config.path}/${name}`;
}
import { existsSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync } from "fs";

class File {
	constructor() {
		this.mkdir = this.mkdir.bind(this);
		this.append = this.append.bind(this);
		this.copy = this.copy.bind(this);
		this.write = this.write.bind(this);
		this.read = this.read.bind(this);
	}
	/**
	 * create folder recursive if not exists
	 */
	mkdir(dir: string) {
		if (!existsSync(dir)) {
			return mkdirSync(dir, {
				recursive: true,
			});
		}
	}
	/**
	 * append text to file
	 */
	append(filepath: string, first: string, end: string | null = null, replace: Function | null = null) {
		var text = readFileSync(filepath, "utf8").toString();
		return writeFileSync(filepath, first + (replace ? replace(text) : text) + (end || ""));
	}
	/**
	 * copy file
	 */
	copy(copy: string, dir: string) {
		return copyFileSync(copy, dir);
	}
	/**
	 * write file
	 */
	write(dir: string, val: string) {
		return writeFileSync(dir, val);
	}
	/**
	 * read file
	 */
	read(dir: string) {
		return readFileSync(dir, "utf8");
	}
	/**
	 * clear file/folder on recursive
	 */
	rm(dir: string) {
		return rmSync(dir, { recursive: true, force: true });
	}
	/**
	 * exists file
	 */
	isExists(dir: string) {
		return existsSync(dir);
	}
}

const file = new File();

export default file;

export function readPackageJson(appDir: string) {
	let path = appDir + "/package.json";
	if(!file.isExists(path)) return null;
	return JSON.parse(file.read(path).toString());
}
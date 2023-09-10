import { existsSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync } from "fs";
import { output } from "../lib.js";
import { paths } from "../constraint.js";

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
	mkdir(...dir: string[]) {
		try {
			for(let x of dir) {
				if (!existsSync(x)) {
					output.log("mkdir", x)
					mkdirSync(x, {
						recursive: true,
					});
				}
			}
		} catch(e: any) {
			output.error(e.message)
		}
	}
	/**
	 * append text to file
	 */
	append(filepath: string, first: string, end: string | null = null, replace: ((text: string) => string) | null = null) {
		try {
			let text = readFileSync(filepath, "utf8").toString();
			let commit = first + (replace ? replace(text) : text) + (end || "");
			writeFileSync(filepath, commit);
			output.log(`append value from ${filepath} [${commit.length} bytes]`)
		} catch(e: any) {
			output.error(e.message)
		}
	}
	/**
	 * copy file
	 */
	copy(copy: string, dir: string) {
		try {
			copyFileSync(copy, dir);
			return output.log("copied to", dir)
		} catch(e: any) {
			output.error(e.message)
		}
	}
	/**
	 * copy file on array
	 */
	copyBulk(...data: string[][]) {
		for(let x of data) {
			this.copy(x[0], x[1]);
		}
	}
	/**
	 * write file
	 */
	write(dir: string, val: string) {
		try {
			writeFileSync(dir, val);
			return output.log("write", dir)
		} catch(e: any) {
			output.error(e.message)
		}
	}
	/**
	 * read file
	 */
	read(dir: string) {
		return readFileSync(dir, "utf8").toString();
	}
	/**
	 * clear file/folder on recursive
	 */
	rm(dir: string) {
		try {
			rmSync(dir, { recursive: true, force: true });
			return output.log("rm", dir)
		} catch(e: any) {
			output.error(e.message)
		}
	}
	/**
	 * exists file
	 */
	isExists(dir: string) {
		return existsSync(dir);
	}
}

/**
 * file instance
 */
export const file = new File();

/**
 * read package.json with parsing to object
 */
export function readPackageJson(appDir: string) {
	let path = appDir + "/package.json";
	if(!file.isExists(path)) return null;
	return JSON.parse(file.read(path));
}

/**
 * if name include "/", make dir
 */
export function makeRecursiveFolder(nameDir: string, dir: string, name: string) {
  if(name.includes("/")) {
    let path = (name.startsWith("/") ? "": "/") + name.split("/").slice(0, -1).join("/")
    file.mkdir(paths.directory[nameDir]([path], dir))
  }
}

/**
 * check project is typescript or not
 */
export function isTypescript(appDir: string) {
	return file.isExists(appDir + "/tsconfig.json")
}
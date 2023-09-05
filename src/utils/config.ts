import file from "./file.js";
import { paths } from "../constraint.js"

type ConfigType = {
	app_path: string,
	app_active: string,
	mode: number,
	library: { name: string, active: boolean, path: string }[]
}

class Config {
	path = paths.root + "/config.json"
	read(): ConfigType {
		return JSON.parse(file.read(this.path))
	}
	update(value: ConfigType) {
		file.write(this.path, JSON.stringify(value, null, 4))
	}
	getFullPathApp(value: ConfigType, app_active?: string) {
		return value.app_path + "/" + (app_active ? app_active: value.app_active)
	}
}

const config = new Config()

export default config
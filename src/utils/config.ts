import { file } from "./file.js";
import { paths } from "../constraint.js"

export type ConfigType = {
	app_path: string,
	app_active: string,
	mode: number,
	library: { name: string, active: boolean, path: string }[]
}

class Config {
	path = paths.root + "/config.json"
	/**
	 * read config.json
	 * @return ConfigType
	 */
	read(): ConfigType {
		return JSON.parse(file.read(this.path))
	}
	/**
	 * update config.json
	 */
	update(value: ConfigType) {
		file.write(this.path, JSON.stringify(value, null, 4))
	}
	/**
	 * @return app_path + app_active
	 */
	getFullPathApp(value: ConfigType, app_active?: string) {
		return value.app_path + "/" + (app_active ? app_active: value.app_active)
	}
}

const config = new Config()

export default config
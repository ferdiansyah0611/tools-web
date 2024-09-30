import { file } from "./file.js";
import { paths } from "../constraint.js";
import { watchFile } from "node:fs";
import input from "./input.js";

export type ConfigType = {
  app_path: string;
  app_active: string;
  mode: number;
  library: { name: string; active: boolean; path: string }[];
};
interface ConfigInterface {
  /**
   * /path/to/config.json
   */
  path: string;
  /**
   * value of config.json in realtime
   */
  value: ConfigType;
  pathApp?: string[];

  read(): ConfigType;
  update(value: ConfigType): void;
  getFullPathApp(
    value: ConfigType,
    app_active?: string,
    isArray?: boolean,
  ): string[];
}

class Config implements ConfigInterface {
  /**
   * /path/to/config.json
   */
  path = paths.root + "/config.json";
  /**
   * value of config.json in realtime
   */
  value: ConfigType = {
    app_path: "",
    app_active: "",
    mode: 1,
    library: []
  };
  pathApp: string[] = [];

  constructor() {
    if(!file.isExists(this.path)) {
      this.update({
        app_path: "./app",
        app_active: "my_app",
        library: [],
        mode: 1
      })
    }
    const listener = (curr?: any) => {
      this.value = this.read();

      let pathApp = this.getFullPathApp(this.value, "", true);
      if (Array.isArray(pathApp)) this.pathApp = pathApp;
      if (curr) input.rl.write("reload config.json\n");
    };

    listener();
    watchFile(paths.root + "/config.json", listener);
  }
  /**
   * read config.json
   * @return ConfigType
   */
  read(): ConfigType {
    return JSON.parse(file.read(this.path));
  }
  /**
   * update config.json
   */
  update(value: ConfigType) {
    file.write(this.path, JSON.stringify(value, null, 4));
  }
  /**
   * @return app_path + app_active
   */
  getFullPathApp(
    value: ConfigType,
    app_active?: string,
    isArray?: boolean,
  ): string[] {
    let namespace = app_active ? app_active : value.app_active;
    let current = value.app_path + "/" + namespace;
    if (isArray) {
      return [current, current.replace("/" + namespace, "\\" + namespace)];
    }
    return [current];
  }
}

const config = new Config();

export default config;

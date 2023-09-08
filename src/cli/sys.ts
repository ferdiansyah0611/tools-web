import { output, program } from "../lib.js";
import config from "../utils/config.js";
import subprocess from "../utils/subprocess.js";
import { paths } from "../constraint.js";

// app
const sys = program.command("sys").description("List system cli");
sys
  .command("app:active")
  .description("Change default active project")
  .argument("<path>", "new path active project")
  .action(changeAppActive);
sys
  .command("app:root")
  .description("Change default namespace folder")
  .argument("<path>", "new path namespace")
  .action(changeAppRoot);
sys
  .command("app:mode")
  .description("Change mode command")
  .argument("<int>", "0/1 to change mode")
  .action(changeAppMode);
sys
  .command("app:update")
  .description("Update tools-web to latest version")
  .action(appUpdate);

// package
sys
  .command("off")
  .description("Disable the package")
  .argument("<name>", "package name")
  .action(packageOff);
sys
  .command("on")
  .description("Enable the package")
  .argument("<name>", "package name")
  .action(packageOn);
sys
  .command("install")
  .description("Install the plugin")
  .argument("<name>", "package name")
  .action(packageInstall);
sys
  .command("uninstall")
  .description("Uninstall the plugin")
  .argument("<name>", "package name")
  .action(packageUninstall);

export function changeAppActive(path: string) {
  let value = config.read();
  value.app_active = path;
  config.update(value);
  output.log("config updated");
}
export function changeAppRoot(path: string) {
  let value = config.read();
  value.app_path = path;
  config.update(value);
  output.log("config updated");
}
export function changeAppMode(mode: string) {
  let value = config.read();
  value.mode = parseInt(mode);
  config.update(value);
  output.log("config updated");
}
export function appUpdate() {
  let value = config.read();
  let execute = "npm i -g tools-web";

  subprocess.run(execute, { sync: true, hideLog: true });
  config.update(value);
  output.log("Tools Web has been updated, please restart now!");
}
export function packageOff(name: string) {
  let value = config.read();
  value.library = value.library.map((lib) => {
    if (lib.name === name) {
      lib.active = false;
    }
    return lib;
  });
  config.update(value);
  output.log("package has been disabled");
}
export function packageOn(name: string) {
  let value = config.read();
  value.library = value.library.map((lib) => {
    if (lib.name === name) {
      lib.active = true;
    }
    return lib;
  });
  config.update(value);
  output.log("package has been enabled");
}
export function packageInstall(name: string) {
  let value = config.read();
  let execute = `cd ${paths} && npm i ${name}`;

  if (value.mode === 0) execute = "echo 1";
  subprocess.run(execute, { sync: true, hideLog: true });
  value.library.push({
    name,
    active: true,
    path: name,
  });
  config.update(value);
  output.log(name + " has been installed");
}
export function packageUninstall(name: string) {
  if (["express", "firebase", "react", "vite", "vue"].find((v) => v === name))
    return output.error(`the package is from system, can't do it.`);
  let value = config.read();
  let execute = `cd ${paths} && npm uninstall ${name}`;

  if (value.mode === 0) execute = "echo 1";
  subprocess.run(execute, { sync: true, hideLog: true });
  value.library = value.library.filter((lib) => lib.name !== name);
  config.update(value);
  output.log(name + " has been removed");
}

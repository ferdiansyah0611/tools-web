import { actionRunner, output, program } from "../lib.js";
import { paths } from "../constraint.js";
import { execute } from "../utils/execute.js";
import config from "../utils/config.js";

// app
const sys = program.command("sys").description("List system cli");
sys
  .command("app:active")
  .description("Change default active project")
  .argument("<path>", "new path active project")
  .action(actionRunner(changeAppActive));
sys
  .command("app:root")
  .description("Change default namespace folder")
  .argument("<path>", "new path namespace")
  .action(actionRunner(changeAppRoot));
sys
  .command("app:mode")
  .description("Change mode command")
  .argument("<int>", "0/1 to change mode")
  .action(actionRunner(changeAppMode));
sys
  .command("app:update")
  .description("Update tools-web to latest version")
  .action(actionRunner(appUpdate));

// package
sys
  .command("off")
  .description("Disable the package")
  .argument("<name>", "package name")
  .action(actionRunner(packageOff));
sys
  .command("on")
  .description("Enable the package")
  .argument("<name>", "package name")
  .action(actionRunner(packageOn));
sys
  .command("install")
  .description("Install the plugin")
  .argument("<name>", "package name")
  .action(actionRunner(packageInstall));
sys
  .command("uninstall")
  .description("Uninstall the plugin")
  .argument("<name>", "package name")
  .action(actionRunner(packageUninstall));

export async function changeAppActive(path: string) {
  let value = config.read();
  value.app_active = path;
  config.update(value);
}
export async function changeAppRoot(path: string) {
  let value = config.read();
  value.app_path = path;
  config.update(value);
}
export async function changeAppMode(mode: string) {
  let value = config.read();
  value.mode = parseInt(mode);
  config.update(value);
}
export async function appUpdate() {
  const value = config.read();
  const sub = execute("npm i -g tools-web", {});

  sub.doSync();
  config.update(value);
}
export async function packageOff(name: string) {
  let value = config.read();
  value.library = value.library.map((lib) => {
    if (lib.name === name) {
      lib.active = false;
    }
    return lib;
  });
  config.update(value);
}
export async function packageOn(name: string) {
  let value = config.read();
  value.library = value.library.map((lib) => {
    if (lib.name === name) {
      lib.active = true;
    }
    return lib;
  });
  config.update(value);
}
export async function packageInstall(name: string) {
  const value = config.read();
  const sub = execute(`cd ${paths} && npm i ${name}`, {});

  sub.changeEcho(value);
  sub.doSync();

  value.library.push({
    name,
    active: true,
    path: name,
  });
  config.update(value);
}
export async function packageUninstall(name: string) {
  if (
    [
      "express",
      "firebase",
      "react",
      "sys",
      "tailwind",
      "tools",
      "vite",
      "vue",
    ].find((v) => v === name)
  ) {
    return output.error(`the package is from system, can't do it.`);
  }

  const value = config.read();
  const sub = execute(`cd ${paths} && npm uninstall ${name}`, {});

  sub.changeEcho(value);
  sub.doSync();

  value.library = value.library.filter((lib) => lib.name !== name);
  config.update(value);
}

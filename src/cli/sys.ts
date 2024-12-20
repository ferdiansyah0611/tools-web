import { input, output, program } from "../lib.js";
import { paths } from "../constraint.js";
import { execute } from "../utils/execute.js";
import config from "../utils/config.js";

program
  .command("exit", "exit the command")
  .action(exitCommand)
  .hide()

  .command("tw active", "Change default active project")
  .argument("<path>", "new path active project")
  .action(changeAppActive)
  .hide()

  .command("tw root", "Change default namespace folder")
  .argument("<path>", "new path namespace")
  .action(changeAppRoot)
  .hide()

  .command("tw mode", "Change mode command")
  .argument("<mode>", "0/1 to change mode", { validator: ["d", "p"] })
  .action(changeAppMode)
  .hide()

  .command("tw update", "Update tools-web to latest version")
  .action(appUpdate)
  .hide()

  .command("twx off", "Disable the package")
  .argument("<name>", "package name")
  .action(packageOff)
  .hide()

  .command("twx on", "Enable the package")
  .argument("<name>", "package name")
  .action(packageOn)
  .hide()

  .command("twx install", "Install the plugin")
  .argument("<name>", "package name")
  .action(packageInstall)
  .hide()

  .command("twx uninstall", "Uninstall the plugin")
  .argument("<name>", "package name")
  .action(packageUninstall)
  .hide()

  .command("twp install", "Install the repository")
  .argument("<name>", "repository name")
  .action(repositoryInstall)
  .hide()

  .command("twp uninstall", "Uninstall the repository")
  .argument("<name>", "repository name")
  .action(repositoryUninstall)
  .hide();

export function exitCommand() {
  output.log("Process Terminated");
  input.close();
  process.exit(1);
}
export function changeAppActive({ args }: any) {
  let value = config.value;
  value.app_active = args.path.replace('%', ' ');
  config.update(value);
}
export function changeAppRoot({ args }: any) {
  let value = config.value;
  value.app_path = args.path.replace('%', ' ');
  config.update(value);
}
export function changeAppMode({ args }: any) {
  let value = config.value;
  value.mode = args.mode === "d" ? 0 : 1;
  config.update(value);
}
export function appUpdate() {
  const value = config.value;
  const sub = execute("npm i -g tools-web", {});

  sub.doSync();
  config.update(value);
}
export function packageOff({ args }: any) {
  let value = config.value;
  value.library = value.library.map((lib) => {
    if (lib.name === args.name) {
      lib.active = false;
    }
    return lib;
  });
  config.update(value);
}
export function packageOn({ args }: any) {
  let value = config.value;
  value.library = value.library.map((lib) => {
    if (lib.name === args.name) {
      lib.active = true;
    }
    return lib;
  });
  config.update(value);
}
export function packageInstall({ args }: any) {
  const value = config.value;
  const sub = execute(`cd ${paths} && npm i ${args.name}`, {});

  sub.changeEcho(value);
  sub.doSync();

  value.library.push({
    name: args.name,
    active: true,
    path: args.name,
  });
  config.update(value);
}
export function packageUninstall({ args }: any) {
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
    ].find((v) => v === args.name)
  ) {
    return output.error(`the package is from system, can't do it.`);
  }

  const value = config.value;
  const sub = execute(`cd ${paths} && npm uninstall ${args.name}`, {});

  sub.changeEcho(value);
  sub.doSync();

  value.library = value.library.filter((lib) => lib.name !== args.name);
  config.update(value);
}

export function repositoryInstall({ args }: any) {
  const value = config.value;

  value.repository.push({
    name: args.name,
    active: true,
    path: "./src/repository/" + args.name + "/index.js",
  });
  config.update(value);
}
export function repositoryUninstall({ args }: any) {
  const value = config.value;

  value.repository = value.library.filter((lib) => lib.name !== args.name);
  config.update(value);
}
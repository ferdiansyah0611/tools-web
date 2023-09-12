import { input, output, program } from "../lib.js";
import { paths } from "../constraint.js";
import { execute } from "../utils/execute.js";
import config from "../utils/config.js";

program
  .command("exit", "exit the command")
  .action(() => {
    output.log("Process Terminated");
    input.close();
    process.exit(1);
  })
  .hide()

  .command("sys app:active", "Change default active project")
  .argument("<path>", "new path active project")
  .action(changeAppActive)
  .hide()

  .command("sys app:root", "Change default namespace folder")
  .argument("<path>", "new path namespace")
  .action(changeAppRoot)
  .hide()

  .command("sys app:mode", "Change mode command")
  .argument("<mode>", "0/1 to change mode", { validator: program.NUMBER })
  .action(changeAppMode)
  .hide()

  .command("sys app:update", "Update tools-web to latest version")
  .action(appUpdate)
  .hide()

  .command("sys off", "Disable the package")
  .argument("<name>", "package name")
  .action(packageOff)
  .hide()

  .command("sys on", "Enable the package")
  .argument("<name>", "package name")
  .action(packageOn)
  .hide()

  .command("sys install", "Install the plugin")
  .argument("<name>", "package name")
  .action(packageInstall)
  .hide()

  .command("sys uninstall", "Uninstall the plugin")
  .argument("<name>", "package name")
  .action(packageUninstall)
  .hide();

export async function changeAppActive({ args }: any) {
  let value = config.read();
  value.app_active = args.path;
  config.update(value);
}
export async function changeAppRoot({ args }: any) {
  let value = config.read();
  value.app_path = args.path;
  config.update(value);
}
export async function changeAppMode({ args }: any) {
  let value = config.read();
  value.mode = parseInt(args.mode);
  config.update(value);
}
export async function appUpdate() {
  const value = config.read();
  const sub = execute("npm i -g tools-web", {});

  sub.doSync();
  config.update(value);
}
export async function packageOff({ args }: any) {
  let value = config.read();
  value.library = value.library.map((lib) => {
    if (lib.name === args.name) {
      lib.active = false;
    }
    return lib;
  });
  config.update(value);
}
export async function packageOn({ args }: any) {
  let value = config.read();
  value.library = value.library.map((lib) => {
    if (lib.name === args.name) {
      lib.active = true;
    }
    return lib;
  });
  config.update(value);
}
export async function packageInstall({ args }: any) {
  const value = config.read();
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
export async function packageUninstall({ args }: any) {
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

  const value = config.read();
  const sub = execute(`cd ${paths} && npm uninstall ${args.name}`, {});

  sub.changeEcho(value);
  sub.doSync();

  value.library = value.library.filter((lib) => lib.name !== args.name);
  config.update(value);
}

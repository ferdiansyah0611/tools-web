import { paths } from "../constraint.js";
import { program, output } from "../lib.js";
import { file, readPackageJson } from "../utils/file.js";
import { execute } from "../utils/execute.js";
import config from "../utils/config.js";

program
  .command("tailwind create", "Add tailwindcss to project")
  .action(addTailwind)

  .command("tailwind add:daisyui", "Project integration with Daisy UI")
  .action(addDaisyUI)

  .command("tailwind add:headlessui", "Project integration with Headless UI")
  .action(addHeadlessUI)

  .command("tailwind add:flowbite", "Project integration with Flowbite")
  .action(addFlowbite);

export async function addTailwind(): Promise<any> {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(
    `cd ${dir} && npm install -D tailwindcss postcss autoprefixer sass --save && npx tailwindcss init -p`,
    {},
  );

  sub.changeEcho(value);
  sub.doSync();

  let isJsx = file.isExists("/src/main.jsx");
  let isJs = file.isExists("/src/main.js");
  if (isJsx || isJs) {
    let target = "/src/main.js" + (isJsx ? "x" : "");
    let code = file.read(target);
    file.write(target, "import './tailwind.sass'\n" + code);
  }
  file.copyBulk(
    [paths.data.tailwind + "tailwind.sass", dir + "/src/tailwind.sass"],
    [paths.data.tailwind + "tailwind.config.cjs", dir + "/tailwind.config.cjs"],
  );
}

export async function addDaisyUI(): Promise<any> {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(`cd ${dir} && npm i -D daisyui@latest`, {});

  sub.changeEcho(value);
  sub.doSync();

  let tailwindConfig = dir + "/tailwind.config.cjs";
  if (!file.isExists(tailwindConfig))
    return output.error(tailwindConfig + " not exists");

  let code = file
    .read(tailwindConfig)
    .replace("plugins: [", 'plugins: [ require("daisyui"), ');
  file.write(tailwindConfig, code);
}

export async function addHeadlessUI(): Promise<any> {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(`cd ${dir}`, {});
  const packageJson = readPackageJson(dir);

  if (!packageJson || !packageJson.dependencies) return;
  sub.changeOnProduction(value, (current) => {
    if (packageJson.dependencies.react) {
      current += " && npm install @headlessui/react";
    } else if (packageJson.dependencies.vue) {
      current += " && npm install @headlessui/vue";
    }
    return current;
  });
  sub.changeEcho(value);
  sub.doSync();
}

export async function addFlowbite(): Promise<any> {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(`cd ${dir} && npm install flowbite`, {});

  sub.changeEcho(value);
  sub.doSync();

  let tailwindConfig = dir + "/tailwind.config.cjs";
  if (!file.isExists(tailwindConfig))
    return output.error(tailwindConfig + " not exists");

  let code = file
    .read(tailwindConfig)
    .replace("plugins: [", 'plugins: [ require("flowbite/plugin"), ')
    .replace("content: [", 'content: [ "./node_modules/flowbite/**/*.js", ');
  file.write(tailwindConfig, code);
  output.log(
    "Don`t forget to add code on the <body> '<script src=\"../path/to/flowbite/dist/flowbite.min.js\"></script>'",
  );
}

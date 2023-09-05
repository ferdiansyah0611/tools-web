import { SpawnSyncReturns } from "child_process";
import { paths } from "../constraint.js";
import { program, output } from "../lib.js";
import config from "../utils/config.js";
import file, { readPackageJson } from "../utils/file.js";
import subprocess from "../utils/subprocess.js";

const tailwind = program
  .command("tailwind")
  .description("List tailwindcss cli");
tailwind
  .command("create")
  .description("Add tailwindcss to project")
  .action(addTailwind);
tailwind
  .command("add:daisyui")
  .description("Project integration with Daisy UI")
  .action(addDaisyUI);
tailwind
  .command("add:headlessui")
  .description("Project integration with Headless UI")
  .action(addHeadlessUI);
tailwind
  .command("add:flowbite")
  .description("Project integration with Flowbite")
  .action(addFlowbite);

export async function addTailwind(): Promise<any> {
  const task = output.task("Install Package");
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install -D tailwindcss postcss autoprefixer sass --save && npx tailwindcss init -p`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideLog: true,
  });
  if (result.stderr.byteLength) return subprocess.error(task, result);

  task.done().next("Generate Code");

  let isJsx = file.isExists("/src/main.jsx");
  let isJs = file.isExists("/src/main.js");
  if (isJsx || isJs) {
    let target = "/src/main.js" + (isJsx ? "x" : "");
    let code = file.read(target).toString();
    file.write(target, "import './tailwind.sass'\n" + code);
  }

  file.copy(paths.data.tailwind + "tailwind.sass", dir + "/src/tailwind.sass");
  file.copy(
    paths.data.tailwind + "tailwind.config.cjs",
    dir + "/tailwind.config.cjs",
  );
  task.done();
}

export async function addDaisyUI(): Promise<any> {
  const task = output.task("Install Package");
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm i -D daisyui@latest`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideLog: true,
  });
  if (result.stderr.byteLength) return subprocess.error(task, result);

  let tailwindConfig = dir + "/tailwind.config.cjs";
  if (!file.isExists(tailwindConfig)) return task.fail();

  let code = file
    .read(tailwindConfig)
    .toString()
    .replace("plugins: [", 'plugins: [ require("daisyui"), ');
  file.write(tailwindConfig, code);
  task.done();
}

export async function addHeadlessUI(): Promise<any> {
  const task = output.task("Install Package");
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir}`;
  let packageJson = readPackageJson(dir);
  if (!packageJson || !packageJson.dependencies) return task.fail();
  if (packageJson.dependencies.react) {
    execution += " && npm install @headlessui/react";
  } else if (packageJson.dependencies.vue) {
    execution += " && npm install @headlessui/vue";
  }

  if (value.mode === 0) execution = "echo 1";
  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideLog: true,
  });
  if (result.stderr.byteLength) return subprocess.error(task, result);
  task.done();
}

export async function addFlowbite(): Promise<any> {
  const task = output.task("Install Package");
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install flowbite`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideLog: true,
  });
  if (result.stderr.byteLength) return subprocess.error(task, result);

  let tailwindConfig = dir + "/tailwind.config.cjs";
  if (!file.isExists(tailwindConfig)) return task.fail();

  let code = file
    .read(tailwindConfig)
    .toString()
    .replace("plugins: [", 'plugins: [ require("flowbite/plugin"), ')
    .replace("content: [", 'content: [ "./node_modules/flowbite/**/*.js", ');
  file.write(tailwindConfig, code);
  task.done();
  output.log(
    'Don`t forget to add code on the <body> `<script src="../path/to/flowbite/dist/flowbite.min.js"></script>`',
  );
}

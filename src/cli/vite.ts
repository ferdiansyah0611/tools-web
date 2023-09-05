import { SpawnSyncReturns } from "child_process";
import { paths } from "../constraint.js";
import { program, output, Option } from "../lib.js";
import config from "../utils/config.js";
import file from "../utils/file.js";
import subprocess from "../utils/subprocess.js";

const configure = {
  list: {
    template: [
      "vanilla",
      "vue",
      "react",
      "preact",
      "lit",
      "svelte",
      "solid",
      "qwik",
    ],
  },
};
const vite = program.command("vite").description("List vite cli");
vite
  .command("make:project")
  .description("Create new vite project")
  .argument("<name>", "project name")
  .addOption(
    new Option("--template <name>", "template name")
      .choices(configure.list.template)
      .makeOptionMandatory(),
  )
  .option("--ts", "enable typescript")
  .action(makeProject);

export async function makeProject(name: string, option: any) {
  const task = output.task("Checking NPM...");
  const value = config.read();
  const dir = config.getFullPathApp(value, name);

  file.rm(dir);
  try {
    let execution = `cd ${value.app_path} && npm create vite@latest ${name} --template ${option.template}`;
    if (option.ts) execution += "-ts";
    // check version npm
    let npm: SpawnSyncReturns<Buffer> = subprocess.run("npm --version", {
      sync: true,
      hideLog: true,
    });
    let npmVersion = npm.stdout.toString();
    if (npm.stderr.byteLength) return subprocess.error(task, npm);
    // npm version <= 6
    if (![0, 1, 2, 3, 4, 5, 6].find((v) => String(v) === npmVersion[0])) {
      execution = execution.replace("--template", "-- --template");
    }
    // installing
    if (value.mode === 1) {
      execution += ` && cd ${name} && npm i`;
      // react
      if (option.template === "react") {
        execution +=
          " && npm i @reduxjs/toolkit react-redux react-router-dom axios";
      }
    }
    task.done("Using NPM v" + npmVersion.slice(0, -1)).next("Install Package");
    let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
      sync: true,
      hideLog: true,
    });
    task.done().next("Generate Code");
    if (result.stderr.byteLength) return subprocess.error(task, result);
    // generate code
    if (option.template === "react") {
      file.mkdir(paths.directory.service([], dir));
      file.mkdir(paths.directory.style([], dir));
      file.mkdir(paths.directory.component([], dir));
      file.mkdir(paths.directory.store([], dir));
      file.mkdir(paths.directory.route([], dir));
      file.copy(
        paths.data.react + "route/index.jsx",
        paths.directory.route(["index.jsx"], dir),
      );
      file.copy(
        paths.data.react + "route/Home.jsx",
        paths.directory.route(["Home.jsx"], dir),
      );
      file.copy(
        paths.data.react + "route/About.jsx",
        paths.directory.route(["About.jsx"], dir),
      );
      file.copy(
        paths.data.react + "service/auth.js",
        paths.directory.service(["auth.js"], dir),
      );
      file.copy(
        paths.data.react + "service/http.js",
        paths.directory.service(["http.js"], dir),
      );
      file.copy(
        paths.data.react + "store/index.js",
        paths.directory.store(["index.js"], dir),
      );
      file.copy(
        paths.data.react + "store/app.js",
        paths.directory.store(["app.js"], dir),
      );
      file.copy(
        paths.data.react + "component/template.jsx",
        paths.directory.component(["template.jsx"], dir),
      );
      file.copy(
        paths.data.react + "App.jsx",
        paths.directory.src(["App.jsx"], dir),
      );
      file.copy(
        paths.data.react + "main.jsx",
        paths.directory.src(["main.jsx"], dir),
      );
    } else if (option.template === "vue") {
      file.mkdir(paths.directory.route([], dir));
      file.mkdir(paths.directory.store([], dir));
      file.copy(
        paths.data.vue + "router.js",
        paths.directory.route(["index.js"], dir),
      );
      file.copy(
        paths.data.vue + "Home.vue",
        paths.directory.route(["Home.vue"], dir),
      );
      file.copy(
        paths.data.vue + "storeindex.js",
        paths.directory.store(["index.js"], dir),
      );
      file.copy(
        paths.data.vue + "App.vue",
        paths.directory.src(["App.vue"], dir),
      );
      file.copy(
        paths.data.vue + "main.js",
        paths.directory.src(["main.js"], dir),
      );
    }
    // update file
    let code = file.read(paths.data.vite + "vite.config.js").toString();
    code = code.replaceAll("react", option.template);
    file.write(dir + "/vite.config.js", code);
    file.write(
      dir + "/vercel.json",
      '{ "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }] }',
    );
    task.done();
  } catch (e: any) {
    task.fail("Error: " + e.message);
  }
}

export async function addTailwind(option: any) {
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
  let target = dir + (option.react ? "/src/main.jsx" : "/src/main.js");
  let code = file.read(target).toString();
  file.write(target, "import './tailwind.sass'\n" + code);
  file.copy(paths.data.tailwind + "tailwind.sass", dir + "/src/tailwind.sass");
  file.copy(
    paths.data.tailwind + "tailwind.config.cjs",
    dir + "/tailwind.config.cjs",
  );
  task.done();
}

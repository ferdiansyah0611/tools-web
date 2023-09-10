import { SpawnSyncReturns } from "child_process";
import { paths } from "../constraint.js";
import { program, Option } from "../lib.js";
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
  const value = config.read();
  const dir = config.getFullPathApp(value, name);

  file.rm(dir);

  let execution = `cd ${value.app_path} && npm create vite@latest ${name} --template ${option.template}`;
  if (option.ts) execution += "-ts";
  // check version npm
  let npm: SpawnSyncReturns<Buffer> = subprocess.run("npm --version", {
    sync: true,
    hideStdout: true,
  });
  let npmVersion = npm.stdout.toString();
  if (npm.stderr.byteLength) return subprocess.error(npm);
  // npm version <= 6
  if (![0, 1, 2, 3, 4, 5, 6].find((v) => String(v) === npmVersion[0])) {
    execution = execution.replace("--template", "-- --template");
  }
  // installing
  if (value.mode === 1) {
    execution += ` && cd ${name} && npm i axios`;
    // react
    if (option.template === "react") {
      execution += " && npm i axios";
    }
  }
  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  // generate code
  if (option.template === "react") {
    file.mkdir(paths.directory.service([], dir));
    file.mkdir(paths.directory.style([], dir));
    file.mkdir(paths.directory.component([], dir));
    file.mkdir(paths.directory.store([], dir));
    file.mkdir(paths.directory.route([], dir));
    file.copy(
      paths.data.react + "service/auth.js",
      paths.directory.service(["auth.js"], dir),
    );
    file.copy(
      paths.data.react + "service/http.js",
      paths.directory.service(["http.js"], dir),
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
}

export async function addTailwind(option: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install -D tailwindcss postcss autoprefixer sass --save && npx tailwindcss init -p`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);

  let target = dir + (option.react ? "/src/main.jsx" : "/src/main.js");
  let code = file.read(target).toString();
  file.write(target, "import './tailwind.sass'\n" + code);
  file.copy(paths.data.tailwind + "tailwind.sass", dir + "/src/tailwind.sass");
  file.copy(
    paths.data.tailwind + "tailwind.config.cjs",
    dir + "/tailwind.config.cjs",
  );
}

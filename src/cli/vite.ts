import { paths } from "../constraint.js";
import { program, Option, actionRunner } from "../lib.js";
import { file } from "../utils/file.js";
import { execute } from "../utils/execute.js";
import config from "../utils/config.js";

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
  .action(actionRunner(makeProject));

export async function makeProject(name: string, option: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value, name);
  const sub = execute(
    `cd ${value.app_path} && npm create vite@latest ${name} --template ${option.template}`,
    {},
  );

  file.rm(dir);
  sub.change((current) => (option.ts ? (current += "-ts") : current));
  // check version npm
  const npm = execute("npm --version", {}).doSync().stdout.toString();
  // npm version <= 6
  if (![0, 1, 2, 3, 4, 5, 6].find((v) => String(v) === npm[0])) {
    sub.change((current) => current.replace("--template", "-- --template"));
  }
  // installing
  sub.changeOnProduction(value, (current) => {
    current += ` && cd ${name} && npm i axios`;
    // react
    if (option.template === "react") {
      current += " && npm i axios";
    }
    return current;
  });
  sub.doSync();
  // generate code
  if (option.template === "react") {
    file.mkdir(
      paths.directory.service([], dir),
      paths.directory.style([], dir),
      paths.directory.component([], dir),
      paths.directory.store([], dir),
      paths.directory.route([], dir),
    );
    file.copyBulk(
      [
        paths.data.react + "service/auth.js",
        paths.directory.service(["auth.js"], dir),
      ],
      [
        paths.data.react + "service/http.js",
        paths.directory.service(["http.js"], dir),
      ],
    );
  } else if (option.template === "vue") {
    file.mkdir(paths.directory.route([], dir), paths.directory.store([], dir));
    file.copyBulk(
      [paths.data.vue + "router.js", paths.directory.route(["index.js"], dir)],
      [paths.data.vue + "Home.vue", paths.directory.route(["Home.vue"], dir)],
      [
        paths.data.vue + "storeindex.js",
        paths.directory.store(["index.js"], dir),
      ],
      [paths.data.vue + "App.vue", paths.directory.src(["App.vue"], dir)],
      [paths.data.vue + "main.js", paths.directory.src(["main.js"], dir)],
    );
  }
  // update file
  let code = file.read(paths.data.vite + "vite.config.js");
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
  const sub = execute(
    `cd ${dir} && npm install -D tailwindcss postcss autoprefixer sass --save && npx tailwindcss init -p`,
    {},
  );

  sub.changeEcho(value);
  sub.doSync();

  let target = dir + (option.react ? "/src/main.jsx" : "/src/main.js");
  let code = file.read(target);
  file.write(target, "import './tailwind.sass'\n" + code);
  file.copyBulk(
    [paths.data.tailwind + "tailwind.sass", dir + "/src/tailwind.sass"],
    [paths.data.tailwind + "tailwind.config.cjs", dir + "/tailwind.config.cjs"],
  );
}

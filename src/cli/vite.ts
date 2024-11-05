import { paths } from "../constraint.js";
import { program } from "../lib.js";
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

program
  .command("vite make:project", "Create new vite project")
  .argument("<name>", "project name")
  .option("--template <name>", "template name", {
    required: true,
    validator: configure.list.template,
  })
  .option("--ts", "enable typescript")
  .action(makeProject);

export async function makeProject({ args, options }: any) {
  const value = config.value;
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${value.app_path} && npx create-vite@latest ${args.name} --template ${options.template}`,
    {},
  );

  file.rm(dir);
  sub.change((current) => (options.ts ? (current += "-ts") : current));
  // check version npm
  const npm = execute("npm --version", {}).doSync().stdout.toString();
  // npm version <= 6
  if (![0, 1, 2, 3, 4, 5, 6].find((v) => String(v) === npm[0])) {
    sub.change((current) => current.replace("--template", "-- --template"));
  }
  // installing
  sub.changeOnProduction(value, (current) => {
    current += ` && cd ${args.name} && npm i axios`;
    // react
    if (options.template === "react") {
      current += " && npm i axios";
    }
    return current;
  });
  sub.doSync();
  // generate code
  if (options.template === "react") {
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
  }
  // update file
  let code = file.read(paths.data.vite + "vite.config.js");
  code = code.replaceAll("react", options.template);
  file.write(dir + "/vite.config.js", code);
  file.write(
    dir + "/vercel.json",
    '{ "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }] }',
  );
}

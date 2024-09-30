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
  const sub = execute(
    `cd ${value.app_path} && npx create-vite@latest ${args.name} --template ${options.template}`,
    {},
  );

  file.rm(config.pathApp[0]);
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
      paths.directory.service([], config.pathApp[0]),
      paths.directory.style([], config.pathApp[0]),
      paths.directory.component([], config.pathApp[0]),
      paths.directory.store([], config.pathApp[0]),
      paths.directory.route([], config.pathApp[0]),
    );
    file.copyBulk(
      [
        paths.data.react + "service/auth.js",
        paths.directory.service(["auth.js"], config.pathApp[0]),
      ],
      [
        paths.data.react + "service/http.js",
        paths.directory.service(["http.js"], config.pathApp[0]),
      ],
    );
  } else if (options.template === "vue") {
  }
  // update file
  let code = file.read(paths.data.vite + "vite.config.js");
  code = code.replaceAll("react", options.template);
  file.write(config.pathApp[0] + "/vite.config.js", code);
  file.write(
    config.pathApp[0] + "/vercel.json",
    '{ "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }] }',
  );
}

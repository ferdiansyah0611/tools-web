import { SpawnSyncReturns } from "child_process";
import { paths } from "../constraint.js";
import { program, output, Option } from "../lib.js";
import { generate } from "../utils/style.js";
import { toUpperFirst, getCaseName } from "../utils/text.js";
import subprocess from "../utils/subprocess.js";
import config from "../utils/config.js";
import file from "../utils/file.js";

const configure = {
  list: {
    style: ["css", "sass", "scss"],
  },
};
const react = program.command("react").description("List react.js cli");
react
  .command("add:mui")
  .description("Project integration with Material UI")
  .action(addMUI);
react
  .command("add:antd")
  .description("Project integration with Ant Design")
  .action(addAntd);
react
  .command("make:component")
  .description("Generate component")
  .argument("<name>", "component name")
  .option("--ts", "typescript mode")
  .addOption(
    new Option("--style <name>", "style name").choices(configure.list.style),
  )
  .action(makeComponent);
react
  .command("make:route")
  .description("Generate route pages")
  .argument("<name>", "component name")
  .argument("<url>", "path url")
  .option("--ts", "typescript mode")
  .addOption(
    new Option("--style <name>", "style name").choices(configure.list.style),
  )
  .action(makeRoute);
react
  .command("make:toolkit")
  .description("Generate store redux toolkit")
  .argument("<name>", "store name")
  .addOption(
    new Option("--type <string>", "type store name").choices([
      "async",
      "reducer",
    ]),
  )
  .addOption(new Option("--url <string>", "URL API [async]"))
  .action(makeStore);

export async function addMUI() {
  const task = output.task("Installing...");
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material --save`;
  if (value.mode === 0) execution = "echo 1";
  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideLog: true,
  });
  if (result.stderr.byteLength) return subprocess.error(task, result);
  file.copy(
    paths.data.react + "store/theme.js",
    paths.directory.store(["theme.js"], dir),
  );
  file.copy(
    paths.data.react + "mui.jsx",
    paths.directory.src(["mui.jsx"], dir),
  );
  file.copy(
    paths.data.react + "service/color.js",
    paths.directory.service(["color.js"], dir),
  );
  task.done("Installed");
}
export async function addAntd() {
  const task = output.task("Installing...");
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install antd --save`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideLog: true,
  });
  if (result.stderr.byteLength) return subprocess.error(task, result);
  file.append(
    paths.directory.src(["index.css"], dir),
    "@import '../node_modules/antd/dist/antd.css';\n",
  );
  task.done("Installed");
}
export function makeComponent(name: string, option: any) {
  const task = output.task("Generating...");
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const fixName = getCaseName(String(toUpperFirst(name)));
  const format = fixName + (option.ts ? ".tsx" : ".jsx");

  file.mkdir(paths.directory.component([], dir));

  let code = file
    .read(paths.data.react + "component.jsx")
    .toString()
    .replaceAll("$name", getCaseName(name));
  if (option.style) {
    let style = generate(fixName, "component", option.style, dir);
    if (style) code = `import styled from '@style/component/${style}'\n` + code;
  }
  file.write(paths.directory.component([format], dir), code);
  task.done("Generated");
}
export function makeRoute(name: string, url: string, option: any) {
  const task = output.task("Generating...");
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const fixName = getCaseName(String(toUpperFirst(name)));
  const format = fixName + (option.ts ? ".tsx" : ".jsx");

  let code = file
    .read(paths.data.react + "route.jsx")
    .toString()
    .replaceAll("$name", getCaseName(name));
  if (option.style) {
    let style = generate(fixName, "route", option.style, dir);
    if (style) code = `import styled from '@style/route/${style}'\n` + code;
  }

  file.mkdir(paths.directory.route([], dir));
  file.write(paths.directory.route([format], dir), code);

  let virtual = `import ${fixName} from '@route/${fixName}'`,
    routeIndex = paths.directory.route(["index.jsx"], dir),
    check = file.read(routeIndex).toString().indexOf(virtual) === -1;
  if (check) {
    file.append(routeIndex, "", null, (text: string) =>
      text
        .replace(
          "// dont remove this comment 1",
          `// dont remove this comment 1\n${virtual}`,
        )
        .replace(
          "{/*dont remove this comment 2*/}",
          `{/*dont remove this comment 2*/}\n\t\t\t\t\t<Route path="${url}" element={<${fixName}/>}/>`,
        ),
    );
  }
  task.done("Generated");
}
export function makeStore(name: string, option: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let fixName = getCaseName(String(toUpperFirst(name)));
  let format = fixName + ".js";
  let code = "";
  let $name = fixName.toLowerCase();

  name = getCaseName(name);
  if (option.type === "async") {
    const url: any = option.url || "http://localhost:8000/api/user";
    code = file
      .read(paths.data.react + "store-crud.js")
      .toString()
      .replaceAll("$name", $name)
      .replaceAll("$url", url);
  } else if (option.type === "reducer") {
    const text = file.read(paths.data.react + "store-crud-reducer.js");
    code = text
      .toString()
      .replaceAll("$name", $name)
      .replaceAll("$reducer", fixName)
      .replaceAll(
        "// import",
        `// import {handle${fixName}, reset${fixName}, create${fixName}, findOne${fixName}, update${fixName}, remove${fixName}} from @store/${name}`,
      );
  } else {
    const text = file.read(paths.data.react + "store.js");
    code = text.toString().replaceAll("$name", $name);
  }

  const task = output.task("Generating...");
  let storeIndex = paths.directory.store(["index.js"], dir);
  let virtual = `import ${$name}Reducer from './${$name}'`;

  let check = file.read(storeIndex).toString().indexOf(virtual) === -1;
  if (check) {
    file.append(storeIndex, "", null, (text: string) =>
      text
        .replace(
          "// dont remove this comment 1",
          `// dont remove this comment 1\n${virtual}`,
        )
        .replace("reducer: {", `reducer: {\n\t\t${name}: ${name}Reducer,`),
    );
  }
  file.write(paths.directory.store([format], dir), code);
  task.done("Done");
}

import { SpawnSyncReturns } from "child_process";
import { paths } from "../constraint.js";
import { program, Option } from "../lib.js";
import { generate } from "../utils/style.js";
import { compactName } from "../utils/text.js";
import subprocess from "../utils/subprocess.js";
import config from "../utils/config.js";
import file, { isTypescript, makeRecursiveFolder } from "../utils/file.js";
import Task from "../utils/task.js";

const configure = {
  list: {
    style: ["css", "sass", "scss"],
  },
};
const react = program.command("react").description("List react.js cli");
react.command("add:mui").description("Project integration with Material UI").action(addMUI);
react.command("add:antd").description("Project integration with Ant Design").action(addAntd);
react.command("add:styled").description("Project integration with Styled Components").action(addStyled);
react
  .command("make:component")
  .description("Generate component")
  .argument("<name>", "component name")
  .addOption(new Option("--style <name>", "style name").choices(configure.list.style))
  .action(makeComponent);
react
  .command("make:route")
  .description("Generate route pages")
  .argument("<name>", "component name")
  .argument("<url>", "path url")
  .addOption(new Option("--style <name>", "style name").choices(configure.list.style))
  .action(makeRoute);
react
  .command("make:toolkit")
  .description("Generate store redux toolkit")
  .argument("<name>", "store name")
  .addOption(new Option("--type <string>", "type store name").choices(["async", "reducer"]))
  .addOption(new Option("--url <string>", "URL API [async]"))
  .action(makeStore);

export async function addMUI() {
  const task = new Task(["Read Configuration", "Execution", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  task.success(0);

  let execution = `cd ${dir} && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material --save`;
  if (value.mode === 0) execution = "echo 1";
  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  task.success(1);
  file.copy(paths.data.react + "store/theme.js", paths.directory.store(["theme.js"], dir));
  file.copy(paths.data.react + "mui.jsx", paths.directory.src(["mui.jsx"], dir));
  file.copy(paths.data.react + "service/color.js", paths.directory.service(["color.js"], dir));
  task.success(2);
}
export async function addAntd() {
  const task = new Task(["Read Configuration", "Execution", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  task.success(0);

  let execution = `cd ${dir} && npm install antd --save`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  task.success(1);
  file.append(paths.directory.src(["index.css"], dir), "@import '../node_modules/antd/dist/antd.css';\n");
  task.success(2);
}
export function addStyled() {
  const task = new Task(["Read Configuration", "Execution"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const execute = `cd ${dir} && npm install styled-components`;

  task.success(0);
  subprocess.run(execute, { sync: true, hideStdout: true });
  task.success(1);
}
export function makeComponent(name: string, option: any) {
  const task = new Task(["Read Configuration", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, isTypescript(dir) ? ".tsx": ".jsx");

  makeRecursiveFolder("component", dir, name);
  file.mkdir(paths.directory.component([], dir));
  task.success(0);

  let code = file
    .read(paths.data.react + "component.jsx")
    .toString()
    .replaceAll("$name", compact.titleCaseWordOnly);
  if (option.style) {
    let style = generate(dir, {
      format: option.style,
      name: compact.titleCaseWordOnly,
      path: compact.folder,
      subfolder: "component",
    });
    if (style) code = `import styled from '@style/component/${style}'\n` + code;
  }
  file.write(paths.directory.component([compact.pathTitleCaseNoSeparate], dir), code);
  task.success(1);
}
export function makeRoute(name: string, url: string, option: any) {
  const task = new Task(["Read Configuration", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, isTypescript(dir) ? ".tsx": ".jsx");

  makeRecursiveFolder("route", dir, name);
  task.success(0);

  let code = file
    .read(paths.data.react + "route.jsx")
    .toString()
    .replaceAll("$name", compact.titleCaseWordOnly);
  if (option.style) {
    let style = generate(dir, {
      format: option.style,
      name: compact.titleCaseWordOnly,
      path: compact.folder,
      subfolder: "route",
    });
    if (style) code = `import styled from '@style/route/${style}'\n` + code;
  }

  file.mkdir(paths.directory.route([], dir));
  file.write(paths.directory.route([compact.pathTitleCaseNoSeparate], dir), code);

  let virtual = `import ${compact.titleCaseWordOnly} from '@route/${compact.folder}/${compact.titleCaseWordOnly}'`,
    routeIndex = paths.directory.route(["index.jsx"], dir),
    check = file.read(routeIndex).toString().indexOf(virtual) === -1;
  if (check) {
    file.append(routeIndex, "", null, (text: string) =>
      text
        .replace("// dont remove this comment 1", `// dont remove this comment 1\n${virtual}`)
        .replace(
          "{/*dont remove this comment 2*/}",
          `{/*dont remove this comment 2*/}\n\t\t\t\t\t<Route path="${url}" element={<${compact.titleCaseWordOnly}/>}/>`,
        ),
    );
  }
  task.success(1);
}
export function makeStore(name: string, option: any) {
  const task = new Task(["Read Configuration", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, ".js");

  makeRecursiveFolder("route", dir, name);
  task.success(0);

  let code = "";
  if (option.type === "async") {
    const url: any = option.url || "http://localhost:8000/api/user";
    code = file
      .read(paths.data.react + "store-crud.js")
      .toString()
      .replaceAll("$name", compact.camelCase)
      .replaceAll("$url", url);
  } else if (option.type === "reducer") {
    const text = file.read(paths.data.react + "store-crud-reducer.js");
    code = text
      .toString()
      .replaceAll("$name", compact.camelCase)
      .replaceAll("$reducer", compact.titleCaseWordOnly)
      .replaceAll(
        "// import",
        `// import {handle${compact.titleCaseWordOnly}, reset${compact.titleCaseWordOnly}, create${compact.titleCaseWordOnly}, findOne${compact.titleCaseWordOnly}, update${compact.titleCaseWordOnly}, remove${compact.titleCaseWordOnly}} from @store/${compact.pathNoFormat}`,
      );
  } else {
    const text = file.read(paths.data.react + "store.js");
    code = text.toString().replaceAll("$name", compact.camelCase);
  }

  let storeIndex = paths.directory.store(["index.js"], dir);
  let virtual = `import ${compact.camelCase}Reducer from './${compact.pathNoFormat}'`;

  let check = file.read(storeIndex).toString().indexOf(virtual) === -1;
  if (check) {
    file.append(storeIndex, "", null, (text: string) =>
      text
        .replace("// dont remove this comment 1", `// dont remove this comment 1\n${virtual}`)
        .replace("reducer: {", `reducer: {\n\t\t${compact.camelCase}: ${compact.camelCase}Reducer,`),
    );
  }
  file.mkdir(paths.directory.store([compact.folder], dir));
  file.write(paths.directory.store([compact.path], dir), code);
  task.success(1);
}
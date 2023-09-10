import { SpawnSyncReturns } from "child_process";
import { paths } from "../constraint.js";
import { program, Option } from "../lib.js";
import { generate } from "../utils/style.js";
import { compactName } from "../utils/text.js";
import subprocess, { prettier } from "../utils/subprocess.js";
import config from "../utils/config.js";
import file, { isTypescript, makeRecursiveFolder } from "../utils/file.js";

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
  .command("add:styled")
  .description("Project integration with Styled Components")
  .action(addStyled);
react
  .command("add:recoil")
  .description("Project integration with Recoil")
  .action(addRecoil);
react
  .command("add:toolkit")
  .description("Project integration with Redux-Toolkit")
  .action(addReduxToolkit);
react
  .command("add:route")
  .description("Project integration with React Router")
  .action(addReactRouter);
react
  .command("make:component")
  .description("Generate component")
  .argument("<name>", "component name")
  .addOption(
    new Option("--style <name>", "style name").choices(configure.list.style),
  )
  .action(makeComponent);
react
  .command("make:route")
  .description("Generate route pages")
  .argument("<name>", "component name")
  .argument("<url>", "path url")
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
  .action(makeReduxToolkit);

export async function addMUI() {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material --save`;
  if (value.mode === 0) execution = "echo 1";
  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  file.copy(
    paths.data.react + "@mui/mui.jsx",
    paths.directory.src(["mui.jsx"], dir),
  );
  file.copy(
    paths.data.react + "@mui/color.js",
    paths.directory.service(["color.js"], dir),
  );
}
export async function addAntd() {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install antd --save`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  file.append(
    paths.directory.src(["index.css"], dir),
    "@import '../node_modules/antd/dist/antd.css';\n",
  );
}
export async function addStyled() {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install styled-components`;
  if (value.mode === 0) execution = "echo 1";

  subprocess.run(execution, { sync: true, hideStdout: true });
}
export async function addRecoil() {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install recoil`;
  if (value.mode === 0) execution = "echo 1";

  subprocess.run(execution, { sync: true, hideStdout: true });

  file.append(paths.directory.src(["main.jsx"], dir), "", "", (text: string) =>
    text
      .replace('"react";', '"react";\nimport { RecoilRoot } from "recoil";')
      .replace("<React.StrictMode>", "<React.StrictMode>\n\t\t<RecoilRoot>")
      .replace("</React.StrictMode>", "\t</RecoilRoot>\n\t</React.StrictMode>"),
  );
  prettier(dir, "src/main.jsx");
}
export async function addReduxToolkit() {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install @reduxjs/toolkit react-redux`;
  if (value.mode === 0) execution = "echo 1";

  subprocess.run(execution, { sync: true, hideStdout: true });

  file.copy(
    paths.data.react + "@redux-toolkit/index.js",
    paths.directory.store(["index.js"], dir),
  );
  file.copy(
    paths.data.react + "@redux-toolkit/app.js",
    paths.directory.store(["app.js"], dir),
  );
  file.append(paths.directory.src(["main.jsx"], dir), "", "", (text: string) =>
    text
      .replace(
        '"react";',
        '"react";\nimport { Provider } from "react-redux";\nimport { createRoot } from "react-dom/client";\nimport store from "./store";\n',
      )
      .replace(
        "<React.StrictMode>",
        "<React.StrictMode>\n\t\t<Provider store={store}>",
      )
      .replace("</React.StrictMode>", "\t</Provider>\n\t</React.StrictMode>"),
  );

  prettier(dir, "src/main.jsx");
}
export async function addReactRouter() {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  let execution = `cd ${dir} && npm install react-router-dom`;
  if (value.mode === 0) execution = "echo 1";

  subprocess.run(execution, { sync: true, hideStdout: true });

  file.copy(
    paths.data.react + "@react-router/App.jsx",
    paths.directory.src(["App.jsx"], dir),
  );
  file.copy(
    paths.data.react + "@react-router/index.jsx",
    paths.directory.route(["index.jsx"], dir),
  );
  file.copy(
    paths.data.react + "@react-router/Home.jsx",
    paths.directory.component(["Home.jsx"], dir),
  );
  file.copy(
    paths.data.react + "@react-router/About.jsx",
    paths.directory.component(["About.jsx"], dir),
  );
  file.copy(
    paths.data.react + "@react-router/template.jsx",
    paths.directory.component(["template.jsx"], dir),
  );
}
export function makeComponent(name: string, option: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, isTypescript(dir) ? ".tsx" : ".jsx");

  makeRecursiveFolder("component", dir, name);
  file.mkdir(paths.directory.component([], dir));

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
  file.write(
    paths.directory.component([compact.pathTitleCaseNoSeparate], dir),
    code,
  );
}
export function makeRoute(name: string, url: string, option: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, isTypescript(dir) ? ".tsx" : ".jsx");

  makeRecursiveFolder("route", dir, name);

  let code = file
    .read(paths.data.react + "@react-router/route.jsx")
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
  file.write(
    paths.directory.route([compact.pathTitleCaseNoSeparate], dir),
    code,
  );

  let virtual = `import ${compact.titleCaseWordOnly} from '@route/${compact.folder}/${compact.titleCaseWordOnly}'`,
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
          `{/*dont remove this comment 2*/}\n\t\t\t\t\t<Route path="${url}" element={<${compact.titleCaseWordOnly}/>}/>`,
        ),
    );
  }
}
export function makeReduxToolkit(name: string, option: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, ".js");

  makeRecursiveFolder("route", dir, name);

  let code = "";
  if (option.type === "async") {
    const url: any = option.url || "http://localhost:8000/api/user";
    code = file
      .read(paths.data.react + "@redux-toolkit/store-crud.js")
      .toString()
      .replaceAll("$name", compact.camelCase)
      .replaceAll("$url", url);
  } else if (option.type === "reducer") {
    const text = file.read(
      paths.data.react + "@redux-toolkit/store-crud-reducer.js",
    );
    code = text
      .toString()
      .replaceAll("$name", compact.camelCase)
      .replaceAll("$reducer", compact.titleCaseWordOnly)
      .replaceAll(
        "// import",
        `// import {handle${compact.titleCaseWordOnly}, reset${compact.titleCaseWordOnly}, create${compact.titleCaseWordOnly}, findOne${compact.titleCaseWordOnly}, update${compact.titleCaseWordOnly}, remove${compact.titleCaseWordOnly}} from @store/${compact.pathNoFormat}`,
      );
  } else {
    const text = file.read(paths.data.react + "@redux-toolkit/store.js");
    code = text.toString().replaceAll("$name", compact.camelCase);
  }

  let storeIndex = paths.directory.store(["index.js"], dir);
  let virtual = `import ${compact.camelCase}Reducer from './${compact.pathNoFormat}'`;

  let check = file.read(storeIndex).toString().indexOf(virtual) === -1;
  if (check) {
    file.append(storeIndex, "", null, (text: string) =>
      text
        .replace(
          "// dont remove this comment 1",
          `// dont remove this comment 1\n${virtual}`,
        )
        .replace(
          "reducer: {",
          `reducer: {\n\t\t${compact.camelCase}: ${compact.camelCase}Reducer,`,
        ),
    );
  }
  file.mkdir(paths.directory.store([compact.folder], dir));
  file.write(paths.directory.store([compact.path], dir), code);
}

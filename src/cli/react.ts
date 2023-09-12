import { paths } from "../constraint.js";
import { program } from "../lib.js";
import { generate } from "../utils/style.js";
import { compactName } from "../utils/text.js";
import { execute, prettier } from "../utils/execute.js";
import { file, isTypescript, makeRecursiveFolder } from "../utils/file.js";
import config from "../utils/config.js";

const configure = {
  list: {
    style: ["css", "sass", "scss"],
  },
};
const styleOption: any = [
  "--style",
  "style format",
  {
    required: false,
    validator: configure.list.style,
  },
];

program
  .command("react add:mui", "Project integration with Material UI")
  .action(addMUI)

  .command("react add:antd", "Project integration with Ant Design")
  .action(addAntd)

  .command("react add:styled", "Project integration with Styled Components")
  .action(addStyled)

  .command("react add:recoil", "Project integration with Recoil")
  .action(addRecoil)

  .command("react add:toolkit", "Project integration with Redux-Toolkit")
  .action(addReduxToolkit)

  .command("react add:route", "Project integration with React Router")
  .action(addReactRouter)

  .command("react make:component", "Generate component")
  .argument("<name>", "component name")
  .option(styleOption[0], styleOption[1], styleOption[2])
  .action(makeComponent)

  .command("react make:route", "Generate route pages (React Router)")
  .argument("<name>", "component name")
  .argument("<url>", "path url")
  .option(styleOption[0], styleOption[1], styleOption[2])
  .action(makeRoute)

  .command("react make:toolkit", "Generate store redux toolkit")
  .argument("<name>", "store name")
  .option("--type", "store type", {
    required: false,
    validator: ["async", "reducer"],
  })
  .option("--url", "URL API [async]")
  .action(makeReduxToolkit);

export async function addMUI() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(
    `cd ${dir} && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material --save`,
    {},
  );

  sub.changeEcho(value);
  sub.doSync();

  file.copyBulk(
    [paths.data.react + "@mui/mui.jsx", paths.directory.src(["mui.jsx"], dir)],
    [
      paths.data.react + "@mui/color.js",
      paths.directory.service(["color.js"], dir),
    ],
  );
}
export async function addAntd() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(`cd ${dir} && npm install antd --save`, {});

  sub.changeEcho(value);
  sub.doSync();

  file.append(
    paths.directory.src(["index.css"], dir),
    "@import '../node_modules/antd/dist/antd.css';\n",
  );
}
export async function addStyled() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(`cd ${dir} && npm install styled-components`, {});

  sub.changeEcho(value);
  sub.doSync();
}
export async function addRecoil() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(`cd ${dir} && npm install recoil`, {});

  sub.changeEcho(value);
  sub.doSync();

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
  const sub = execute(
    `cd ${dir} && npm install @reduxjs/toolkit react-redux`,
    {},
  );

  sub.changeEcho(value);
  sub.doSync();

  file.copyBulk(
    [
      paths.data.react + "@redux-toolkit/index.js",
      paths.directory.store(["index.js"], dir),
    ],
    [
      paths.data.react + "@redux-toolkit/app.js",
      paths.directory.store(["app.js"], dir),
    ],
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
  const sub = execute(`cd ${dir} && npm install react-router-dom`, {});

  sub.changeEcho(value);
  sub.doSync();

  file.copyBulk(
    [
      paths.data.react + "@react-router/App.jsx",
      paths.directory.src(["App.jsx"], dir),
    ],
    [
      paths.data.react + "@react-router/index.jsx",
      paths.directory.route(["index.jsx"], dir),
    ],
    [
      paths.data.react + "@react-router/Home.jsx",
      paths.directory.component(["Home.jsx"], dir),
    ],
    [
      paths.data.react + "@react-router/About.jsx",
      paths.directory.component(["About.jsx"], dir),
    ],
    [
      paths.data.react + "@react-router/template.jsx",
      paths.directory.component(["template.jsx"], dir),
    ],
  );
}
export async function makeComponent({ args, options }: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(args.name, isTypescript(dir) ? ".tsx" : ".jsx");

  makeRecursiveFolder("component", dir, args.name);
  file.mkdir(paths.directory.component([], dir));

  let code = file
    .read(paths.data.react + "component.jsx")
    .replaceAll("$name", compact.titleCaseWordOnly);
  if (options.style) {
    let style = generate(dir, {
      format: options.style,
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
export async function makeRoute({ args, options }: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(args.name, isTypescript(dir) ? ".tsx" : ".jsx");

  makeRecursiveFolder("route", dir, args.name);

  let code = file
    .read(paths.data.react + "@react-router/route.jsx")
    .replaceAll("$name", compact.titleCaseWordOnly);
  if (options.style) {
    let style = generate(dir, {
      format: options.style,
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
    check = file.read(routeIndex).indexOf(virtual) === -1;
  if (check) {
    file.append(routeIndex, "", null, (text: string) =>
      text
        .replace(
          "// dont remove this comment 1",
          `// dont remove this comment 1\n${virtual}`,
        )
        .replace(
          "{/*dont remove this comment 2*/}",
          `{/*dont remove this comment 2*/}\n\t\t\t\t\t<Route path="${args.url}" element={<${compact.titleCaseWordOnly}/>}/>`,
        ),
    );
  }
}
export async function makeReduxToolkit({ args, options }: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(args.name, ".js");

  makeRecursiveFolder("route", dir, args.name);

  let code = "";
  if (options.type === "async") {
    const url: any = options.url || "http://localhost:8000/api/user";
    code = file
      .read(paths.data.react + "@redux-toolkit/store-crud.js")
      .replaceAll("$name", compact.camelCase)
      .replaceAll("$url", url);
  } else if (options.type === "reducer") {
    const text = file.read(
      paths.data.react + "@redux-toolkit/store-crud-reducer.js",
    );
    code = text
      .replaceAll("$name", compact.camelCase)
      .replaceAll("$reducer", compact.titleCaseWordOnly)
      .replaceAll(
        "// import",
        `// import {handle${compact.titleCaseWordOnly}, reset${compact.titleCaseWordOnly}, create${compact.titleCaseWordOnly}, findOne${compact.titleCaseWordOnly}, update${compact.titleCaseWordOnly}, remove${compact.titleCaseWordOnly}} from @store/${compact.pathNoFormat}`,
      );
  } else {
    const text = file.read(paths.data.react + "@redux-toolkit/store.js");
    code = text.replaceAll("$name", compact.camelCase);
  }

  let storeIndex = paths.directory.store(["index.js"], dir);
  let virtual = `import ${compact.camelCase}Reducer from './${compact.pathNoFormat}'`;

  let check = file.read(storeIndex).indexOf(virtual) === -1;
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

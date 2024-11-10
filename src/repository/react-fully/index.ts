import { program } from "../../lib.js";
import { execute, prettier } from "../../utils/execute.js";
import config from "../../utils/config.js";
import { file } from "../../utils/file.js";
import { paths } from "../../constraint.js";
import { join } from "path";
import { addProvider } from "../../cli/react.js";

type StatePackageNodeType = {
  path: string;
  values: any;
  isExists: () => {};
  read: () => void;
};

program
  .command("react add:hook-form", "Project integration with Hook Form")
  .action(addHookForm)

  .command("react add:prime-react", "Project integration with Prime React")
  .action(addPrimeReact)

  .command("react add:react-admin", "Project integration with React Admin")
  .action(addReactAdmin)

  .command("react add:next-ui", "Project integration with NextUI")
  .action(addNextUI);

export function addHookForm() {
  const sub = execute(
    `cd ${config.getFullPathApp(config.value)} && npm install react-hook-form`,
    {
      background: true,
    },
  );
  sub.doRun();
}

export function addNextUI() {
  const dir = config.pathApp[0];

  let statePackageNode: StatePackageNodeType = {
    path: config.pathApp[0] + "/package.json",
    values: {},
    isExists() {
      return file.isExists(this.path);
    },
    read() {
      this.values = JSON.parse(file.read(dir + "/package.json"));
    },
  };

  if (statePackageNode.isExists()) {
    statePackageNode.read();

    const isNext: boolean = Boolean(
      statePackageNode.values["dependencies"]["next"],
    );
    const isReact: boolean =
      statePackageNode.values["devDependencies"]["vite"] &&
      statePackageNode.values["dependencies"]["react"];
    const isRemix: boolean = Boolean(statePackageNode.values['dependencies']['@remix-run/react'])
    if (!isNext && !isReact) return;

    const sub = execute(
      `cd ${config.getFullPathApp(config.value)} && npm i @nextui-org/react framer-motion`,
      {
        background: true,
      },
    );
    sub.doRun();

    // set tailwind config
    file.append(
      dir + "/tailwind.config.cjs",
      'const { nextui } = require("@nextui-org/react");\n',
      null,
      (value) => {
        const isEmptyPlugins = value.includes("plugins: [],");
        return value
          .replace(
            "content: [",
            'content: [\n\t\t\t"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",',
          )
          .replace(
            isEmptyPlugins ? "plugins: []," : "plugins: [",
            isEmptyPlugins ? "plugins: [nextui()]," : "plugins: [nextui(), ",
          );
      },
    );

    // add provider in vite
    if (!isNext) {
      addProvider(
        'import { NextUIProvider } from "@nextui-org/react"',
        'NextUIProvider',
        dir
      )
    }
    // add provider in nextjs
    if (isNext) {
      const providerIsExists = file.isExists(
        paths.directory.src(["app/providers.tsx"], dir),
      );
      if (!providerIsExists) {
        file.copy(
          paths.data.react + "/nextui/providers.tsx",
          paths.directory.src(["/app/providers.tsx"], dir),
        );
        file.append(
          [
            paths.directory.src(["app/layout.tsx"], dir),
            paths.directory.src(["app/layout.jsx"], dir)
          ],
          'import { Providers } from "./providers";\n',
          "",
          (text: string) => {
            return text
              .replace("<body>", "<body>\n\t\t<Providers>")
              .replace("</body>", "\t</Providers>\n\t</body>");
          },
        );
        prettier(dir, "src/app/layout.tsx");
      }
    }
    // add provider in remix
    if(isRemix) {
      file.append(
        [
          paths.directory.src(["app/root.tsx"], dir),
          paths.directory.src(["app/root.jsx"], dir)
        ],
        'import { NextUIProvider } from "@nextui-org/react";\n',
        "",
        (text: string) => {
          return text
            .replace("<body>", "<body>\n\t\t<NextUIProvider>")
            .replace("</body>", "\t</NextUIProvider>\n\t</body>");
        },
      );
      prettier(dir, "src/app/root.tsx");
    }
  }
  // empty package.json
  else {
    return;
  }
}

export function addPrimeReact() {
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${config.getFullPathApp(config.value)} && npm i primereact`,
    {
      background: true,
    },
  );
  sub.doRun();

  addProvider(
    'import { PrimeReactProvider } from "primereact/api";',
    'PrimeReactProvider',
    dir
  )
}

export function addReactAdmin() {
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${config.getFullPathApp(config.value)} && npm i react-admin ra-data-json-server`,
    {
      background: true,
    },
  );
  sub.doRun();

  file.mkdir(paths.directory.src(["/admin"], dir))
  file.copy(
    paths.data.react + "/react-admin/index.tsx",
    paths.directory.src(["/admin/index.tsx"], dir),
  )
  file.append(
    join(dir, "/index.html"),
    "",
    "",
    (value) => value.replace('</title>', '</title>\n\t\t<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>')
  )
}
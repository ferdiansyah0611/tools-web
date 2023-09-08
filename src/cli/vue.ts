import { SpawnSyncReturns } from "child_process";
import { paths } from "../constraint.js";
import { program, Option } from "../lib.js";
import { compactName } from "../utils/text.js";
import subprocess, { prettier } from "../utils/subprocess.js";
import config from "../utils/config.js";
import file, { makeRecursiveFolder } from "../utils/file.js";
import Task from "../utils/task.js";

const vue = program.command("vue").description("List vue.js cli");

vue
  .command("add:quasar")
  .description("Project integration with Quasar")
  .action(addQuasar);

vue
  .command("add:vuetify")
  .description("Project integration with Vuetify 3")
  .addOption(
    new Option("--icon <string>", "icon name")
      .choices([
        "mdi-cdn",
        "mdi-local",
        "material-icon-cdn",
        "material-icon-npm",
        "fontawesome-npm",
        "fontawesome-cdn",
      ])
      .makeOptionMandatory(),
  )
  .action(addVuetify);

vue
  .command("add:antd")
  .description("Project integration with Ant Design")
  .action(addAntd);

vue
  .command("add:element-plus")
  .description("Project integration with Element Plus")
  .action(addElementPlus);

vue
  .command("make:component")
  .description("Generate component")
  .argument("<name>", "component name")
  .option("--no-hook", "without hook")
  .action(makeComponent);

vue
  .command("make:route")
  .description("Generate route pages")
  .argument("<name>", "component name")
  .argument("<url>", "path url")
  .option("--no-hook", "without hook")
  .action(makeRoute);

vue
  .command("make:store")
  .description("Generate store")
  .argument("<name>", "store name")
  .action(makeStore);

export async function addQuasar() {
  const task = new Task(["Read Configuration", "Execution", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);

  task.success(0)

  let execution = `cd ${dir} && npm i quasar @quasar/extras --save && npm i -D @quasar/vite-plugin sass@1.32.12`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  task.success(1)

  let code = "";
  code += "import { Quasar } from 'quasar';\n";
  code += "import '@quasar/extras/material-icons/material-icons.css';\n";
  code += "import 'quasar/src/css/index.sass';";
  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) =>
    text
      .replace('from "vue";', 'from "vue";\n' + code)
      .replace(
        "createApp(App);",
        "createApp(App);\n" + "app.use(Quasar, {plugins: {}});",
      ),
  );
  file.append(dir + "/vite.config.js", "", null, (text: string) =>
    text
      .replace(
        'from "path";',
        'from "path";\n' +
          "import { quasar, transformAssetUrls } from '@quasar/vite-plugin';",
      )
      .replace(
        "vue(),",
        "vue({ template: { transformAssetUrls } }),\n\t\tquasar({ sassVariables: 'src/quasar-variables.sass'}),",
      ),
  );
  file.copy(
    paths.data.vue + "quasar-variables.sass",
    paths.directory.src(["quasar-variables.sass"], dir),
  );
  prettierFormatted(dir);
  task.success(2);
}

export async function addVuetify(option: any) {
  const task = new Task(["Read Configuration", "Generate Code", "Execution", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);

  task.success(0)

  let code = "";
  let execution = `cd ${dir} && npm i vuetify@^3.3.15`;
  let vuetify = `const vuetify = createVuetify({ components, directives, icons: { defaultSet: 'mdi', aliases, sets: { mdi }}});`;

  code += "// Vuetify\n";
  code += "import 'vuetify/styles';\n";
  code += "import { createVuetify } from 'vuetify';";
  code += "import * as components from 'vuetify/components';";
  code += "import * as directives from 'vuetify/directives';";
  code += "import { aliases, mdi } from 'vuetify/iconsets/mdi';";

  switch (option.icon) {
    case "mdi-npm":
      execution += " && npm install @mdi/font -D";
      code += "import '@mdi/font/css/materialdesignicons.css';\n";
    case "mdi-cdn":
      file.append(dir + "/index.html", "", "", (text: string) =>
        text.replace(
          "</title>",
          "</title>\n" +
            `<link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">`,
        ),
      );
    case "material-icon-npm":
      execution += " && npm install material-design-icons-iconfont -D";
      code +=
        "import 'material-design-icons-iconfont/dist/material-design-icons.css';";
    case "material-icon-cdn":
      file.append(dir + "/index.html", "", "", (text: string) =>
        text.replace(
          "</title>",
          "</title>\n" +
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"/>`,
        ),
      );
    case "fontawesome-npm":
      execution += " && npm install @fortawesome/fontawesome-free -D";
      code += "import '@fortawesome/fontawesome-free/css/all.css';";
    case "fontawesome-cdn":
      file.append(dir + "/index.html", "", "", (text: string) =>
        text.replace(
          "</title>",
          "</title>\n" +
            `<link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet">`,
        ),
      );
  }

  if (option.icon.includes("material-icon")) {
    vuetify = vuetify.replace("mdi", "md");
    code = code.replace("mdi", "md");
  } else if (option.icon.includes("fontawesome")) {
    vuetify = vuetify.replace("mdi", "fa");
    code = code.replace("mdi", "fa");
  }

  task.success(1)

  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  task.success(2)

  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) =>
    text
      .replace('from "vue";', 'from "vue";\n' + code)
      .replace("const app", vuetify + "\nconst app")
      .replace("createApp(App);", "createApp(App);\n" + "app.use(vuetify);"),
  );
  prettier(dir, "index.html");
  prettier(paths.directory.src([], dir), "main.js");
  task.success(3)
}

export async function addAntd() {
  const task = new Task(["Read Configuration", "Execution", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);

  task.success(0)

  let execution = `cd ${dir} && npm i --save ant-design-vue@4.x && npm install unplugin-vue-components -D`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  task.success(1)

  let code = "";
  code += "import Antd from 'ant-design-vue';\n";
  code += "import 'ant-design-vue/dist/reset.css';\n";
  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) =>
    text
      .replace('from "vue";', 'from "vue";\n' + code)
      .replace("createApp(App);", "createApp(App);\n" + "app.use(Antd);"),
  );
  let vite = "import Components from 'unplugin-vue-components/vite';\n";
  vite +=
    "import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';\n";
  file.append(dir + "/vite.config.js", "", null, (text: string) =>
    text
      .replace('from "path";', 'from "path";\n' + vite)
      .replace(
        "plugins: [",
        "plugins: [Components({ resolvers: [ AntDesignVueResolver({ importStyle: false })] }),",
      ),
  );
  prettierFormatted(dir);
  task.success(2)
}

export async function addElementPlus() {
  const task = new Task(["Read Configuration", "Execution", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);

  task.success(0)

  let execution = `cd ${dir} && npm install element-plus --save && npm install -D unplugin-vue-components unplugin-auto-import`;
  if (value.mode === 0) execution = "echo 1";

  let result: SpawnSyncReturns<Buffer> = subprocess.run(execution, {
    sync: true,
    hideStdout: true,
  });
  if (result.stderr.byteLength) return subprocess.error(result);
  task.success(1)

  let code = "";
  code += "import ElementPlus from 'element-plus';\n";
  code += "import 'element-plus/dist/index.css';\n";
  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) =>
    text
      .replace('from "vue";', 'from "vue";\n' + code)
      .replace(
        "createApp(App);",
        "createApp(App);\n" + "app.use(ElementPlus);",
      ),
  );
  let vite = "import AutoImport from 'unplugin-auto-import/vite';\n";
  vite += `import Components from 'unplugin-vue-components/vite';\n`;
  vite += `import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';\n`;
  file.append(dir + "/vite.config.js", "", null, (text: string) =>
    text
      .replace('from "path";', 'from "path";\n' + vite)
      .replace(
        "plugins: [",
        "plugins: [AutoImport({ resolvers: [ElementPlusResolver()] }), Components({ resolvers: [ElementPlusResolver()] }),",
      ),
  );
  prettierFormatted(dir);
  task.success(2)
}

export function makeComponent(name: string, option: any) {
  const task = new Task(["Read Configuration", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, ".vue");

  makeRecursiveFolder("components", dir, name);
  task.success(0)

  let code = file
    .read(
      paths.data.vue +
        (option.hasOwnProperty("hook") && option.hook === false
          ? "component-hook.vue"
          : "component.vue"),
    )
    .toString()
    .replaceAll("$name", name);

  file.mkdir(paths.directory.components([], dir));
  file.write(paths.directory.components([compact.path], dir), code);
  task.success(1)
}

export function makeRoute(name: string, url: string, option: any) {
  const task = new Task(["Read Configuration", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, ".vue");

  makeRecursiveFolder("route", dir, name);
  task.success(0)

  let code = file
    .read(
      paths.data.vue +
        (option.hasOwnProperty("hook") && option.hook === false
          ? "component-hook.vue"
          : "component.vue"),
    )
    .toString()
    .replaceAll("$name", name);

  file.mkdir(paths.directory.route([], dir));
  file.write(paths.directory.route([compact.path], dir), code);
  file.append(
    paths.directory.route(["index.js"], dir),
    "",
    null,
    (text: string) =>
      text
        .replace(
          "// dont remove [1]",
          `// dont remove [1]\nimport ${compact.titleCaseWordOnly} from '@route/${compact.path}'`,
        )
        .replace(
          "// dont remove [2]",
          `// dont remove [2]\n\t{ path: '${url}', name: '${compact.titleCaseWordOnly}', component: ${compact.titleCaseWordOnly} },`,
        ),
  );
  task.success(1)
}

export function makeStore(name: string) {
  const task = new Task(["Read Configuration", "Generate Code"]);
  task.start(0);

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, ".js");

  makeRecursiveFolder("store", dir, name);
  task.success(0)
  
  let code = file
    .read(paths.data.vue + "store.js")
    .toString()
    .replaceAll("$name", name);

  file.append(
    paths.directory.store(["index.js"], dir),
    "",
    null,
    (text: string) =>
      text
        .replace("// store", `// store\n\t\t${compact.camelCase}: ${compact.camelCase},`)
        .replace("export", `import ${compact.camelCase} from './${compact.pathNoFormat}'\nexport`),
  );
  file.write(paths.directory.store([compact.path], dir), code);
  task.success(1)
}

/**
 * do prettier src/main.js and vite.config.js
 */
function prettierFormatted(dir: string) {
  prettier(paths.directory.src([], dir), "main.js");
  prettier(dir, "vite.config.js");
}

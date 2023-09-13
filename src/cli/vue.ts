import { paths } from "../constraint.js";
import { program } from "../lib.js";
import { compactName } from "../utils/text.js";
import { execute, prettier } from "../utils/execute.js";
import { file, makeRecursiveFolder } from "../utils/file.js";
import { code } from "../utils/code.js";
import config from "../utils/config.js";

program
  .command("vue add:quasar", "Project integration with Quasar")
  .action(addQuasar)

  .command("vue add:vuetify", "Project integration with Vuetify 3")
  .option("--icon <string>", "icon name", {
    validator: [
      "mdi-cdn",
      "mdi-local",
      "material-icon-cdn",
      "material-icon-npm",
      "fontawesome-npm",
      "fontawesome-cdn",
    ],
    required: true,
  })
  .action(addVuetify)

  .command("vue add:antd", "Project integration with Ant Design")
  .action(addAntd)

  .command("vue add:element-plus", "Project integration with Element Plus")
  .action(addElementPlus)

  .command("vue add:route", "Project integration with Vue Router")
  .action(addRoute)

  .command("vue make:component", "Generate component")
  .argument("<name>", "component name")
  .option("--no-hook", "without hook")
  .action(makeComponent)

  .command("vue make:route", "Generate route pages")
  .argument("<name>", "component name")
  .argument("<url>", "path url")
  .option("--no-hook", "without hook")
  .action(makeRoute)

  .command("vue make:vuex", "Generate vuex state")
  .argument("<name>", "state name")
  .action(makeVuex);

export async function addQuasar() {
  const fw = "@quasar";
  const value = config.value;
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${dir} && npm i quasar @quasar/extras --save && npm i -D @quasar/vite-plugin sass@1.32.12`,
    {},
  );

  sub.changeEcho(value);
  sub.doSync();

  let code = "";
  code += "import { Quasar } from 'quasar';\n";
  code += "import '@quasar/extras/material-icons/material-icons.css';\n";
  code += "import 'quasar/src/css/index.sass';";

  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) => text
    .replace(/(from "vue";)/, "$1\n" + code)
    .replace(/(createApp\(App\))/, "$1.use(Quasar, {plugins: {}})")
  )
  file.append(dir + "/vite.config.js", "", null, (text: string) =>
    text
      .replace(
        /(from "path";)/,
        "$1\nimport { quasar, transformAssetUrls } from '@quasar/vite-plugin';",
      )
      .replace(
        "vue(),",
        "vue({ template: { transformAssetUrls } }),\n\t\tquasar({ sassVariables: 'src/quasar-variables.sass'}),",
      ),
  );
  file.copy(
    paths.data.vue + fw + "quasar-variables.sass",
    paths.directory.src(["quasar-variables.sass"], dir),
  );
  prettierFormatted(dir);
}

export async function addVuetify({ options }: any) {
  const value = config.value;
  const dir = config.pathApp[0];
  const sub = execute(`cd ${dir} && npm i vuetify@^3.3.15`, {});
  const vuetifyCode = code(
    `const vuetify = createVuetify({ components, directives, icons: { defaultSet: 'mdi', aliases, sets: { mdi }}});`,
  );
  const importCode = code(
    "// Vuetify",
    "import 'vuetify/styles';",
    "import { createVuetify } from 'vuetify';",
    "import * as components from 'vuetify/components';",
    "import * as directives from 'vuetify/directives';",
    "import { aliases, mdi } from 'vuetify/iconsets/mdi';",
  );
  switch (options.icon) {
    case "mdi-npm":
      importCode.next("import '@mdi/font/css/materialdesignicons.css';");
    case "mdi-cdn":
      file.append(dir + "/index.html", "", "", (text: string) =>
        text.replace(/(\<\/title>)/, "$1\n<link href=\"https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css\" rel=\"stylesheet\">",
        ),
      );
    case "material-icon-npm":
      sub.change(
        (current) =>
          (current += " && npm install material-design-icons-iconfont -D"),
      );
      importCode.next(
        "import 'material-design-icons-iconfont/dist/material-design-icons.css';",
      );
    case "material-icon-cdn":
      file.append(dir + "/index.html", "", "", (text: string) =>
        text.replace(
          /(\<\/title>)/,
          "$1\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp\"/>",
        ),
      );
    case "fontawesome-npm":
      importCode.next("import '@fortawesome/fontawesome-free/css/all.css';");
      sub.change(
        (current) =>
          (current += " && npm install @fortawesome/fontawesome-free -D"),
      );
    case "fontawesome-cdn":
      file.append(dir + "/index.html", "", "", (text: string) =>
        text.replace(
          /(\<\/title>)/,
          "$1\n<link href=\"https://use.fontawesome.com/releases/v5.0.13/css/all.css\" rel=\"stylesheet\">",
        ),
      );
  }

  if (options.icon.includes("material-icon")) {
    vuetifyCode.set(vuetifyCode.v.replace("mdi", "md"));
    importCode.set(importCode.v.replace("mdi", "md"));
  } else if (options.icon.includes("fontawesome")) {
    vuetifyCode.set(vuetifyCode.v.replace("mdi", "fa"));
    importCode.set(importCode.v.replace("mdi", "fa"));
  }

  sub.changeEcho(value);
  sub.doSync();

  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) => text
    .replace(/(from "vue";)/, "$1\n" + importCode.v)
    .replace("const app", vuetifyCode.v + "\nconst app")
    .replace(/(createApp\(App\))/, "$1.use(vuetify)")
  )
  prettier(dir, "index.html");
  prettier(paths.directory.src([], dir), "main.js");
}

export async function addAntd() {
  const value = config.value;
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${dir} && npm i --save ant-design-vue@4.x && npm install unplugin-vue-components -D`,
    {},
  );
  // code
  const antCode = code(
    "import Antd from 'ant-design-vue';",
    "import 'ant-design-vue/dist/reset.css';",
  );
  const viteCode = code(
    "import Components from 'unplugin-vue-components/vite';",
    "import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';",
  );

  sub.changeEcho(value);
  sub.doSync();

  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) => text
    .replace(/(from "vue";)/, "$1\n" + antCode.v)
    .replace(/(createApp\(App\))/, "$1.use(Antd)")
  )
  viteAddImportAndPlugin(
    dir,
    viteCode.v,
    "Components({ resolvers: [ AntDesignVueResolver({ importStyle: false })] }),",
  );
  prettierFormatted(dir);
}

export async function addElementPlus() {
  const value = config.value;
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${dir} && npm install element-plus --save && npm install -D unplugin-vue-components unplugin-auto-import`,
    {},
  );
  // code
  const elementPlusCode = code(
    "import ElementPlus from 'element-plus';",
    "import 'element-plus/dist/index.css';",
  );
  const viteCode = code(
    "import AutoImport from 'unplugin-auto-import/vite';",
    "import Components from 'unplugin-vue-components/vite';",
    "import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';",
  );

  sub.changeEcho(value);
  sub.doSync();

  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) => text
    .replace(/(from "vue";)/, "$1\n" + elementPlusCode.v)
    .replace(/(createApp\(App\))/, "$1.use(ElementPlus)")
  )
  viteAddImportAndPlugin(
    dir,
    viteCode.v,
    "AutoImport({ resolvers: [ElementPlusResolver()] }), Components({ resolvers: [ElementPlusResolver()] }),",
  );
  prettierFormatted(dir);
}

export async function addRoute() {
  const value = config.value;
  const dir = config.pathApp[0];
  const fw = "@vue-router"
  const sub = execute(
    `cd ${value.app_path} && npm i vue-router`,
    {},
  );
  sub.changeEcho(value);
  sub.doSync();

  file.mkdir(paths.directory.route([], dir));
  file.copyBulk(
    [paths.data.vue + fw + "/router.js", paths.directory.route(["index.js"], dir)],
    [paths.data.vue + fw + "/Home.vue", paths.directory.route(["Home.vue"], dir)],
  );
  file.append(paths.directory.src(["App.vue"], dir), "", null, (text: string) => text.replace(/(<template>)/, "$1\n\t<router-view />"))
  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) => text
    .replace(/(from "vue";)/, "$1\nimport router from \"./route\";")
    .replace(/(createApp\(App\))/, "$1.use(router)")
  )
  prettierFormatted(dir);
}

export async function addVuex() {
  const value = config.value;
  const dir = config.pathApp[0];
  const fw = "@vuex";
  const sub = execute(
    `cd ${value.app_path} && npm i vuex`,
    {},
  );
  sub.changeEcho(value);
  sub.doSync();

  file.mkdir(paths.directory.store([], dir));
  file.copyBulk(
    [paths.data.vue + fw + "/index.js", paths.directory.store(["index.js"], dir)],
  );
  file.append(paths.directory.src(["main.js"], dir), "", null, (text: string) => text
    .replace(/(from "vue";)/, "$1\nimport store from \"./store\";")
    .replace(/(createApp\(App\))/, "$1.use(store)")
  )
  prettierFormatted(dir);
}

export async function makeComponent({ args, options }: any) {
  const dir = config.pathApp[0];
  const compact = compactName(args.name, ".vue");

  makeRecursiveFolder("components", dir, args.name);

  let code = file
    .read(
      paths.data.vue +
        (options.hasOwnProperty("hook") && options.hook === false
          ? "component-hook.vue"
          : "component.vue"),
    )
    .replaceAll("$name", args.name);

  file.mkdir(paths.directory.components([], dir));
  file.write(paths.directory.components([compact.path], dir), code);
}

export async function makeRoute({ args, options }: any) {
  const dir = config.pathApp[0];
  const compact = compactName(args.name, ".vue");

  makeRecursiveFolder("route", dir, args.name);

  let code = file
    .read(
      paths.data.vue +
        (options.hasOwnProperty("hook") && options.hook === false
          ? "component-hook.vue"
          : "component.vue"),
    )
    .replaceAll("$name", args.name);

  file.mkdir(paths.directory.route([], dir));
  file.write(paths.directory.route([compact.path], dir), code);
  file.append(
    paths.directory.route(["index.js"], dir),
    "",
    null,
    (text: string) =>
      text
        .replace(
          /(from "vue-router";)/,
          `$1\nimport ${compact.titleCaseWordOnly} from '@route/${compact.path}'`,
        )
        .replace(
          /(const routes = \[)/,
          `$1\n\t{ path: '${args.url}', name: '${compact.titleCaseWordOnly}', component: ${compact.titleCaseWordOnly} },`,
        ),
  );
}

export async function makeVuex({ args }: any) {
  const dir = config.pathApp[0];
  const compact = compactName(args.name, ".js");
  const fw = "@vuex";

  makeRecursiveFolder("store", dir, args.name);

  let code = file
    .read(paths.data.vue + fw + "/store.js")
    .replaceAll("$name", args.name);

  file.append(
    paths.directory.store(["index.js"], dir),
    "",
    null,
    (text: string) =>
      text
        .replace(
          "// store",
          `// store\n\t\t${compact.camelCase}: ${compact.camelCase},`,
        )
        .replace(
          "export",
          `import ${compact.camelCase} from './${compact.pathNoFormat}'\nexport`,
        ),
  );
  file.write(paths.directory.store([compact.path], dir), code);
}

/**
 * do prettier src/main.js and vite.config.js
 */
function prettierFormatted(dir: string) {
  prettier(paths.directory.src([], dir), "main.js");
  prettier(dir, "vite.config.js");
}
/**
 * add import and plugin to vite.config.js
 */
function viteAddImportAndPlugin(
  dir: string,
  importCode: string,
  pluginCode: string,
) {
  file.append(dir + "/vite.config.js", "", null, (text: string) =>
    text
      .replace(/(from "path";)/, '$1\n' + importCode)
      .replace(/(plugins: \[)/, "$1" + pluginCode),
  );
}

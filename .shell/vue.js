const Vue = function (sh) {
  this.name = "vue";
  this.config = sh.config;
  this.root = sh.config.vue;
  this.parse = sh.parse();
  this.init = (arg) => {
    const { createDirRecursive, read, write } = sh.SystemFile;
    const fixName = this.parse.toUpper(arg[0]);
    const caseName = this.parse.removeFormat(arg[0]);
    return {
      fixName,
      caseName,
      createDirRecursive,
      read,
      write,
    };
  };
  this.action = [
    {
      name: "make:component",
      maxArg: 1,
      console: {
        name: "make:component [file]",
        description: "Generate component",
        tab: 4,
      },
      action: async (arg) => {
        const { createDirRecursive, read, write, fixName, caseName } =
          this.init(arg);
        createDirRecursive(this.config.directory.component + "s", fixName);
        var code = read(this.root + "component.vue")
          .toString()
          .replaceAll("caseName", caseName);
        write(this.config.directory.component + "s" + "/" + fixName, code);
        sh.success();
      },
    },
    {
      name: "make:route",
      maxArg: 2,
      console: {
        name: "make:route [file] [url]",
        description: "Generate route pages",
        tab: 3,
      },
      action: async (arg) => {
        const { createDirRecursive, read, write, fixName, caseName } =
          this.init(arg);
        const url = arg[1];
        let { append } = sh.SystemFile;
        createDirRecursive(this.config.directory.route, fixName);
        var code = read(this.root + "component.vue")
          .toString()
          .replaceAll("caseName", caseName);
        write(this.config.directory.route + "/" + fixName, code);
        append(this.config.directory.route + "/index.js", "", null, (text) =>
          text
            .replace(
              "// dont remove [1]",
              `// dont remove [1]\nimport ${caseName} from '@route/${caseName}.vue'`
            )
            .replace(
              "// dont remove [2]",
              `// dont remove [2]\n\t{ path: '${url}', name: '${caseName}', component: ${caseName} },`
            )
        );
        sh.success();
      },
    },
    {
      name: "make:store",
      maxArg: 1,
      console: {
        name: "make:store [file]",
        description: "Generate store",
        tab: 4,
      },
      action: async (arg) => {
        let { createDirRecursive, read, write, fixName, caseName } =
          this.init(arg);
        let { append } = sh.SystemFile;
        fixName = fixName.toLowerCase();
        caseName = caseName.toLowerCase();
        createDirRecursive(this.config.directory.store, fixName);
        var code = read(this.root + "store.js")
          .toString()
          .replaceAll("caseName", caseName);
        write(this.config.directory.store + "/" + fixName, code);
        append(this.config.directory.store + "/index.js", "", null, (text) =>
          text
            .replace("// store", `// store\n\t\t${caseName}: ${caseName}`)
            .replace("export", `import ${caseName} from '${caseName}'\nexport`)
        );
      },
    },
    {
      name: "dev",
      console: {
        name: "dev",
        description: "Run server dev on the background",
        tab: 6,
      },
      action: () => {
        sh.utils.runServerNpm();
      },
    },
    {
      name: "add:tailwindcss",
      console: {
        name: "add:tailwindcss",
        description: "Install & configuration of tailwindcss",
        tab: 4,
      },
      action: async() => {
        await sh.utils.createTailwind(this.name);
      },
    },
    {
      name: "make:project",
      console: {
        name: "make:project",
        description: "Create new project using vite",
        tab: 5,
      },
      action: async (arg) => {
        let file = sh.SystemFile;
        await sh.utils.createVite("vue", () => {
          file.createDirRecursive(this.config.directory.route);
          file.copy(
            this.root + "router.js",
            this.config.directory.route + "/index.js",
            () => {}
          );
          file.copy(
            this.root + "Home.vue",
            this.config.directory.route + "/Home.vue",
            () => {}
          );
          file.copy(
            this.root + "storeindex.js",
            this.config.directory.store + "/index.js",
            () => {}
          );
          file.copy(
            this.root + "App.vue",
            sh.env.root + "/src/App.vue",
            () => {}
          );
          file.copy(
            this.root + "main.js",
            sh.env.root + "/src/main.js",
            () => {}
          );
          var exec = `cd ${sh.env.root} && npm i && npm i vuex@next vue-router@next`;
          sh.log("please run: " + exec.underline);
          sh.success();
        });
      },
    },
  ];
};

module.exports = Vue;

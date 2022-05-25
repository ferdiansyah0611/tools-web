const Vue = function (sh) {
  this.name = "vue";
  this.config = sh.config;
  this.root = sh.config.rootShell + "vue/";
  this.parse = sh.parse();
  this.init = (arg) => {
    const { createDirRecursive, read, write } = sh.SystemFile;
    const core = sh.core();
    const fixName = this.parse.toUpper(arg[0]);
    const caseName = this.parse.removeFormat(arg[0]);
    return {
      core,
      fixName,
      caseName,
      createDirRecursive,
      read,
      write,
    };
  };
  this.action = [
    ...sh.coreFeatureDefault(sh.core(), {
      framework: "vue",
    }),
    {
      name: "make:component",
      maxArg: 1,
      console: {
        name: "make:component [file]",
        description: "Generate component",
        tab: 4,
      },
      action: async (arg) => {
        const { createDirRecursive, read, write, core, fixName, caseName } =
          this.init(arg);
        createDirRecursive(this.config.directory.component + "s", fixName);
        var code = read(this.root + "component.vue")
          .toString()
          .replaceAll("caseName", caseName);
        write(this.config.directory.component + "s" + "/" + fixName, code);
        core.success();
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
        const { createDirRecursive, read, write, core, fixName, caseName } =
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
        core.success();
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
        let { createDirRecursive, read, write, core, fixName, caseName } =
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
        core.success();
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
        let { createDirRecursive, core } = this.init([""]);
        let { copy } = sh.SystemFile;
        await core.createProject("vue", () => {
          createDirRecursive(this.config.directory.route);
          copy(
            this.root + "router.js",
            this.config.directory.route + "/index.js",
            () => {}
          );
          copy(
            this.root + "Home.vue",
            this.config.directory.route + "/Home.vue",
            () => {}
          );
          copy(
            this.root + "storeindex.js",
            this.config.directory.store + "/index.js",
            () => {}
          );
          copy(this.root + "App.vue", sh.env.root + "/src/App.vue", () => {});
          copy(this.root + "main.js", sh.env.root + "/src/main.js", () => {});
          var exec = (exec =
            "cd " +
            sh.env.root +
            " && npm i && npm i vuex@next vue-router@next");
          sh.log("please run: " + exec.underline);
          core.success();
        });
      },
    },
  ];
};

module.exports = Vue;

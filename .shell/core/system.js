const addRequireIndex = (ROOT, append, plugin) => {
  const file = ROOT + "/index";
  append(file, ``, null, (text) =>
    text
      .replace(
        "// don't remove this comment",
        `// don't remove this comment\nsh.use(require('${plugin}'))`
      )
      .trim()
  );
};

const system = [
  {
    statement: (arg) => arg[0] == "test:api",
    maxArg: 1,
    console: {
      name: "test:api [file]",
      description: "Create testing API http using deno",
      tab: 4,
    },
    action: async (sh) => {
      const file = sh.SystemFile;
      file.createDirRecursive(sh.root + "/test");
      file.copy(
        sh.config.rootShell + "test/api.js",
        sh.env.root + "/test/" + sh.arg[1]
      );
    },
  },
  {
    statement: (arg) => arg[0] == "show",
    maxArg: 2,
    console: {
      name: "show [name]",
      description: "Show value of variable in the class",
      tab: 5,
    },
    action: async (sh) => {
      if (sh.arg[1] && sh.arg[1] in sh) {
        sh.log(JSON.stringify(sh[sh.arg[1]]));
        console.log("");
      }
      sh.cli();
    },
  },
  {
    statement: (arg) => arg[0] == "exit",
    console: {
      name: "exit",
      description: "Exit the current command",
      tab: 6,
    },
    action: async (sh) => {
      sh.startcli = false;
      let bye = () => {
        sh.console("==> CREATED BY FERDIANSYAH0611 <==".blue);
        sh.console("Good Bye!".green);
        sh.exit(true);
      };
      if (sh.pid.length) {
        sh.pid.forEach((v, i) => {
          try {
            process.kill(v, "SIGTERM");
          } catch (e) {
            // e
          } finally {
            if (i === sh.pid.length - 1) {
              bye();
            }
          }
        });
      } else {
        bye();
      }
    },
  },
  {
    statement: (arg) => arg[0] == "edit",
    console: {
      name: "edit",
      description: "Show how to edit cli using vim",
      tab: 6,
    },
    action: async (sh, ROOT) => {
      sh.log(`please run: ${`cd ${ROOT} && vim index`.blue}`);
    },
  },
  {
    statement: (arg) => arg[0] == "app",
    maxArg: 2,
    console: {
      name: "app [folder]",
      description: "Change default app folder",
      tab: 5,
    },
    action: async (sh, ROOT) => {
      const name = sh.arg[1];
      const { append } = sh.SystemFile;
      append(ROOT + "/index", "", null, (text) =>
        text.replace(`'${sh.root}'`, `'${name}'`)
      );
      sh.env.root = name;
      sh.root = sh.env.root;
      sh.configure();
      sh.cli();
    },
  },
  {
    statement: (arg) => arg[0] == "mode",
    maxArg: 2,
    console: {
      name: "mode [0,1]",
      description: "Change mode command",
      tab: 3,
    },
    action: async (sh, ROOT) => {
      const name = parseInt(sh.arg[1]);
      if (name === 0 || name === 1) {
        const { append } = sh.SystemFile;
        append(ROOT + "/index", "", null, (text) =>
          text.replace(`${sh.env.mode}`, `${name}`)
        );
        sh.env.mode = name;
        sh.isProduction = sh.env.mode === 1;
        sh.cli();
      }
    },
  },
  {
    statement: (arg) => arg[0] == "install",
    maxArg: 2,
    console: {
      name: "install [name]",
      description: "Install the plugin and the plugin must be publish on npm",
      tab: 4,
    },
    action: async (sh, ROOT) => {
      const plugin = sh.arg[1];
      const { append } = sh.SystemFile;
      (async () => {
        await sh.subprocess("cd " + ROOT + " && npm i " + plugin, {
          close: () => {
            const file = ROOT + "/index";
            addRequireIndex(ROOT, append, plugin);
            append(ROOT + "/package.twb", plugin + "\n", null, null);
            sh.log("restart now!");
          },
          hide: true,
          hideLog: true,
        });
      })();
    },
  },
  {
    statement: (arg) => arg[0] == "update",
    console: {
      name: "update",
      description: "Update the package",
      tab: 5,
    },
    action: async (sh, ROOT) => {
      const { read, append } = sh.SystemFile;
      var exec = "npm i -g tools-web";
      var package = read(ROOT + "/package.twb").toString();
      var ended;
      if (package.length) {
        package = package.trim().split("\n");
        exec += " && cd " + ROOT + " && npm i " + package.join(" ");
        ended = () => {
          for (var i = 0; i < package.length; i++) {
            addRequireIndex(ROOT, append, package[i]);
          }
          sh.log("restart now!");
        };
      } else {
        ended = () => sh.log("restart now!");
      }
      await sh.subprocess(exec, {
        close: ended,
        hide: true,
        hideLog: true,
      });
    },
  },
  {
    statement: (arg) => arg[0] == "uninstall",
    maxArg: 2,
    console: {
      name: "uninstall [name]",
      description: "Uninstall the plugin",
      tab: 4,
    },
    action: async (sh, ROOT) => {
      const plugin = sh.arg[1];
      const { read, write, append } = sh.SystemFile;
      (async () => {
        await sh.subprocess("cd " + ROOT + " && npm uninstall " + plugin, {
          close: () => {
            const file = ROOT + "/index";
            var code = read(file)
              .toString()
              .replace(`sh.use(require('${plugin}'))`, "");
            write(file, code.trim());
            append(ROOT + "/package.twb", "", null, (text) =>
              text.replace(plugin, "").trim()
            );
            sh.log("restart now!");
          },
          hide: true,
          hideLog: true,
        });
      })();
    },
  },
  {
    statement: (arg) => arg[0] === "prettier",
    console: {
      name: "prettier all",
      description: "Run prettier in the current project",
      tab: 5,
    },
    action(sh) {
      sh.subprocess(`cd ${sh.env.root} && npx prettier --write .`, {
        close() {
          sh.cli();
        },
      });
    },
  },
];

module.exports = system
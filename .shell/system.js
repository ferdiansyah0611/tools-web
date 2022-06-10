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

const System = function (sh) {
  this.name = "system";
  this.action = [
    {
      statement: (arg) =>
        ["-v", "--version"].indexOf(arg[0].toLowerCase()) !== -1,
      maxArg: 1,
      console: {
        name: "-v --version",
        description: "Show version tools-web",
        tab: 5,
      },
      action: async (arg, sh, plug, ROOT) => {
        var file = JSON.parse(sh.SystemFile.read(ROOT + "/package.json"));
        console.log(sh.time(), ">", "v" + file.version);
        return sh.exit();
      },
    },
    {
      statement: (arg) => ["-h", "--help"].indexOf(arg[0].toLowerCase()) !== -1,
      maxArg: 1,
      console: {
        name: "-h --help",
        description: "Show help command",
        tab: 5,
      },
      action: async (arg, sh, plug, ROOT) => {
        sh.consoleHelper(() => {
          sh.utils.showTitle("System", true);
          plug.action
            .sort(
              (a, b) =>
                (a.console.name > b.console.name) -
                (a.console.name < b.console.name)
            )
            .filter((item) => item.name !== "system")
            .map((v) => {
              sh.utils.showConsole(v);
            });
          sh.plugin
            .sort((a, b) => (a.name > b.name) - (a.name < b.name))
            .filter((item) => item.name !== "system" && !item.disabled)
            .map((v) => {
              sh.utils.showHelper(v.action, v.name);
            });
        }, () => {
          console.log("\t", "-h --help", "\t".repeat(5), "Show help command");
          console.log("\t", "--cli", "\t".repeat(6), "Run command without stdin");
        });
      },
    },
    {
      statement: (arg) => arg[0] == "disable",
      maxArg: 1,
      console: {
        name: "disable [package]",
        description: "Disable the package",
        tab: 4,
      },
      action: async (arg, sh, plug, ROOT) => {
        let name = sh.arg[1];
        let file = sh.SystemFile;
        if (["vue", "react", "express"].find((v) => v === name)) {
          sh.plugin = sh.plugin.map(item => {
            if(item.name === name) {
              item.disabled = true
            }
            return item
          })
          sh.LIST = sh.LIST.filter(item => item !== name)
          file.append(ROOT + "/index", "", null, (text) =>
            text.replace(
              `sh.use(require("./.shell/${name}"))`,
              `// sh.use(require("./.shell/${name}"))`
            )
          );
          sh.log("disable " + name);
        }
      },
    },
    {
      statement: (arg) => arg[0] == "enable",
      maxArg: 1,
      console: {
        name: "enable [package]",
        description: "Disable the package",
        tab: 4,
      },
      action: async (arg, sh, plug, ROOT) => {
        let name = sh.arg[1];
        let file = sh.SystemFile;
        if (["vue", "react", "express"].find((v) => v === name)) {
          sh.plugin = sh.plugin.map(item => {
            if(item.name === name) {
              delete item.disabled
            }
            return item
          })
          if(!sh.LIST.find(item => item === name)){
            sh.LIST = [...sh.LIST, name]
          }
          file.append(ROOT + "/index", "", null, (text) =>
            text.replace(
              `// sh.use(require("./.shell/${name}"))`,
              `sh.use(require("./.shell/${name}"))`
            )
          );
          sh.log("enable " + name);
        }
      },
    },
    {
      statement: (arg) => arg[0] == "test:api",
      maxArg: 1,
      console: {
        name: "test:api [file]",
        description: "Create testing API http using deno",
        tab: 4,
      },
      action: async (arg, sh, plug, ROOT) => {
        const file = sh.SystemFile;
        file.createDirRecursive(sh.root + "/test");
        file.copy(
          sh.config.root + "test/api.js",
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
      action: async (arg, sh, plug, ROOT) => {
        if (sh.arg[1] && sh.arg[1] in sh) {
          sh.log(JSON.stringify(sh[sh.arg[1]]));
          if (sh.startcli) console.log("");
        }
      },
    },
    {
      statement: (arg) => arg[0] == "exit",
      console: {
        name: "exit",
        description: "Exit the current command",
        tab: 6,
      },
      action: async (arg, sh, plug, ROOT) => {
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
        description: "Show how to customize tools-web using vim",
        tab: 6,
        disableNewline: true,
      },
      action: async (arg, sh, plug, ROOT) => {
        sh.console(`please run: ${`cd ${ROOT} && vim index`.blue}`);
      },
    },
    {
      statement: (arg) => arg[0] == "app",
      maxArg: 2,
      console: {
        name: "app [folder]",
        description: "Change default app folder",
        tab: 5,
        disableNewline: true,
      },
      action: async (arg, sh, plug, ROOT) => {
        const name = sh.arg[1];
        const { append } = sh.SystemFile;
        append(ROOT + "/index", "", null, (text) =>
          text.replace(`"${sh.root}"`, `"${name}"`)
        );
        sh.env.root = name;
        sh.root = sh.env.root;
        sh.configure();
      },
    },
    {
      statement: (arg) => arg[0] == "mode",
      maxArg: 2,
      console: {
        name: "mode [0,1]",
        description: "Change mode command",
        tab: 5,
        disableNewline: true,
      },
      action: async (arg, sh, plug, ROOT) => {
        const name = parseInt(sh.arg[1]);
        if (name === 0 || name === 1) {
          const { append } = sh.SystemFile;
          append(ROOT + "/index", "", null, (text) =>
            text.replace(`${sh.env.mode}`, `${name}`)
          );
          sh.env.mode = name;
          sh.isProduction = sh.env.mode === 1;
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
      action: async (arg, sh, plug, ROOT) => {
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
      action: async (arg, sh, plug, ROOT) => {
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
      action: async (arg, sh, plug, ROOT) => {
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
      action(arg, sh, plug, ROOT) {
        sh.subprocess(`cd ${sh.env.root} && npx prettier --write .`, {
          close() {},
        });
      },
    },
  ];
  return this;
};

module.exports = System;

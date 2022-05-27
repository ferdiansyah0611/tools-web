const checkIndex = (text, arg1, arg2) => {
  return text.indexOf(arg1) !== -1 && text.indexOf(arg2) !== -1;
};
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

const CORE = (sh) => {
  const { createDirRecursive, copy, read, write, append } = sh.SystemFile;
  return {
    createProject: async (name, end = Function) => {
      var exec =
        "npm create vite@latest " + sh.env.root + " -- --template " + name;
      await sh.subprocess(exec, {
        close: () => {
          var core = sh.core();
          var code = read(sh.config.rootShell + "vite.config.js").toString();
          code = code.replace("react", name);
          write(sh.env.root + "/vite.config.js", code);
          write(
            sh.env.root + "/vercel.json",
            '{ "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }] }'
          );
          end();
        },
        hide: true,
        hideLog: true,
      });
    },
    createTailwind: async (type) => {
      var exec =
        sh.env.mode === "production"
          ? "cd " +
            sh.env.root +
            " && npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p"
          : "ls";
      await sh.subprocess(exec, {
        close: () => {
          copy(
            sh.config.rootShell + "tailwind.sass",
            sh.env.root + "/src/tailwind.sass"
          );
          copy(
            sh.config.rootShell + "tailwind.config.js",
            sh.env.root + "/tailwind.config.js"
          );
          var dir =
            sh.env.root +
            (type == "react" ? "/src/main.jsx" : "/src/main.js");
          var code = read(dir).toString();
          write(dir, "import './tailwind.sass'\n" + code);
          sh.log("successfuly setup & install tailwindcss!");
        },
      });
    },
    createFirebaseStorage: () => {
      createDirRecursive(sh.config.directory.service);
      var code = read(sh.config.rootShell + "firebase/storage.js").toString();
      write(sh.config.directory.service + "/firebase-storage.js", code);
      var core = sh.core();
      core.success();
    },
    initializeFirebase: () => {
      createDirRecursive(sh.env.root + "/src");
      createDirRecursive(sh.env.root + "/src/service");
      copy(
        sh.config.rootShell + "firebase/firebase.js",
        sh.env.root + "/src/firebase.js"
      );
      copy(
        sh.config.rootShell + "firebase/validate.js",
        sh.env.root + "/src/service/validate-auth.js"
      );
      var core = sh.core();
      core.success();
    },
    createModelFirestore: (caseName) => {
      caseName = String(caseName).toLowerCase();
      createDirRecursive(sh.env.root + "/src/model");
      var code = read(sh.config.rootShell + "firebase/model.js")
        .toString()
        .replaceAll("model", caseName);
      write(sh.env.root + "/src/model/" + caseName + ".js", code);
      var core = sh.core();
      core.success();
    },
    success: (newline = true) => {
      if (newline) {
        process.stdout.write("\n");
      }
      sh.exit();
    },
  };
};

const defaultImport = [
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
    statement: (arg) => arg[0] == "make:form",
    maxArg: 2,
    console: {
      name: "make:form [name] [type]",
      description: "Create form boostrap",
      tab: 3,
    },
    action: async (sh) => {
      if (sh.arg[1].indexOf(",") && sh.arg[2].indexOf(",")) {
        var file = sh.SystemFile;
        var input = "";
        var name = sh.arg[1].split(","),
          type = sh.arg[2].split(",");
        var date = new Date();
        var parse = sh.parse();

        input += '<form action="" method="">\n\t<div className="row">\n';
        file.createDirRecursive(sh.root + "/form");

        for (var i = 0; i < name.length; i++) {
          var id = `${name[i]}_${i}`;
          var defaults = [
            "text",
            "email",
            "number",
            "password",
            "date",
            "datetime-local",
            "radio",
            "checkbox",
            "tel",
            "submit",
            "range",
            "button",
            "color",
            "file",
            "month",
            "url",
            "week",
          ];
          (() => {
            if (type[i] !== "hidden") {
              input += '\t\t<div className="col-auto mb-3">\n';
              input += `\t\t\t<label class="form-label" for="${id}">${parse.toUpper(
                name[i]
              )}</label>\n`;
            }
          })();
          if (defaults.find((v) => v == type[i])) {
            input += `\t\t\t<input class="form-control" type="${type[i]}" name="${name[i]}" placeholder="Required" id="${id}" required />\n`;
          } else if (type[i] == "select") {
            input += `\t\t\t<select class="form-control" name="${name[i]}" id="${id}" required><option value="">-- ${name[i]} --</option></select>\n`;
          } else if (type[i] == "textarea") {
            input += `\t\t\t<textarea rows="3" class="form-control" name="${name[i]}" id="${id}" required></textarea>\n`;
          } else if (type[i] == "hidden") {
            input += `\t\t<input type="hidden" name="${name[i]}" id="${id}"/>\n`;
          }
          (() => {
            if (type[i] !== "hidden") {
              input += "\t\t</div>\n";
            }
          })();
        }
        input += "\t</div>\n</form>";
        file.write(
          sh.root +
            "/form/form_" +
            date.getFullYear() +
            date.getDay() +
            date.getMinutes() +
            date.getSeconds() +
            ".html",
          input
        );
      }
      sh.cli();
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
    statement: (arg) => arg[0] == "schedule",
    maxArg: 2,
    console: {
      name: "schedule [file]",
      description: "Run multiple command with file",
      tab: 4,
    },
    action: async (sh) => {
      return new Promise((res) => {
        try {
          var file = sh.SystemFile;
          var txt = file.read(sh.arg[1]).toString();
          txt.split("\n").forEach(async (arg, i) => {
            var a = await sh.start(arg.split(" "));
          });
        } catch (e) {
          console.log(e.message);
        } finally {
          res(true);
        }
      });
    },
  },
  {
    statement: (arg) => arg[0] == "clear",
    console: {
      name: "clear",
      description: "Clear history command",
      tab: 6,
    },
    action: async (sh) => {
      sh.history = [];
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
      sh._config();
      sh.cli();
    },
  },
  {
    statement: (arg) => arg[0] == "mode",
    maxArg: 2,
    console: {
      name: "mode [production|development]",
      description: "Change mode command",
      tab: 3,
    },
    action: async (sh, ROOT) => {
      const name = sh.arg[1];
      if (["production", "development"].find((v) => v == name)) {
        const { append } = sh.SystemFile;
        append(ROOT + "/index", "", null, (text) =>
          text.replace(`'${sh.env.mode}'`, `'${name}'`)
        );
        sh.env.mode = name;
        sh.isProduction = sh.env.mode === "production";
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

module.exports = {
  DEFAULTS: defaultImport,
  CORE
}
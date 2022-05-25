const fs = require("fs");
const prompt = require("prompt-sync")({
  sigint: true,
});
const readline = require("readline");
const ROOT = require("path").dirname(require.main.filename);
const colors = require("colors");
const SystemFile = require("./.shell/core/SystemFile");
const ActionDefault = require("./.shell/core/ActionDefault");

class Shell {
  constructor(
    env = {
      mode: "production",
      root: "myapp",
    }
  ) {
    this.env = new Proxy(env, {
      get(obj, prop) {
        return obj[prop];
      },
      set(obj, prop, val) {
        obj[prop] = val;
        return true;
      },
    });
    this.root = this.env.root;
    this.framework = null;
    this.LIST = [];
    this.arg = [];
    this.pid = [];
    this.history = [];
    this.options = [];
    this.isProduction = this.env.mode === "production";
    this.customize = false;
    this.startcli = false;
    this.exit = this.exit.bind(this);
    this.plugin = [];
    this.core = this.core.bind(this);
    this.use = this.use.bind(this);
    this.start = this.start.bind(this);
    this.SystemFile = new SystemFile(this);
    this.quest = this.quest.bind(this);
    this.coreFeatureDefault = this.coreFeatureDefault.bind(this);
    this.cli = this.cli.bind(this);
    this._config = this._config.bind(this);
    this._config();
  }
  _config() {
    this.config = {
      rootShell: ROOT + "/.shell/",
      directory: {
        component: this.env.root + "/src/component",
        route: this.env.root + "/src/route",
        store: this.env.root + "/src/store",
        style: this.env.root + "/src/style",
        service: this.env.root + "/src/service",
        model: this.env.root + "/model",
        api: this.env.root + "/api",
      },
    };
  }
  quest(msg) {
    function complete(commands) {
      return function (str) {
        var i;
        var ret = [];
        for (i = 0; i < commands.length; i++) {
          if (commands[i].indexOf(str) == 0) ret.push(commands[i]);
        }
        return ret;
      };
    }
    let arr = this.plugin
      .map((v) => v.action.map((a) => `${v.name} ${a.console.name}`))
      .reduce((a, b) => [...a, ...b]);
    arr = [...this.history.map((v) => v.reduce((a, b) => `${a} ${b}`)), ...arr];
    return prompt(this.time() + " > " + msg, {
      autocomplete: complete([...this.history, ...arr]),
    });
  }
  use(Class) {
    var plugin = new Class(this);
    this.LIST.push(Class.name.toLowerCase());
    this.plugin.push(plugin);
  }
  cli() {
    if (this.customize && !this.startcli) {
      return process.exit();
    }
    this.startcli = true;
    const arg = this.quest("");
    this.arg = arg.split(" ");
    this.start();
  }
  start(customize = null) {
    return new Promise(async (resolve) => {
      var isFound = false;
      var firstArg = this.arg[0];

      const init = () => {
        if (!this.startcli) {
          this.arg = process.argv.slice(2);
          firstArg = this.arg[0];
        }
        if (Array.isArray(customize)) {
          this.customize = true;
          this.arg = customize;
          firstArg = this.arg[0];
        }
        if (this.arg.length === 0) {
          firstArg = "-h";
        }

        this.framework = firstArg;
        this.history = [this.arg, ...this.history];
      };
      const showConsole = (v) =>
        console.log(
          "\t",
          v.console.name,
          "\t".repeat(v.console.tab),
          v.console.description
        );
      const showTitle = (title) =>
        console.log("\n\t", this.parse().toUpper(title).cyan, "Commands".cyan);
      const showHelper = (arr, title = null) => {
        if (title) {
          showTitle(title);
        }
        arr
          .sort((a, b) => (a.name > b.name) - (a.name < b.name))
          .forEach((v) => {
            showConsole(v);
          });
      };
      const errorArg = (action) =>
        console.log(
          `${this.time()}` +
            ` Error: must be ${action.maxArg} argument`.red +
            ` *${action.console.name}`
        );
      init();

      if (["-h", "--help"].indexOf(firstArg) !== -1) {
        isFound = true;
        this.consoleHelper(() => {
          console.log("\t", "-h --help", "Show help command");
        });
        this.consoleHelper(() => {
          showTitle("Core");
          ActionDefault.sort(
            (a, b) =>
              (a.console.name > b.console.name) -
              (a.console.name < b.console.name)
          ).map((v) => {
            showConsole(v);
            resolve(true);
          });
          this.plugin
            .sort((a, b) => (a.name > b.name) - (a.name < b.name))
            .map((v) => {
              showHelper(v.action, v.name);
              resolve(true);
            });
        });
        return this.exit();
      }
      if (["-v", "--version"].indexOf(firstArg) !== -1) {
        isFound = true;
        var file = JSON.parse(this.SystemFile.read(ROOT + "/package.json"));
        console.log(this.time(), '>', "v" + file.version);
        resolve(true);
        return this.exit();
      } else {
        const parseOption = () => {
          if (Array.isArray(this.arg)) {
            let data = this.arg.map((item) => {
              if (item.indexOf("--") === 0) {
                if (item.indexOf("=") !== -1) {
                  return {
                    name: item.slice(2, item.indexOf("=")),
                    value: item.slice(item.indexOf("=") + 1),
                  };
                } else {
                  return item.slice(2);
                }
              }
            });
            let lastOption = 0;
            let cleanup = data.filter((item, key) => {
              if (item !== undefined) {
                if (typeof item === "string" && item !== "help") {
                  if (!lastOption) {
                    lastOption = key;
                  }
                  return item;
                }
                if (typeof item === "object" && item.name !== "help") {
                  if (!lastOption) {
                    lastOption = key;
                  }
                  return item;
                }
              }
            });
            this.options = cleanup;
            this.arg = lastOption ? this.arg.slice(0, lastOption) : this.arg;
          }
        };
        parseOption();
        var plugin = this.plugin.find((v) => v.name == this.framework);
        if (plugin) {
          isFound = true;
          if (["-h", "--help"].indexOf(this.arg[1]) !== -1) {
            this.consoleHelper(() => showHelper(plugin.action));
            resolve(true);
            this.exit();
          } else {
            var action = plugin.action.find((v) => v.name === this.arg[1]);
            if (action) {
              if (action.maxArg && this.arg.slice(2).length < action.maxArg) {
                errorArg(action);
                resolve(true);
                console.log("");
                this.cli();
              } else {
                await action.action(this.arg.slice(2));
                resolve(true);
                console.log("");
                this.cli();
              }
            }
          }
        } else {
          if ((this.startcli || this.customize) && !isFound) {
            const checkIndex = (text, arg1, arg2) => {
              return text.indexOf(arg1) !== -1 && text.indexOf(arg2) !== -1;
            };
            const running = ActionDefault.find(
              (v) => v.statement(this.arg) !== false
            );
            if (!running) {
              if (this.arg.length > 0 && this.arg[0] !== "" && !isFound) {
                isFound = true;
                await this.subprocess(this.arg.join(" "), {
                  close: () => {
                    resolve(true);
                    this.cli();
                  },
                  hideLog: true,
                });
              } else {
                resolve(true);
                this.exit();
              }
            } else {
              if (running.maxArg && this.arg.length < running.maxArg) {
                errorArg(running);
                resolve(true);
                this.cli();
              } else {
                isFound = true;
                await running.action(this, ROOT);
                resolve(true);
              }
            }
          }
        }
      }
    });
  }
  consoleHelper(options = Function) {
    console.log("");
    console.log("Help Commands: ");
    console.log("\t", `[${this.LIST.join(", ")}] [options]`.underline);
    console.log("options: ");
    options((...arg) => console.log("\t", ...arg));
  }
  async subprocess(
    run,
    action = {
      close: Function,
    }
  ) {
    try {
      const util = require("util");
      const exec = util.promisify(require("child_process").exec);
      (() => {
        if (!action.hideLog) {
          this.log(run.underline.blue);
        }
      })();
      let runExecute = exec(run);
      this.pid.push(runExecute.child.pid);

      if (!action.notSync) {
        runExecute = await runExecute;
        if (runExecute.stderr) {
          this.log(runExecute.stderr);
          action.close(runExecute.stderr);
          return;
        }
        await new Promise((res) => {
          setTimeout(() => res(true), 500);
        });
        if (runExecute.stdout && !action.hide) {
          runExecute.stdout.split("\n").map((v) => {
            if (v) {
              console.log(this.time(), v);
            }
          });
        }
        action.close(runExecute.stdout);
      }
    } catch (e) {
      e.message.split("\n").map((v) => {
        if (v) {
          console.log(this.time(), v.red);
        }
      });
      this.core().success(false);
    }
  }
  generateStyle(caseName, typeSelect, format) {
    var type = format;
    var dir = this.env.root + "/src/style" + "/" + typeSelect;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    if (type) {
      var name = type.toLowerCase();
      ["css", "sass", "scss"].find((value) => {
        if (name === value) {
          caseName += ".module." + value;
        }
      });
      this.SystemFile.write(
        `${this.env.root}/src/style/${typeSelect}/${caseName}`,
        `/*${caseName}*/`
      );
      return caseName;
    }
  }
  log(log) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${this.time()} ${log}\r`);
  }
  exit(skip = false) {
    if (this.startcli) {
      this.cli();
    } else {
      if (skip) {
        process.exit();
      }
    }
  }
  time() {
    var date = new Date();
    return `[${date.getHours()}:${date.getMinutes()}]`;
  }
  core() {
    const { createDirRecursive, copy, read, write, append } = this.SystemFile;
    return {
      createProject: async (name, end = Function) => {
        var exec =
          "npm create vite@latest " + this.env.root + " -- --template " + name;
        await this.subprocess(exec, {
          close: () => {
            var core = this.core();
            var code = read(
              this.config.rootShell + "vite.config.js"
            ).toString();
            code = code.replace("plugin-react", "plugin-" + name);
            write(this.env.root + "/vite.config.js", code);
            write(
              this.env.root + "/vercel.json",
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
          this.env.mode === "production"
            ? "cd " +
              this.env.root +
              " && npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p"
            : "ls";
        await this.subprocess(exec, {
          close: () => {
            copy(
              this.config.rootShell + "tailwind.sass",
              this.env.root + "/src/tailwind.sass"
            );
            copy(
              this.config.rootShell + "tailwind.config.js",
              this.env.root + "/tailwind.config.js"
            );
            var dir =
              this.env.root +
              (type == "react" ? "/src/main.jsx" : "/src/main.js");
            var code = read(dir).toString();
            write(dir, "import './tailwind.sass'\n" + code);
            this.log("successfuly setup & install tailwindcss!");
          },
        });
      },
      createFirebaseStorage: () => {
        createDirRecursive(this.config.directory.service);
        var code = read(
          this.config.rootShell + "firebase/storage.js"
        ).toString();
        write(this.config.directory.service + "/firebase-storage.js", code);
        var core = this.core();
        core.success();
      },
      initializeFirebase: () => {
        createDirRecursive(this.env.root + "/src");
        createDirRecursive(this.env.root + "/src/service");
        copy(
          this.config.rootShell + "firebase/firebase.js",
          this.env.root + "/src/firebase.js"
        );
        copy(
          this.config.rootShell + "firebase/validate.js",
          this.env.root + "/src/service/validate-auth.js"
        );
        var core = this.core();
        core.success();
      },
      createModelFirestore: (caseName) => {
        caseName = String(caseName).toLowerCase();
        createDirRecursive(this.env.root + "/src/model");
        var code = read(this.config.rootShell + "firebase/model.js")
          .toString()
          .replaceAll("model", caseName);
        write(this.env.root + "/src/model/" + caseName + ".js", code);
        var core = this.core();
        core.success();
      },
      success: (newline = true) => {
        if (newline) {
          process.stdout.write("\n");
        }
        this.exit();
      },
    };
  }
  coreFeatureDefault(core, options) {
    return [
      {
        name: "install:tailwindcss",
        console: {
          name: "install:tailwindcss",
          description: "Installation & configuration for tailwindcss",
          tab: 4,
        },
        action: async (arg) => {
          core.createTailwind(options.framework);
        },
      },
      {
        name: "make:gcs",
        console: {
          name: "make:gcs",
          description:
            "Generate service firebase-storage for upload & remove (v8)",
          tab: 5,
        },
        action: async (arg) => {
          core.createFirebaseStorage();
        },
      },
      {
        name: "make:firebase",
        console: {
          name: "make:firebase",
          description: "Generate config firebase (v9)",
          tab: 5,
        },
        action: (arg) => {
          core.initializeFirebase();
        },
      },
      {
        name: "make:model:firestore",
        maxArg: 1,
        console: {
          name: "make:model:firestore [file]",
          description: "Generate model firestore (v9)",
          tab: 3,
        },
        action: (arg) => {
          core.createModelFirestore(this.parse().removeFormat(arg[0]));
        },
      },
      {
        name: "run:server",
        console: {
          name: "run:server",
          description: "Run the server application on the background",
          tab: 5,
        },
        action: async () => {
          this.subprocess("cd " + this.root + " && npm run dev", {
            close: () => {},
            notSync: true,
          });
        },
      },
    ];
  }
  parse() {
    return {
      toUpper: (text) => (text ? text[0].toUpperCase() + text.slice(1) : null),
      removeFormat: (text) =>
        text ? text[0].toUpperCase() + text.slice(1, text.indexOf(".")) : null,
    };
  }
}

module.exports = Shell;

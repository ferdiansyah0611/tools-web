const Express = function (sh) {
  this.name = "express";
  this.config = sh.config;
  this.root = sh.config.express;
  this.parse = sh.parse();
  this.engine = ["dust", "ejs", "hbs", "hjs", "jade", "pug", "twig"];
  this.lib = ["mongoose", "sequelize"];
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
    {
      name: "make:model",
      maxArg: 3,
      console: {
        name: "make:model [file] [mongoose|sequelize] [col]",
        description: "Generate model",
        tab: 1,
      },
      action: async (arg) => {
        var { createDirRecursive, read, write, core, caseName } =
          this.init(arg);
        var name = arg[0].toLowerCase();
        var lib = arg[1].toLowerCase();
        var col = arg[2].indexOf(",") !== -1 ? arg[2] : [];
        var column = "";
        var caseName = name[0].toUpperCase() + name.slice(1, name.indexOf("."));
        var choose = this.lib.find((v) => v == lib);
        if (choose) {
          if(!col.length) {
            throw Error('must be 2 column or more!')
          }
          var split = col.split(",");
          createDirRecursive(this.config.directory.model, name);
          split.forEach((v, i) => {
            if (choose == "mongoose") {
              column +=
                `\t${v}: String,` + (i === split.length - 1 ? "" : "\n");
            } else {
              column +=
                `\t${v}: DataTypes.STRING,` +
                (i === split.length - 1 ? "" : "\n");
            }
          });
          var onreplace = choose == "mongoose" ? "new Schema({" : ".init({";
          var code = read(this.root + lib + ".js")
            .toString()
            .replaceAll("caseName", caseName)
            .replaceAll("models", caseName.toLowerCase())
            .replace(onreplace, onreplace + "\n" + column);
          write(this.config.directory.model + "/" + name, code);
          core.success();
        } else {
          sh.log(
            lib.red + ' ' +
            "is not library.".red + ' ' +
            "You can choose:"  + ' ' +
            this.lib.join(", ").underline
          );
          core.success();
        }
      },
    },
    {
      name: "make:gcs",
      console: {
        name: "make:gcs",
        description: "Generate google cloud storage in service folder",
        tab: 5,
      },
      action: async (arg) => {
        var { createDirRecursive, read, write, core, caseName } =
          this.init(arg);
        const { copy } = sh.SystemFile;
        createDirRecursive(this.config.directory.service);
        copy(
          this.config.firebase + "storage-be.js",
          this.config.directory.service + "/storage.js"
        );
        core.success();
      },
    },
    {
      name: "make:api",
      maxArg: 3,
      console: {
        name: "make:api [file] [mongoose|sequelize] [col]",
        description: "Generate crud api, routes & validation",
        tab: 1,
      },
      action: async (arg) => {
        var { core, caseName } = this.init(arg);
        const { copy, write, read, createDirRecursive } = sh.SystemFile;
        createDirRecursive(sh.env.root + '/api')
        var name = arg[0].toLowerCase();
        var lib = arg[1].toLowerCase();
        var split = arg[2].toLowerCase().split(",");
        var valid = "",
          middleware = "";
        var api = read(this.root + `api${lib}.js`).toString();
        split.forEach((v, i) => {
          valid +=
            `\t${v}: body('${v}').not().isEmpty().withMessage('${v} is required'),` +
            (i === split.length - 1 ? "" : "\n");
          middleware += `, valid.${v}`;
        });
        api = api.replace("const valid = {", `const valid = {\n${valid}`);
        api = api.replace(
          `router.post('/', validate`,
          `router.post('/', validate${middleware}`
        );
        api = api.replace(
          `router.patch('/:id', validate`,
          `router.patch('/:id', validate${middleware}`
        );
        write(sh.env.root + `/api/${caseName.toLowerCase()}.js`, api);

        var code = read(sh.env.root + "/app.js").toString();
        code = `const ${caseName}Router = require('@api/${name}');\n` + code;
        code = code.replace(
          "// catch 404 and forward to error handler",
          `// catch 404 and forward to error handler\napp.use('/api/${caseName.toLowerCase()}', ${caseName}Router)`
        );
        write(sh.env.root + "/app.js", code);
        core.success();
      },
    },
    {
      name: "make:project",
      maxArg: 2,
      console: {
        name: `make:project [template] [mongoose|sequelize]`,
        description: "Create new project include middleware authentication",
        tab: 1,
      },
      action: async (arg) => {
        let { core } = this.init([""]);
        const { copy, write, read, createDirRecursive, append } = sh.SystemFile;
        var lib = arg[0].toLowerCase();
        var engine = this.engine;
        var db = arg[1];
        if (
          engine.find((v) => v == lib.toLowerCase()) &&
          ["mongoose", "sequelize"].find((v) => v == db)
        ) {
          var folder = sh.env.root;
          var exec =
            "npx express-generator " +
            folder +
            " --view=" +
            lib +
            (sh.isProduction
              ? " && cd " +
                folder +
                ` && npm i && npm i cors express-session bcrypt express-validator jsonwebtoken uuid module-alias ${db} && npm i dotenv --save && npm i mocha supertest -D` +
                (db == "sequelize" ? " && npm i mysql2" : "")
              : "");
          await sh.subprocess(exec, {
            close: () => {
              var rootapp = this.root;
              var code = read(rootapp + "app.js").toString();
              var dbparse = this.parse.toUpper(db);
              createDirRecursive(sh.env.root + "/service");
              createDirRecursive(sh.env.root + "/api");
              createDirRecursive(sh.env.root + "/test");
              createDirRecursive(this.config.directory.model);
              copy(rootapp + `env`, sh.env.root + "/.env");
              copy(rootapp + `env`, sh.env.root + "/.env.dev");
              copy(rootapp + `env`, sh.env.root + "/.env.test");
              copy(
                rootapp + `jwt${db}.js`,
                sh.env.root + "/service/auth.js"
              );
              copy(
                rootapp + `api/authenticate_${dbparse}.js`,
                sh.env.root + "/api/authenticate.js"
              );
              copy(
                rootapp + `model/Token${dbparse}.js`,
                sh.env.root + "/model/Token.js"
              );
              copy(
                rootapp + `model/User${dbparse}.js`,
                sh.env.root + "/model/User.js"
              );
              copy(
                rootapp + `test/testing.js`,
                sh.env.root + "/test/testing.js"
              );
              code =
                `const authenticate = require('@api/authenticate');\n` + code;
              code = code
                .replace(
                  "// catch 404 and forward to error handler",
                  `// catch 404 and forward to error handler\napp.use('/api/auth', authenticate)`
                )
                .replace("'view engine', 'jade'", `'view engine', '${lib}'`);

              if (db == "sequelize") {
                copy(rootapp + `db${db}.js`, sh.env.root + "/db.js");
                var connectdb = "";
                connectdb += "// connect database\n";
                connectdb += "(async() => {\n";
                connectdb += "\ttry {\n";
                connectdb += "\t\tawait db.authenticate();\n";
                connectdb += `\t\tconsole.log('Connection has been established successfully.');\n`;
                connectdb += "\t} catch (error) {\n";
                connectdb += `\t\tconsole.error('Unable to connect to the database:', error.message);\n`;
                connectdb += "\t}\n";
                connectdb += "})();\n";
                code = code.replace(
                  "const app = express();",
                  `const app = express();\n` + connectdb
                );
                code = code.replace(
                  `const cors = require('cors');`,
                  `const cors = require('cors');\nconst db = require('./db');`
                );
              }
              // alias import
              var alias = "";
              alias += "require('module-alias').addAliases({\n";
              alias += "\t'@root'  : __dirname,\n";
              alias += "\t'@routes': __dirname + '/routes',\n";
              alias += "\t'@model': __dirname + '/model',\n";
              alias += "\t'@service': __dirname + '/service',\n";
              alias += "\t'@api': __dirname + '/api'\n";
              alias += "})\n";
              code = code.replace(
                "const authenticate",
                alias + "const authenticate"
              );
              write(sh.env.root + "/app.js", code);
              append(sh.env.root + "/package.json", "", null, (text) => {
                text = text.replace(
                  '"scripts": {',
                  `"scripts": {\n\t\t"dev": "SET DEBUG=${sh.env.root}:* && npx nodemon ./bin/www --ignore public/* --ignore testing.js",`
                );
                text = text.replace(
                  '"scripts": {',
                  `"scripts": {\n\t\t"test": "mocha test/*.js --watch --timeout 10000",`
                );
                return text;
              });
              core.success();
            },
            hide: true,
            hideLog: true,
          });
        } else {
          sh.log(
            lib.red,
            "is not engine.".red,
            "You can choose one:",
            engine.join(", ").underline
          );
          core.success();
        }
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
        sh.subprocess("cd " + sh.root + " && npm run start", {
          close: () => {},
          notSync: true,
        });
      },
    },
  ];
};

module.exports = Express;

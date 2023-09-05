import { paths } from "../constraint.js";
import { program, Option, chalk, output } from "../lib.js";
import config from "../utils/config.js";
import subprocess from "../utils/subprocess.js";
import file from "../utils/file.js";
import { toUpperFirst, removeFormat, getCaseName } from "../utils/text.js";
import { SpawnSyncReturns } from "node:child_process";

const configure = {
  list: {
    template: ["dust", "ejs", "hbs", "hjs", "jade", "pug", "twig"],
    db: ["mongoose", "sequelize"],
  },
};
const express = program.command("express").description("List express.js cli");
express
  .command("make:project")
  .description("Create new project include middleware authentication")
  .addOption(
    new Option("--template <name>", "template engine")
      .choices(configure.list.template)
      .makeOptionMandatory(),
  )
  .addOption(
    new Option("--db <name>", "database engine")
      .choices(configure.list.db)
      .makeOptionMandatory(),
  )
  .action(makeProject);

express
  .command("server:dev")
  .description("Run the server application on the background")
  .action(() => {
    const value = config.read();
    subprocess.run("cd " + config.getFullPathApp(value) + " && npm run start", {
      background: true,
    });
  });

express
  .command("make:model")
  .description("Generate model")
  .argument("<name>", "model name")
  .addOption(
    new Option("--db <name>", "database engine")
      .choices(configure.list.db)
      .makeOptionMandatory(),
  )
  .option("--col <name>", "column name (2 min)", ",")
  .action(makeModel);

express
  .command("make:api")
  .description("Generate api")
  .argument("<name>", "api name")
  .addOption(
    new Option("--db <name>", "database engine")
      .choices(configure.list.db)
      .makeOptionMandatory(),
  )
  .option("--col <name>", "column name (2 min)", ",")
  .action(makeAPI);

export async function makeProject(option: any) {
  const task = output.task("Checking Project...");
  const value = config.read();
  const dir = config.getFullPathApp(value);
  file.rm(dir);

  let execution = `npx express-generator ${dir} --view ${option.template}`;
  // production
  if (value.mode === 1) {
    execution += ` && cd ${dir}`;
    execution += ` && npm i cors express-session bcrypt express-validator jsonwebtoken uuid module-alias dotenv --save`;
    execution += ` && npm i mocha supertest -D`;
  }
  task.done().next(`Running ${chalk.green(`'${execution}'`)}`);
  let result: SpawnSyncReturns<Buffer> = await subprocess.run(execution, {
    sync: true,
    hideLog: true,
  });
  if (result.stderr.byteLength) return subprocess.error(task, result);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  task.done().next(`Generate Code...`);
  let appJsCode = file.read(`${paths.data.express}app.js`).toString();
  let upperCaseDb = toUpperFirst(option.db);
  file.mkdir(dir + "/service");
  file.mkdir(dir + "/api");
  file.mkdir(dir + "/test");
  file.mkdir(paths.directory.model([], dir));
  file.copy(paths.data.express + `env`, dir + "/.env");
  file.copy(paths.data.express + `env`, dir + "/.env.dev");
  file.copy(paths.data.express + `env`, dir + "/.env.test");
  file.copy(
    paths.data.express + `jwt${option.db}.js`,
    dir + "/service/auth.js",
  );
  file.copy(
    paths.data.express + `api/authenticate_${upperCaseDb}.js`,
    paths.directory.api(["authenticate.js"], dir),
  );
  file.copy(
    paths.data.express + `model/Token${upperCaseDb}.js`,
    paths.directory.model(["Token.js"], dir),
  );
  file.copy(
    paths.data.express + `model/User${upperCaseDb}.js`,
    paths.directory.model(["User.js"], dir),
  );
  file.copy(paths.data.express + `test/testing.js`, dir + "/test/testing.js");
  // replace app.js code
  appJsCode =
    `const authenticate = require('@api/authenticate');\n` + appJsCode;
  appJsCode = appJsCode
    .replace(
      "// catch 404 and forward to error handler",
      `// catch 404 and forward to error handler\napp.use('/api/auth', authenticate)`,
    )
    .replace("'view engine', 'jade'", `'view engine', '${option.view}'`);
  // if db sequelize
  if (option.db === "sequelize") {
    let virtual = "";
    virtual += "// connect database\n";
    virtual += "(async() => {\n";
    virtual += "\ttry {\n";
    virtual += "\t\tawait db.authenticate();\n";
    virtual += `\t\tconsole.log('Connection has been established successfully.');\n`;
    virtual += "\t} catch (error) {\n";
    virtual += `\t\tconsole.error('Unable to connect to the database:', error.message);\n`;
    virtual += "\t}\n";
    virtual += "})();\n";
    appJsCode = appJsCode.replace(
      "const app = express();",
      `const app = express();\n` + virtual,
    );
    appJsCode = appJsCode.replace(
      `const cors = require('cors');`,
      `const cors = require('cors');\nconst db = require('./db');`,
    );
    file.copy(paths.data.express + `db${option.db}.js`, dir + "/db.js");
  }
  // alias import
  let virtual = "";
  virtual += "require('module-alias').addAliases({\n";
  virtual += "\t'@root'  : __dirname,\n";
  virtual += "\t'@routes': __dirname + '/routes',\n";
  virtual += "\t'@model': __dirname + '/model',\n";
  virtual += "\t'@service': __dirname + '/service',\n";
  virtual += "\t'@api': __dirname + '/api'\n";
  virtual += "})\n";
  appJsCode = appJsCode.replace(
    "const authenticate",
    virtual + "const authenticate",
  );

  // write app.js
  file.write(dir + "/app.js", appJsCode);
  file.append(dir + "/package.json", "", null, (text: string) => {
    text = text.replace(
      '"scripts": {',
      `"scripts": {\n\t\t"dev": "SET DEBUG=${dir}:* && npx nodemon ./bin/www --ignore public/* --ignore testing.js",`,
    );
    text = text.replace(
      '"scripts": {',
      `"scripts": {\n\t\t"test": "mocha test/*.js --watch --timeout 10000",`,
    );
    return text;
  });

  task.done("Generated Code");
}

export function makeModel(name: string, option: any) {
  const task = output.task("Generate Code...");
  name = name.toLowerCase();
  let $name = getCaseName(name);
  let $models = $name.toLowerCase();
  let virtual = "";
  let filename = name.includes(".") ? name : name + ".js";

  const value = config.read();
  const dir = config.getFullPathApp(value);
  const replaceState = option.db == "mongoose" ? "new Schema({" : ".init({";
  const cols: string[] = option.col.split(",");
  if (cols.length < 2) throw Error("minimum have 2+ column!");
  cols.forEach((col, i) => {
    if (option.db === "mongoose") {
      return (virtual +=
        `\t${col}: String,` + (i === cols.length - 1 ? "" : "\n"));
    }
    return (virtual +=
      `\t${col}: DataTypes.STRING,` + (i === cols.length - 1 ? "" : "\n"));
  });
  const code = file
    .read(paths.data.express + option.db + ".js")
    .toString()
    .replaceAll("$name", $name)
    .replaceAll("$models", $models)
    .replace(replaceState, replaceState + "\n" + virtual);

  file.write(
    paths.directory.model([], dir) + "/" + toUpperFirst(filename),
    code,
  );
  task.done("Generated Code");
}

export function makeAPI(name: string, option: any) {
  const task = output.task("Generate Code...");
  const value = config.read();
  const dir = config.getFullPathApp(value);

  name = name.toLowerCase();

  let $name = removeFormat(name);
  let filename = name.includes(".") ? name : name + ".js";
  let api = file.read(paths.data.express + `api${option.db}.js`).toString();
  let validation = "";
  let middleware = "";

  const cols: string[] = option.col.split(",");
  if (cols.length < 2) throw Error("minimum have 2+ column!");
  cols.forEach((col, i) => {
    validation +=
      `\t${col}: body('${col}').not().isEmpty().withMessage('${col} is required'),` +
      (i === cols.length - 1 ? "" : "\n");
    middleware += `, valid.${col}`;
  });
  api = api.replace("const valid = {", `const valid = {\n${validation}`);
  api = api.replace(
    `router.post('/', validate`,
    `router.post('/', validate${middleware}`,
  );
  api = api.replace(
    `router.patch('/:id', validate`,
    `router.patch('/:id', validate${middleware}`,
  );
  // app.js
  let code = file.read(dir + "/app.js").toString();
  code = `const ${$name}Router = require('@api/${name}');\n` + code;
  code = code.replace(
    "// catch 404 and forward to error handler",
    `// catch 404 and forward to error handler\napp.use('/api/${$name.toLowerCase()}', ${$name}Router)`,
  );
  // writing
  file.write(dir + "/app.js", code);
  file.write(dir + `/api/${filename}`, api);
  task.done("Generated Code");
}

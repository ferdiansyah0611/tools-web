import { paths } from "../constraint.js";
import { program } from "../lib.js";
import { file } from "../utils/file.js";
import { toTitleCase, compactName } from "../utils/text.js";
import { execute, prettier } from "../utils/execute.js";
import { code } from "../utils/code.js";
import config from "../utils/config.js";

const configure = {
  list: {
    template: ["dust", "ejs", "hbs", "hjs", "jade", "pug", "twig"],
    db: ["mongoose", "sequelize"],
  },
};

const columnOption: any[] = ["--col <name>", "column name", { required: true }];
const dbOption: any[] = [
  "--db",
  "database engine",
  {
    validator: configure.list.db,
    required: true,
  },
];

program
  .command("express make:project", "Create new project")
  .option("--template", "template engine", {
    validator: configure.list.template,
    required: true,
  })
  .option(dbOption[0], dbOption[1], dbOption[2])
  .action(makeProject)

  .command("express server:dev", "Run the server application on the background")
  .action(async () => {
    const value = config.value;
    const sub = execute(`cd ${config.getFullPathApp(value)} && npm run start`, {
      background: true,
    });
    sub.doRun();
  })

  .command("express make:model", "Generate model")
  .argument("<name>", "model name")
  .option(dbOption[0], dbOption[1], dbOption[2])
  .option(columnOption[0], columnOption[1], columnOption[2])
  .action(makeModel)

  .command("express make:api", "Generate api")
  .argument("<name>", "api name")
  .option(dbOption[0], dbOption[1], dbOption[2])
  .option(columnOption[0], columnOption[1], columnOption[2])
  .action(makeAPI);

export async function makeProject({ options }: any) {
  const value = config.value;
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${value.app_path} && npx express-generator ${value.app_active} --view ${options.template}`,
    {},
  );

  file.rm(dir);

  sub.changeOnProduction(value, (current) => {
    current += ` && cd ${dir}`;
    current += ` && npm i cors express-session bcrypt express-validator jsonwebtoken uuid module-alias dotenv --save`;
    current += ` && npm i mocha supertest -D`;
    return current;
  });
  sub.doSync();

  let appJsCode = file.read(`${paths.data.express}app.js`);
  let upperCaseDb = toTitleCase(options.db);
  let fileToCopy = [
    ["env", dir + "/.env"],
    ["env", dir + "/.env.dev"],
    ["env", dir + "/.env.test"],
    [`jwt${options.db}.js`, dir + "/service/auth.js"],
    [
      `api/authenticate_${upperCaseDb}.js`,
      paths.directory.api(["authenticate.js"], dir),
    ],
    [`model/Token${upperCaseDb}.js`, paths.directory.model(["Token.js"], dir)],
    [`model/User${upperCaseDb}.js`, paths.directory.model(["User.js"], dir)],
    ["test/testing.js", dir + "/test/testing.js"],
  ];

  file.mkdir(dir + "/service", dir + "/api", dir + "/test");
  file.mkdir(paths.directory.model([], dir));
  file.copyBulk(...fileToCopy.map((v) => [paths.data.express + v[0], v[1]]));
  // replace app.js code
  appJsCode =
    `const authenticate = require('@api/authenticate');\n` + appJsCode;
  appJsCode = appJsCode
    .replace(
      "// catch 404 and forward to error handler",
      `// catch 404 and forward to error handler\napp.use('/api/auth', authenticate)`,
    )
    .replace("'view engine', 'jade'", `'view engine', '${options.view}'`);
  // if db sequelize
  if (options.db === "sequelize") {
    const virtual = code(
      "// connect database",
      "(async() => {",
      "\ttry {",
      "\t\tawait db.authenticate();",
      `\t\tconsole.log('Connection has been established successfully.');`,
      "\t} catch (error) {",
      `\t\tconsole.error('Unable to connect to the database:', error.message);`,
      "\t}",
      "})();",
    );
    appJsCode = appJsCode.replace(
      "const app = express();",
      `const app = express();\n` + virtual.v,
    );
    appJsCode = appJsCode.replace(
      `const cors = require('cors');`,
      `const cors = require('cors');\nconst db = require('./db');`,
    );
    file.copy(paths.data.express + `db${options.db}.js`, dir + "/db.js");
  }
  // alias import
  const virtual = code(
    "require('module-alias').addAliases({",
    "\t'@root'  : __dirname,",
    "\t'@routes': __dirname + '/routes',",
    "\t'@model': __dirname + '/model',",
    "\t'@service': __dirname + '/service',",
    "\t'@api': __dirname + '/api'",
    "})",
  );
  appJsCode = appJsCode.replace(
    "const authenticate",
    virtual.v + "const authenticate",
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
  prettier(dir, "/app.js");
}

export async function makeModel({ args, options }: any) {
  const dir = config.pathApp[0];
  const compact = compactName(args.name, ".js");
  const replaceState = options.db == "mongoose" ? "new Schema({" : ".init({";
  const cols: string[] = options.col.split(",");

  let virtual = "";
  if (cols.length < 2) throw Error("minimum have 2+ column!");
  cols.forEach((col, i) => {
    if (options.db === "mongoose") {
      return (virtual +=
        `\t${col}: String,` + (i === cols.length - 1 ? "" : "\n"));
    }
    return (virtual +=
      `\t${col}: DataTypes.STRING,` + (i === cols.length - 1 ? "" : "\n"));
  });
  const code = file
    .read(paths.data.express + options.db + ".js")
    .replaceAll("$name", compact.titleCaseWordOnly)
    .replaceAll("$models", compact.titleCaseWordOnly)
    .replace(replaceState, replaceState + "\n" + virtual);

  file.mkdir(paths.directory.model([compact.folder], dir));
  file.write(paths.directory.model([compact.pathTitleCase], dir), code);
}

export async function makeAPI({ args, options }: any) {
  const dir = config.pathApp[0];
  const compact = compactName(args.name, ".js");

  let api = file.read(paths.data.express + `api${options.db}.js`);
  let validation = "";
  let middleware = "";

  const cols: string[] = options.col.split(",");
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
  let code = file.read(dir + "/app.js");
  code =
    `const ${compact.camelCase}Router = require('@api/${compact.pathNoFormat}');\n` +
    code;
  code = code.replace(
    "// catch 404 and forward to error handler",
    `// catch 404 and forward to error handler\napp.use('/api/${compact.pathNoFormat}', ${compact.camelCase}Router)`,
  );

  file.mkdir(paths.directory.api([compact.folder], dir));
  file.write(dir + "/app.js", code);
  file.write(paths.directory.api([compact.path], dir), api);
}

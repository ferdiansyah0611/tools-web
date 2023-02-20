const React = function (sh) {
  this.name = "react";
  this.config = sh.config;
  this.root = (path) => sh.config.react + path;
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
      name: "make:crud:simple",
      console: {
        name: "make:crud:simple [f] [s] [style] [i] [t] [c]",
        description: "Generate simple crud using redux, include table and form",
        tab: 1,
      },
      action: (arg) => {
        return new Promise((resolve) => {
          try {
            const { createDirRecursive, read, write, fixName, caseName } =
              this.init(arg);
            const parse = this.parse;
            const { append } = sh.SystemFile;
            const store = arg[1];
            const styleType = arg[2];
            const input = arg[3].split(",");
            const typeInput = arg[4].split(",");
            const columnTable = arg[5].split(",");
            var allinput = "";
            var allcolhead = "";
            var allcolitem = "";
            var statementSearch = "";

            const disableNewlineOnLast = (i, length) =>
              i === length - 1 ? "" : "\n";

            createDirRecursive(this.config.directory.route);
            var code = read(this.root("crud/simple.jsx")).toString();
            input.reverse().forEach((v, i) => {
              code = code.replaceAll("id: 0,", `id: 0,\n\t\t${v}: '',`);
            });

            const name = input.reverse();
            const type = typeInput;
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
                  allinput += `${"\t".repeat(
                    5
                  )}<div className="flex flex-col">\n`;
                  allinput += `${"\t".repeat(
                    6
                  )}<label htmlFor="${id}">${parse.toUpper(name[i])}</label>\n`;
                }
              })();
              if (defaults.find((v) => v == type[i])) {
                allinput += `${"\t".repeat(6)}<input value={state.${
                  name[i]
                }} onChange={handle} type="${type[i]}" name="${
                  name[i]
                }" placeholder="Required" id="${id}" required />\n`;
              } else if (type[i] == "select") {
                allinput += `${"\t".repeat(6)}<select value={state.${
                  name[i]
                }} onChange={handle} name="${
                  name[i]
                }" id="${id}" required><option value="">-- SELECT --</option></select>\n`;
              } else if (type[i] == "textarea") {
                allinput += `${"\t".repeat(6)}<textarea value={state.${
                  name[i]
                }} onChange={handle} rows="1" name="${
                  name[i]
                }" placeholder="Required" id="${id}" required></textarea>\n`;
              } else if (type[i] == "hidden") {
                allinput += `${"\t".repeat(5)}<input value={state.${
                  name[i]
                }} onChange={handle} type="hidden" name="${
                  name[i]
                }" id="${id}"/>\n`;
              }
              (() => {
                if (type[i] !== "hidden") {
                  allinput +=
                    `${"\t".repeat(5)}</div>` +
                    disableNewlineOnLast(i, name.length);
                }
              })();
            }

            for (var i = 0; i < columnTable.length; i++) {
              allcolhead +=
                `${"\t".repeat(
                  8
                )}<th className="cursor-pointer asc" onClick={sort('${
                  columnTable[i]
                }')}>${columnTable[i].toUpperCase()}</th>` +
                disableNewlineOnLast(i, columnTable.length);
              allcolitem +=
                `${"\t".repeat(8)}<td>{v.${columnTable[i]}}</td>` +
                disableNewlineOnLast(i, columnTable.length);
              statementSearch += ` || lower(v.${columnTable[i]}).indexOf(value) !== -1`;
            }
            const storeName = parse.toUpper(store);
            code = code
              .replace("{/*input*/}", `{/*input*/}\n` + allinput)
              .replaceAll("sassClass", store)
              .replaceAll("caseName", caseName)
              .replace("{/*table*/}", `{/*table*/}\n` + allcolhead)
              .replace("<td>{v.id}</td>", `<td>{v.id}</td>\n` + allcolitem)
              .replace(
                "const filter = (v) => v.id === parseInt(value)",
                `const filter = (v) => v.id === parseInt(value)` +
                  statementSearch
              )
              .replaceAll("STORE", store)
              .replaceAll('colSpan="4"', `colSpan="${columnTable.length + 2}"`)
              .replaceAll("createUser", `create${storeName}`)
              .replaceAll("paginateUser", `paginate${storeName}`)
              .replaceAll("removeUser", `remove${storeName}`)
              .replaceAll("updateUser", `update${storeName}`);
            var style = sh.utils.generateStyle(caseName, "route", styleType);
            var styledefault = read(this.root("crud/simple.sass"))
              .toString()
              .replace("home", store);
            var url = caseName.toLowerCase();
            if (style) {
              code = `import '@style/route/${style}'\n` + code;
            }
            write(this.config.directory.route + "/" + fixName, code);
            write(
              this.config.directory.style +
                "/route/" +
                caseName +
                "." +
                styleType,
              styledefault
            );
            var importing = `import ${caseName} from '@route/${caseName}'`,
              routeIndex = this.config.directory.route + "/index.jsx",
              check = read(routeIndex).toString().indexOf(importing) === -1;
            if (check) {
              append(routeIndex, "", null, (text) =>
                text
                  .replace(
                    "// dont remove this comment 1",
                    `// dont remove this comment 1\n${importing}`
                  )
                  .replace(
                    "{/*dont remove this comment 2*/}",
                    `{/*dont remove this comment 2*/}\n\t\t\t\t\t<Route path="${url}" element={<${caseName}/>}/>`
                  )
              );
            }
          } catch (e) {
            console.log(e);
          } finally {
            resolve(true);
          }
        });
      },
    },
    {
      name: "make:component",
      console: {
        name: "make:component [file] [css|sass|scss]",
        description: "Generate component",
        tab: 2,
      },
      action: (arg) => {
        const { createDirRecursive, read, write, fixName, caseName } =
          this.init(arg);
        return new Promise((resolve) => {
          createDirRecursive(this.config.directory.component, fixName);
          var code = read(this.root("component.jsx"))
            .toString()
            .replaceAll("caseName", caseName);
          if (arg[1]) {
            var style = sh.utils.generateStyle(caseName, "component", arg[1]);
            if (style) {
              code = `import styled from '@style/component/${style}'\n` + code;
            }
          }
          write(this.config.directory.component + "/" + fixName, code);
          resolve(true);
        });
      },
    },
    {
      name: "make:route",
      console: {
        name: "make:route [file] [css|sass|scss] [url]",
        description: "Generate route pages",
        tab: 1,
      },
      action: (arg) => {
        const { createDirRecursive, read, write, fixName, caseName } =
          this.init(arg);
        const { append } = sh.SystemFile;
        const url = arg[2].toLowerCase();

        return new Promise(async (resolve) => {
          createDirRecursive(this.config.directory.route, fixName);
          var code = read(this.root("route.jsx"))
            .toString()
            .replaceAll("caseName", caseName);
          if (arg[1]) {
            var style = sh.utils.generateStyle(caseName, "route", arg[1]);
            if (style) {
              code = `import '@style/route/${style}'\n` + code;
            }
          }
          write(this.config.directory.route + "/" + fixName, code);
          var _import = `import ${caseName} from '@route/${caseName}'`,
            routeIndex = this.config.directory.route + "/index.jsx",
            check = read(routeIndex).toString().indexOf(_import) === -1;
          if (check) {
            append(routeIndex, "", null, (text) =>
              text
                .replace(
                  "// dont remove this comment 1",
                  `// dont remove this comment 1\n${_import}`
                )
                .replace(
                  "{/*dont remove this comment 2*/}",
                  `{/*dont remove this comment 2*/}\n\t\t\t\t\t<Route path="${url}" element={<${caseName}/>}/>`
                )
            );
          }
          resolve(true);
        });
      },
    },
    {
      name: "make:store",
      console: {
        name: "make:store [file] [async|reducer] [url]",
        description: "Generate store redux toolkit",
        tab: 1,
      },
      action: (arg) => {
        let { createDirRecursive, read, write, fixName, caseName } =
          this.init(arg);
        const { append } = sh.SystemFile;
        fixName = fixName.toLowerCase();
        caseName = caseName.toLowerCase();
        return new Promise(async (resolve) => {
          createDirRecursive(this.config.directory.store);
          var code;
          var async = arg[1] && arg[1].toLowerCase() == "async";
          var reducer = arg[1] && arg[1].toLowerCase() == "reducer";
          if (async) {
            var url = arg[2] || "http://localhost:8000/api/user";
            code = read(this.root("store-crud.js"))
              .toString()
              .replaceAll("caseName", caseName)
              .replaceAll("BASEURL", url);
          } else {
            if (reducer) {
              var txt = read(this.root("store-crud-reducer.js"));
              var firstCase = caseName[0].toUpperCase() + caseName.slice(1);
              code = txt
                .toString()
                .replaceAll("app", caseName)
                .replaceAll("namestore", caseName)
                .replaceAll("NameExport", firstCase)
                .replaceAll(
                  "// import",
                  `// import {handle${firstCase}, reset${firstCase}, create${firstCase}, findOne${firstCase}, update${firstCase}, remove${firstCase}} from @store/${caseName}`
                );
            } else {
              code = read(this.root("store.js"))
                .toString()
                .replaceAll("appSlice", caseName + "Slice")
                .replaceAll("namestore", caseName);
            }
          }
          (() => {
            var storeIndex = this.config.directory.store + "/index.js",
              imported = `import ${caseName.toLowerCase()}Reducer from './${caseName.toLowerCase()}'`;
            write(this.config.directory.store + "/" + fixName, code);
            var check = read(storeIndex).toString().indexOf(imported) === -1;
            if (check) {
              append(storeIndex, "", null, (text) =>
                text
                  .replace(
                    "// dont remove this comment 1",
                    `// dont remove this comment 1\n${imported}`
                  )
                  .replace(
                    "reducer: {",
                    `reducer: {\n\t\t${caseName.toLowerCase()}: ${caseName.toLowerCase()}Reducer,`
                  )
              );
            }
          })();
          resolve(true);
        });
      },
    },
    {
      name: "make:route:crud",
      console: {
        name: "make:route:crud [name]",
        description: "Generate route crud for store",
        tab: 3,
      },
      action: (arg) => {
        let { createDirRecursive, read, write, fixName, caseName } =
          this.init(arg);
        const { append } = sh.SystemFile;
        var store = arg[0];
        return new Promise(async (resolve) => {
          createDirRecursive(
            this.config.directory.route + "/" + store,
            fixName
          );
          var upperName = fixName,
            fullDir =
              this.config.directory.route + "/" + store + "/" + upperName;
          if (store) {
            var generateCreateoredit = () => {
              var code = read(this.root("crud/createoredit.jsx"))
                .toString()
                .replaceAll("storename", store);
              write(fullDir + "createoredit.jsx", code);
            };
            var generateShow = () => {
              var code = read(this.root("crud/show.jsx"))
                .toString()
                .replaceAll("storename", store);
              write(fullDir + "show.jsx", code);
            };
            var generateTable = () => {
              var code = read(this.root("crud/table.jsx"))
                .toString()
                .replaceAll("storename", store)
                .replaceAll("nameTable", upperName + "table");
              write(fullDir + "table.jsx", code);
            };
            generateCreateoredit();
            generateShow();
            generateTable();
          }
          var directoryImport = "@route/" + store + "/" + upperName;
          var code = "",
            routeList = "";
          var importing = `import ${upperName}createoredit from '${directoryImport}createoredit'\n`,
            routeIndex = this.config.directory.route + "/index.jsx",
            check = read(routeIndex).toString().indexOf(importing) === -1;

          if (check) {
            code += importing;
            code += `import ${upperName}show from '${directoryImport}show'\n`;
            code += `import ${upperName}table from '${directoryImport}table'\n`;
            routeList += `${"\t".repeat(
              5
            )}<Route path="${store}" element={${upperName}table}/>\n`;
            routeList += `${"\t".repeat(
              5
            )}<Route path="${store}/:id" element={${upperName}show}/>\n`;
            routeList += `${"\t".repeat(
              5
            )}<Route path="${store}/:id/edit" element={${upperName}createoredit}/>\n`;
            routeList += `${"\t".repeat(
              5
            )}<Route path="${store}/create" element={${upperName}createoredit}/>`;
            append(routeIndex, "", null, (text) =>
              text
                .replace(
                  "// dont remove this comment 1",
                  `// dont remove this comment 1\n${code}`
                )
                .replace(
                  "{/*dont remove this comment 2*/}",
                  `{/*dont remove this comment 2*/}\n${routeList}`
                )
            );
          }
          resolve(true);
        });
      },
    },
    {
      name: "make:project",
      console: {
        name: "make:project",
        description: "Create new project using vite",
        tab: 5,
      },
      action: (arg) => {
        let file = sh.SystemFile;
        return new Promise(async (resolve) => {
          await sh.utils.createVite("react", async() => {
            var exec = "cd " + sh.env.root + " && npm i && npm i @reduxjs/toolkit react-redux react-router-dom axios";
            await sh.subprocess(sh.env.mode === 1 ? exec : "echo 1", {
              close: () => {
                file.createDirRecursive(this.config.directory.service);
                file.createDirRecursive(this.config.directory.style);
                file.createDirRecursive(this.config.directory.component);
                file.createDirRecursive(this.config.directory.store);
                file.createDirRecursive(this.config.directory.route);
                file.copy(
                  this.root("route/index.jsx"),
                  this.config.directory.route + "/index.jsx"
                );
                file.copy(
                  this.root("route/Home.jsx"),
                  this.config.directory.route + "/Home.jsx"
                );
                file.copy(
                  this.root("route/About.jsx"),
                  this.config.directory.route + "/About.jsx"
                );
                file.copy(
                  this.root("service/auth.js"),
                  this.config.directory.service + "/auth.js"
                );
                file.copy(
                  this.root("service/http.js"),
                  this.config.directory.service + "/http.js"
                );
                file.copy(
                  this.root("store/index.js"),
                  this.config.directory.store + "/index.js"
                );
                file.copy(
                  this.root("store/app.js"),
                  this.config.directory.store + "/app.js"
                );
                file.copy(
                  this.root("component/template.jsx"),
                  this.config.directory.component + "/template.jsx"
                );
                file.copy(this.root("App.jsx"), sh.env.root + "/src/App.jsx");
                file.copy(this.root("main.jsx"), sh.env.root + "/src/main.jsx");
                resolve(true);
              }
            })
          });
        });
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
      action: async () => {
        await sh.utils.createTailwind(this.name);
      },
    },
    {
      name: "add:antd",
      console: {
        name: "add:antd",
        description:
          "Install antd library",
        tab: 5,
      },
      action: () => {
        return new Promise(async(resolve) => {
          const file = sh.SystemFile
          await sh.subprocess(
            sh.env.mode === 1
              ? "cd " +
                  sh.root +
                  " && npm install antd --save"
              : "echo 1",
            {
              close: () => {
                file.append(sh.env.root + "/src/index.css", "@import '../node_modules/antd/dist/antd.css';\n")
                resolve(true);
              },
            }
          );
        })
      }
    },
    {
      name: "add:mui",
      console: {
        name: "add:mui",
        description:
          "Install the Material UI & include toggle dark/light theme & palette colors",
        tab: 5,
      },
      action: () => {
        let { copy } = sh.SystemFile;
        return new Promise(async (resolve) => {
          await sh.subprocess(
            sh.env.mode === 1
              ? "cd " +
                  sh.root +
                  " && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material --save"
              : "echo 1",
            {
              close: () => {
                copy(
                  this.root("store/theme"),
                  this.config.directory.store + "/theme.js"
                );
                copy(this.root("mui.jsx"), sh.env.root + "/src/mui.jsx");
                copy(
                  this.root("service/color.js"),
                  this.config.directory.service + "/color.js"
                );
                resolve(true);
              },
            }
          );
        });
      },
    },
  ];
};

module.exports = React;

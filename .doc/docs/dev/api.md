---
title: API Reference
---

# API Reference

Prototype in class Shell

```javascript
const sh = new Shell({
  mode: 1,
  root: "myapp",
});
```

## arg: Array

list of argument cli

```javascript
sh.log(sh.arg);
```

## options: Array

list of options cli

```javascript
sh.log(sh.options);
```

## env: Object

config on parameter.

```javascript
sh.log(sh.env.mode, sh.env.root, sh.env.engine);
```

## root: String

default root app

```javascript
sh.log(sh.root);
```

## plugin: Array

list of plugin registered.

```javascript
sh.log(sh.plugin);
```

## framework: Array

selected of framework or library.

```javascript
sh.log(sh.framework);
```

## use(funct)

function to integrate plugins.

```javascript
sh.use(Plugin);
```

## add(framework, action)

function to push action in plugins.

```javascript
sh.add("react", {
  name: "print",
  console: {
    name: "print",
    description: "hello world",
    tab: 1,
  },
  action(arg, shell, plugin) {
    console.log("hello world!!!")
    // console.log(arg, shell, plugin);
  },
});
```

## quest(string)

function to question cli using prompt.

```javascript
const v = sh.quest("whats your name?");
```

## start()

run the tools-web.

```javascript
sh.start();
```

## exit()

onclose the tools-web.

```javascript
sh.exit();
```

## log(arg)

logger the tools-web.

```javascript
sh.log("running");
```

## console(arg)

console.log with timer.

```javascript
sh.console("running");
```

## SystemFile: class SystemFile

prototype to manage file.

```javascript
const file = sh.SystemFile;
```

### copy(oldfile, newfile, success)

copy specified file.

```javascript
file.copy("myapp/src/app.sass", "myapp/src/tailwind.sass", () =>
  sh.log("success")
);
```

### app: class Shell

current class Shell

```javascript
sh.log(file.app);
```

### write(filepath, value)

write specified file.

```javascript
file.write("myapp/src/app.sass", "#app{}");
```

### read(filepath)

read specified file.

```javascript
file.read("myapp/src/app.sass"); // return value file utf8
```

### append(filepath, first, end = null, textCallback = null)

function to append file.

```javascript
file.append("myapp/index.js", "import time\n");
file.append("myapp/index.js", "import time\n", null, (text) =>
  text.replace(" ", "hello world")
);
```

### createDirRecursive(root, name)

function to create directory recursive.

```javascript
sh.createDirRecursive("myapp", "test");
```

## utils: Utils

prototype utility.

```javascript
const utils = sh.utils;
```

### generateStyle(name, type)

function to generate style.

```javascript
utils.generateStyle("myapp.scss", "component");
```

### createVite(type)

create project frontend vite.

```javascript
await core.createVite("vue");
```

### createTailwind(type)

install & config tailwindcss frontend vite.

```javascript
await core.createTailwind("vue");
```

## time()

return datetime [hours:minutes].

```javascript
sh.time();
```

## subprocess(run, action)

function to run subprocess cli.

```javascript
(async () => {
  await sh.subprocess("npm --help", {
    close: () => sh.log("closed"),
  });
})();
```

## consoleHelper(func)

show help command with options customize.

```javascript
sh.consoleHelper((log) => {
  log("--test", ":= test code");
});
```

## parse()

return function parse.

```javascript
const parse = sh.parse();
parse.toUpper("helloworld.js"); // return Helloworld.js
parse.removeFormat("helloworld.js"); // return helloworld
```

## success()

Call this function if end of execute.

```javascript
sh.success();
```
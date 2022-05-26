---
title: API Reference
---

# API Reference

Prototype in class Shell

```javascript
const sh = new Shell({
  mode: "development",
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

## time()

return datetime [hours:minutes].

```javascript
sh.time();
```

## generateStyle(name, type)

function to generate style.

```javascript
sh.generateStyle("myapp.scss", "component");
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

## core()

return function core.

```javascript
const core = sh.core();
```

### createProject(type)

create project frontend vite.

```javascript
core.createProject("vue");
```

### createTailwind(type)

install & config tailwindcss frontend vite.

```javascript
core.createTailwind("vue");
```

### createFirebaseStorage(name)

Generate service firebase-storage for upload & remove (v8).

```javascript
core.createFirebaseStorage("vue");
```

### initializeFirebase()

Generate config firebase (v9).

```javascript
core.initializeFirebase();
```

### createModelFirestore()

Generate model firestore (v9).

```javascript
core.createModelFirestore(caseName);
```

### success()

Call this function if end of execute.

```javascript
core.success();
```

## parse()

return function parse.

```javascript
const parse = sh.parse();
parse.toUpper("helloworld.js"); // return Helloworld.js
parse.removeFormat("helloworld.js"); // return helloworld
```

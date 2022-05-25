---
title: Create Plugin
---

# Create Plugin

Step by step to create the plugin to integrate tools-web.

- **Step 1:** create function
  ```javascript
  const Test = function (sh) {
    this.name = "test";
    // action command
    this.action = [
      {
        name: "make",
        maxArg: 1,
        console: {
          name: "make [file]",
          description: "Make test",
          tab: 2,
        },
        action: () => {
          console.log("test done. " + sh.arg[2]);
          if(sh.options.find(item => item === 'drop')) {
            console.log(sh.time(), '> --drop in options')
          }
          if(sh.options.find(item => item?.example)) {
            let data = sh.options.find(item => item?.example)
            console.log(sh.time(), '> get value in options example,', data.value)
          }
        },
      }
    ];
  };
  ```
- **Step 2:** call function use
  ```javascript
  const Shell = require("./shell");

  sh.use(Test);
  sh.cli();
  ```
- **Step 3:** run command
  ```bash
  test -h
  test --help
  test make app.js
  test make app.js --drop
  test make app.js --example=App
  ```

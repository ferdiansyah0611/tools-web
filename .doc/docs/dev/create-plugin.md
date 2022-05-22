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
        name: "test",
        console: {
          name: "--test",
          description: "Show test",
          tab: 2,
        },
        action: () => {
          sh.log("test done.");
        },
      },
      {
        name: "create",
        console: {
          name: "--create=Test.jsx",
          description: "Create new project",
          tab: 1,
        },
        action: () => {
          // if you want get arg value "Test.jsx" at --create=Test.jsx
          sh.log("argument value:", sh.options.name);
        },
      },
    ];
  };
  ```
- **Step 2:** call function use
  ```javascript
  sh.use(Test);
  ```
- **Step 3:** run command
  ```bash
  node index.js test -h
  node index.js test --test
  node index.js test --create=Test.ts
  ```

---
title: Create Plugin
---

# Create Plugin

Step by step to create the plugin to integrate tools-web.

- **Step 1:** create function
	```javascript
	const Test = function () {
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
				action: (arg, sh, plug, ROOT) => {
					let findExample = sh.options.find((item) => item?.name === "example");
					sh.console("file is " + arg[0]);
					if (sh.options.find((item) => item === "drop")) {
						sh.console("--drop in options");
					}
					if (findExample) {
						sh.console("--example value options is " + findExample.value);
					}
				},
			},
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

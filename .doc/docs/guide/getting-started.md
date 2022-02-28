---
title: Getting Started
---
# Getting Started
This section will help you use web-tools from scratch.
- **Step 1:** Cloning tools-web
	```bash
	git clone https://github.com/ferdiansyah0611/tools-web.git
	```
- **step 2:** Change into a new directory
	```bash
	rename tools-web container-app && cd container-app
	```
- **Step 3:** Install the package library
	```bash
	npm install
	```
- **Step 4:** Start command
	```bash
	node index.js -h	
	```
- **Step 5:** Change your default web app folder
	```javascript
	// index.js
	const Shell = require('./shell')
	const sh = new Shell({
		mode: 'production',
		root: 'myappdefault'
		engine: 'ejs' // engine for express
	})
	sh.start()
	```
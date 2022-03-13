---
title: Codeigniter 4
---
# Getting Started
This section will help you use plugin Codeigniter 4 from scratch.
- **Step 1:** Require plugin
	```javascript
	const CI4 = require('./.plugin/codeigniter4')
	sh.use(CI4)
	```
- **step 2:** Run your shell
	```bash
	ci4 --help
	```
# Feature
This plugin has several features such as create new project, UserController, CRUD, generate views using argon, authentication, and authentication API.
# Usage CLI
Here are some uses of the cli Codeigniter 4 on tools-web.
```bash
ci4 --auth
ci4 --user
ci4 --template-argon
ci4 --view-argon=namefolderviews
ci4 --auth-view-argon
ci4 --project
ci4 --auth-api
ci4 --crud=MyController;MyModel
```
---
title: Codeigniter 4
---
# Getting Started
This section will help you use plugin Codeigniter 4 from scratch.
- **Step 1:** Run tools-web
	```bash
	twb
	```
- **Step 1:** Install the plugin
	```bash
	install ci4 tools-web.codeigniter4
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
ci4 install:datatable
ci4 make:auth
ci4 make:user
ci4 make:crud MyController MyModel user_id,product_id,payment
ci4 make:api:crud MyController MyModel user_id,product_id,payment
ci4 make:api:auth
ci4 make:project
ci4 view:template-argon
ci4 view:argon folders user_id,product_id,payment
ci4 view:auth-argon
ci4 run:server
```
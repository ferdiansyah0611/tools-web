---
title: Basic CLI
---
# Basic CLI :robot:
This section will explain about the basic commands in using tools-web

Stop the command.
```bash
exit
```
You can run more command on system. Example
```bash
dir
```
Change default root app.
```bash
app myapp
```
Change mode env.
```bash
mode production
```
Run previous command.
```bash
-1
```
Clear the history command.
```bash
clear
```
Get version of tools-web.
```bash
-v
```
Show value of variable in the class.
```bash
show env
```
## Edit file
```bash
edit
# example result:
# please run: cd C:\Users\ferdi\project\tools-web && vim index
```
## Install the plugin
You can install another plugin or uninstall it.
```bash
install tools-web.codeigniter4
```
```bash
uninstall tools-web.codeigniter4
```
Update the package
```bash
update
```
## Multiple Run
You can run multiple commands at once by passing them a parameter in the start function.
Edit index using vim
```bash
edit
```
Add this code
```javascript
const schedule = [
	['ci4', 'make:user'],
	['ci4', 'make:auth'],
	['ci4', 'make:crud', 'CustomerController', 'Customer'],
	['ci4', 'make:crud', 'ProductController', 'Product'],
]
schedule.map(v => {
	sh.start(v)
})
```

<b>Using text file</b>

- Run the cli
```bash
twb
```
- write my.txt
```text
ci4 make:user
ci4 make:auth
ci4 make:crud CustomerController Customer
ci4 make:crud ProductController Product
```
- Command to run schedule
```bash
schedule my.txt
```
::: warning
Not recommendation if you want to install project using this schedule.
:::

## Form Generator Bootstrap
Create form generator with bootstrap framework.
```bash
make:form id,name,email,password,phone,born hidden,text,email,password,number,date
```
## Testing API
Creating testing api using deno with CRUD method and can customize.
```bash
test:api user.js
```
After generate code, you can run like this
```bash
deno run --allow-net test/api.js user.get
deno run --allow-net test/api.js user.add
deno run --allow-net test/api.js user.update yourid
deno run --allow-net test/api.js user.remove yourid
deno run --allow-net test/api.js user.id yourid
```
Customize your input data or add API and anything.
```javascript {5,6,10,11,14-25}
run([
	...crud('user','http://localhost:3000/api/users', {
		// data on add
		add: {
			name: 'ferdiansyah',
			password: 'ferdi123',
		},
		// data on update
		update: {
			name: 'ferdiansyah',
			password: 'ferdi12345'
		}
	}),
	...crud('blog','http://localhost:3000/api/blog', {
		// data on add
		add: {
			title: 'hello world',
			description: 'hi, I am ferdiansyah',
		},
		// data on update
		update: {
			title: 'hello world',
			description: 'hi, I am safina sahda',
		}
	}),
])
```
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
## Edit file
```bash
edit
# example result:
# please run: cd C:\Users\ferdi\project\tools-web && vim index
```
## Install the plugin
You can install another plugin or uninstall it.
```bash
install ci4 tools-web.codeigniter4
```
```bash
uninstall ci4 tools-web.codeigniter4
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
---
title: Simple CLI
---
# Simple CLI :robot:
Don't want to rerun using `node index.js` multiple times. The solution is to use the Simple CLI. Just run it once and you are free to run any command.
```javascript {7}
const sh = new Shell({
	mode: 'production',
	root: 'myapp',
	engine: 'ejs'
})
sh.use(App)
sh.cli()
// sh.start()
```
Run in one time
```bash
node index.js
```
And type your command without `node index.js` again
```bash
express -h
```
If you want stop cli
```bash
exit
```
You can run more command on system. Example
```bash
dir .shell
```
Change default root app.
```bash
app=myapp
```
Change mode env.
```bash
mode=production
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
# Multiple Run
You can run multiple commands at once by passing them a parameter in the start function.
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
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
sh.start()
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
---
title: API Reference
---
# API Reference
Prototype in class Shell
```javascript
const sh = new Shell({
	mode: 'development',
	root: 'myapp',
	engine: 'ejs'
})
```
## arg: Array
list of argument cli
```javascript
this.log(sh.arg)
```
## plugin: Array
list of plugin registered.
```javascript
this.log(sh.plugin)
```
## framework: Array
selected of framework or library.
```javascript
this.log(sh.framework)
```
## use(funct)
function to integrate plugins.
```javascript
sh.use(Plugin)
```
## start()
run the tools-web.
```javascript
sh.start()
```
## exit()
onclose the tools-web.
```javascript
sh.exit()
```
## log(...arg)
logger the tools-web.
```javascript
sh.log('running')
```
## copy(oldfile, newfile, onsuccess)
copy specified file.
```javascript
sh.copy('myapp/src/app.sass', 'myapp/src/tailwind.sass', () => sh.log('success'))
```
## write(filepath, value)
write specified file.
```javascript
sh.write('myapp/src/app.sass', '#app{}')
```
## read(filepath)
read specified file.
```javascript
sh.read('myapp/src/app.sass') // return value file utf8
```
## time()
return datetime [hours:minutes].
```javascript
sh.time()
```
## __console__(func)
show help command with options customize.
```javascript
sh.__console__(() => {
	console.log('\t', '--test', ':= test code')
})
```
## generateStyle(name, type)
function to generate style.
```javascript
sh.generateStyle('myapp.scss', 'component')
```
## createDirRecursive(root, fixName)
function to create directory recursive.
```javascript
sh.createDirRecursive('myapp', 'test')
```
## subprocess(run, action)
function to run subprocess cli.
```javascript
sh.subprocess('npm --help', {
	close: () => sh.log('closed')
})
```
## append(filepath, first, end = null)
function to append file.
```javascript
sh.append('myapp/index.js', 'import time\n')
```
## core()
return function core.
```javascript
const core = sh.core()
```
### writing(isMsg = true)
write file with file at sh.input
```javascript
core.writing()
```
### createProject(type)
create project frontend vite.
```javascript
core.createProject('vue')
```
### createTailwind(type)
install & config tailwindcss frontend vite.
```javascript
core.createTailwind('vue')
```
### createFirebaseStorage(name)
Generate service firebase-storage for upload & remove (v8).
```javascript
core.createFirebaseStorage('vue')
```
## application()
run list of application framework/library.
```javascript
const app = sh.application()
app.react()
app.vue()
app.express()
```
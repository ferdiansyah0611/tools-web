const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });

class SystemFile{
	constructor(app){
		this.app = app
		this.createDirRecursive = this.createDirRecursive.bind(this)
		this.append = this.append.bind(this)
		this.copy = this.copy.bind(this)
		this.write = this.write.bind(this)
		this.read = this.read.bind(this)
	}
	createDirRecursive(dir){
		if (!fs.existsSync(dir)){
				this.app.log('create directory', dir)
		    return fs.mkdirSync(dir, { recursive: true });
		}
	}
	append(filepath, first, end = null){
		var text = fs.readFileSync(filepath, 'utf8').toString()
		fs.writeFileSync(filepath, first + text + (end || ''))
	}
	copy(copy, dir, callback = Function){
		fs.copyFile(copy, dir, callback)
		return this.app.log('writing', dir)
	}
	write(dir, val){
		fs.writeFileSync(dir, val)
		return this.app.log('writing', dir)
	}
	read(dir){
		return fs.readFileSync(dir, 'utf8')
	}
}

class Shell{
	constructor(env = {mode: 'production', root: 'myapp', engine: 'ejs'}){
		this.config = {
			rootShell: './.shell/',
			directory: {
				component: env.root + '/src/component',
				route: env.root + '/src/route',
				store: env.root + '/src/store',
				style: env.root + '/src/style',
				service: env.root + '/src/service',
				model: env.root + '/model',
				api: env.root + '/api',
			}
		}
		this.framework = null
		this.LIST = ['react', 'vue', 'express']
		this.env = env
		this.arg = []
		this.input = {
			name: '',
			code: ''
		}
		this.options = {
			dir: null,
			choose: '',
			name: ''
		}
		this.plugin = []
		this.core = this.core.bind(this)
		this.use = this.use.bind(this)
		this.start = this.start.bind(this)
		this.SystemFile = new SystemFile(this)
	}
	use(Class){
		var plugin = new Class(this)
		this.LIST.push(Class.name.toLowerCase())
		this.plugin.push(plugin)
	}
	start(){
		this.arg = process.argv.slice(2)
		const consoles = Shell.CONSOLE_HELP()
		console.log('')
		if(this.LIST.indexOf(this.arg[0]) !== -1){
			this.framework = this.arg[0]
			if(this.arg.length >= 3){
				var options = this.arg[2].split('=')
				this.options = {
					dir: this.arg[1],
					choose: options[0].split('--')[1],
					name: options[1]
				}
			}
			if(this.arg.length === 2){
				var options = this.arg[1].split('=')
				this.options = {
					dir: null,
					choose: options[0].split('--')[1],
					name: String(options[1]).indexOf(';') !== -1 ? options[1].replace(new RegExp(/;\S+/), ''): options[1],
					lib: String(options[1]).indexOf(';') !== -1 ? options[1].replace(new RegExp(/\S+;/), ''): null
				}
			}
			// init app
			this.application = this.application.bind(this)
			const app = this.application()
			// statement app
			switch(this.framework){
				case "react":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.consoleHelper(consoles.react)
						process.exit()
					}else{
						app.react()
					}
					break
				case "vue":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.consoleHelper(consoles.vue)
						process.exit()
					}else{
						app.vue()
					}
					break
				case "express":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.consoleHelper(consoles.express)
						process.exit()
					}else{
						app.express()
					}
					break
				default:
					var plugin = this.plugin.find(v => v.name == this.framework)
					if(plugin){
						if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
							this.consoleHelper(plugin.help)
							process.exit()
						}else{
							var action = plugin.action.find(v => this.options.choose.match(new RegExp(v)))
							if(action){
								action.action()
							}
						}
					}else{
						process.exit()
					}
			}
		}
		if(['-h', '--help'].indexOf(this.arg[0]) !== -1){
			this.consoleHelper(() => {
				console.log('\t', '-h --help', 'Show help command')
			})
		}
	}
	consoleHelper(options = Function){
		console.log('Help Commands: ')
		console.log('\t', `node index.js [${this.LIST.join(', ')}] folder? [options]`)
		console.log('\t', `node index.js [${this.LIST.join(', ')}] [options]`)
		console.log('options: ')
		options((...arg) => console.log('\t', ...arg))
		process.exit()
	}
	subprocess(run, action = {close: Function}){
		const { exec } = require('child_process');
		exec(run, (err, stdout, stderr) => {
		  if (err) {
		    console.log(`error: ${err.message}`);
		    process.exit()
		    return;
		  }
		  action.close(stdout)
		})
	}
	generateStyle(caseName, typeSelect){
		console.log('')
		var type = prompt(this.time() + ` generate (css|scss|sass) or empty : `);
		var dir = this.env.root + '/src/style' + '/' + typeSelect
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir, { recursive: true });
		}
		if(type){
			var name = type.toLowerCase();
			['css', 'sass', 'scss'].find((value) => {
				if(name === value){
					caseName += '.' + value
				}
			})
			this.SystemFile.write(this.env.root + `/src/style/${typeSelect}/${caseName}`, `/*${caseName}*/`)
			return caseName
		}
	}
	log(...log){
		console.log(this.time(), ...log)
	}
	exit(skip = false){
		if(skip){
			if(this.env.mode === 'development'){
				fs.rmSync(this.env.root, { recursive: true, force: true })
			}
		}
	}
	time(){
		var date = new Date()
		return `[${date.getHours()}:${date.getMinutes()}]`
	}
	core(){
		const { createDirRecursive, copy, read, write, append } = this.SystemFile
		return{
			createProject: (name, end = Function) => {
				this.log('create new project...')
				this.subprocess('npm create vite@latest ' + this.arg[1] + ' -- --template ' + name, {
					close: () => {
						var code = read(this.config.rootShell + 'vite.config.js').toString(), core = this.core()
						write(this.env.root + '/vite.config.js', code)
						end()
						core.success()
					}
				})
			},
			createTailwind: (type) => {
				var install_tailwind = this.env.mode === 'production' ? 'npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p' : 'ls'
				this.log(install_tailwind)
				this.subprocess(install_tailwind, {
					close: () => {
						copy(this.config.rootShell + 'tailwind.sass', this.env.root + '/src/tailwind.sass')
						copy(this.config.rootShell + 'tailwind.config.js', this.env.root + '/tailwind.config.js')
						var dir = this.env.root + (type == 'react' ? '/src/main.jsx': '/src/main.js')
						var code = read(dir).toString()
						write(dir, "import './tailwind.sass'\n" + code)
						this.log('successfuly setup & install tailwindcss!')
					}
				})
			},
			createFirebaseStorage: (fixName) => {
				createDirRecursive(this.config.directory.service, fixName)
				var txt = read(this.config.rootShell + 'firebase/storage.js')
				var code = txt.toString()
				this.input.name = this.config.directory.service + '/firebase-storage.js'
				this.input.code = code
				this.log('copy if you want to import!')
				this.log(`import {storage, upload, remove} from '@service/firebase-storage.js'`)
				this.core().writing()
			},
			success: () => {
				this.log('create successfuly!\n')
			}
		}
	}
	application(){
		const { input } = this
		const { createDirRecursive, copy, read, write, append } = this.SystemFile
		const core = this.core()
		const writing = core.writing

		return{
			react: () => {
				this.config.rootShellApp = this.config.rootShell + 'react/'
				var listcli = ['component', 'route', 'store', 'tailwindcss', 'firebase-storage', 'route-crud-store', 'project'];
				const choose = listcli.indexOf(this.options.choose)
				var skip = false
				var fixName, caseName
				if(!choose && choose !== 0){
					return
				}
				if(Number(choose) in [3,4,5,6]){
					const name = String(this.options.name)
					input.name = name
					fixName = name[0].toUpperCase() + name.slice(1)
					caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
					skip = true
				}

				const list = [
					// component
					{
						id: 0,
						action: async() => {
							createDirRecursive(this.config.directory.component, fixName)
							var code = read(this.config.rootShellApp + 'component.jsx').toString().replaceAll('caseName', caseName)
							var style = this.generateStyle(caseName, 'component')
							if(style){
								code = `import '@style/component/${style}'\n` + code
							}
							write(this.config.directory.component + '/' + fixName, code)
							core.success()
						}
					},
					// route
					{
						id: 1,
						action: async() => {
							createDirRecursive(this.config.directory.route, fixName)
							var code = read(this.config.rootShellApp + 'route.jsx').toString().replaceAll('caseName', caseName)
							var style = this.generateStyle(caseName, 'component')
							if(style){
								code = `import '@style/component/${style}'\n` + code
							}
							write(this.config.directory.route + '/' + fixName, code)
							core.success()
						}
					},
					// CRUD reducer
					{
						id: 2,
						action: async() => {
							fixName = fixName.toLowerCase()
							caseName = caseName.toLowerCase()
							createDirRecursive(this.config.directory.store, fixName)
							var crud = prompt(this.time() + ` type y to create CRUD using createAsyncThunk = `);
							var code
							if(String(crud).toLowerCase() == 'y'){
								var url = prompt(this.time() + ` base url (http://localhost:8000/api/user) = `);
								url = url || 'http://localhost:8000/api/user'
								code = read(this.config.rootShellApp + 'store-crud.js')
									.toString()
									.replaceAll('caseName', caseName)
									.replaceAll('BASEURL', url)
							}else{
								var isCrudReducer = prompt(this.time() + ' type y to create CRUD reducer = ')
								if(String(isCrudReducer).toLowerCase() == 'y'){
									var txt = read(this.config.rootShellApp + 'store-crud-reducer.js')
									var firstCase = caseName[0].toUpperCase() + caseName.slice(1)
									code = txt.toString().replaceAll('app', caseName)
										.replaceAll('namestore', input.name)
										.replaceAll('NameExport', firstCase)
										.replaceAll('// import', `// import {handle${firstCase}, reset${firstCase}, create${firstCase}, findOne${firstCase}, update${firstCase}, remove${firstCase}} from @s/${input.name}`)
								}else{
									var code = read(this.config.rootShellApp + 'store.js').toString()
										.replaceAll('appSlice', caseName + 'Slice')
										.replaceAll('namestore', input.name)
								}
							}
							write(this.config.directory.store + '/' + fixName, code)
							core.success()
						}
					},
					// tailwind
					{
						id: 3,
						action: async() => {
							core.createTailwind('react')
						}
					},
					// firebase-storage
					{
						id: 4,
						action: async() => {
							core.createFirebaseStorage(fixName)
						}
					},
					// route-crud store
					{
						id: 5,
						action: async() => {
							input.name = null
							var store = prompt(this.time() + ' type store name (user) = ')
							createDirRecursive(this.config.directory.route + '/' + store, fixName)
							var upperName = String(store)[0].toUpperCase() + store.slice(1),
							fullDir = this.config.directory.route + '/' + store + '/' + upperName
							if(store){
								var generateCreateoredit = () => {
									var code = read(this.config.rootShellApp + 'crud/createoredit.jsx')
										.toString()
										.replaceAll('storename', store)
									write(fullDir + 'createoredit.jsx', code)
								}
								var generateShow = () => {
									var code = read(this.config.rootShellApp + 'crud/show.jsx')
										.toString()
										.replaceAll('storename', store)
									write(fullDir + 'show.jsx', code)
								}
								var generateTable = () => {
									var code = read(this.config.rootShellApp + 'crud/table.jsx')
										.toString()
										.replaceAll('storename', store)
										.replaceAll('nameTable', upperName + 'table')
									write(fullDir + 'table.jsx', code)
								}
								generateCreateoredit()
								generateShow()
								generateTable()
							}
							var dirImport = '@r/' + store + '/' + upperName
							append(this.config.directory.route + '/index.jsx', `import ${upperName}createoredit from '${dirImport}createoredit'\nimport ${upperName}show from '${dirImport}show'\nimport ${upperName}table from '${dirImport}table'\n`)
							core.success()
						}
					},
					// project
					{
						id: 6,
						action: () => {
							this.core().createProject('react', () => {
								 var rootapp = this.config.rootShellApp
								 createDirRecursive(this.config.directory.service);
								 createDirRecursive(this.config.directory.style);
								 createDirRecursive(this.config.directory.component);
								 createDirRecursive(this.config.directory.store);
								 createDirRecursive(this.config.directory.route);
								 copy(rootapp + 'route/index.jsx', this.config.directory.route + '/index.jsx')
								 copy(rootapp + 'route/Home.jsx', this.config.directory.route + '/Home.jsx')
								 copy(rootapp + 'route/About.jsx', this.config.directory.route + '/About.jsx')
								 copy(rootapp + 'service/auth.js', this.config.directory.service + '/auth.js')
								 copy(rootapp + 'service/http.js', this.config.directory.service + '/http.js')
								 copy(rootapp + 'store/index.js', this.config.directory.store + '/index.js')
								 copy(rootapp + 'store/app.js', this.config.directory.store + '/app.js')
								 copy(rootapp + 'App.jsx', this.env.root + '/src/App.jsx')
								 copy(rootapp + 'main.jsx', this.env.root + '/src/main.jsx')
								 this.log('cd ' + this.env.root + ' && npm i && npm i @reduxjs/toolkit react-redux react-router-dom axios')
							})
						}
					}
				]
				var find = list.find((check) => {
					if(check.id === Number(choose)){
						check.action()
						return true
					}
				})
				if(!find){
					return
				}
				this.exit = this.exit.bind(this)
				this.exit()
			},
			vue: () => {
				this.config.rootShellApp = this.config.rootShell + 'vue/'
				var listcli = ['component', 'route', 'store', 'tailwindcss', 'firebase-storage', 'project'];
				const choose = listcli.indexOf(this.options.choose)
				var skip = false
				var fixName, caseName
				if(!choose && choose !== 0){
					return
				}
				if(Number(choose) in [1,2,3]){
					const name = this.options.name
					input.name = name
					fixName = String(name)[0].toUpperCase() + name.slice(1)
					caseName = String(name)[0].toUpperCase() + name.slice(1, name.indexOf('.'))
					skip = true
				}

				const list = [
					// component
					{
						id: 0,
						action: async() => {
							createDirRecursive(this.config.directory.component + 's', fixName)
							var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
							write(this.config.directory.component + 's' + '/' + fixName, code)
							core.success()
						}
					},
					// route
					{
						id: 1,
						action: async() => {
							createDirRecursive(this.config.directory.route, fixName)
							var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
							write(this.config.directory.route + '/' + fixName, code)
							core.success()
						}
					},
					// store
					{
						id: 2,
						action: async() => {
							fixName = fixName.toLowerCase()
							caseName = caseName.toLowerCase()
							createDirRecursive(this.config.directory.store, fixName)
							var code = read(this.config.rootShellApp + 'store.js').toString().replaceAll('caseName', caseName)
							write(this.config.directory.store + '/' + fixName, code)
							core.success()
						}
					},
					// tailwind
					{
						id: 3,
						action: async() => {
							core.createTailwind('vue')
						}
					},
					// firebase-storage
					{
						id: 4,
						action: async() => {
							core.createFirebaseStorage(fixName)
						}
					},
					// project
					{
						id: 5,
						action: () => {
							this.core().createProject('vue')
						}
					}
				]
				var find = list.find((check) => {
					if(check.id === Number(choose)){
						check.action()
						return true
					}
				})
				if(!find){
					return
				}
				this.exit = this.exit.bind(this)
				this.exit()
			},
			express: () => {
				this.config.rootShellApp = this.config.rootShell + 'express/'
				var listcli = ['model', 'api', 'project'], skip = false, fixName, caseName;
				const choose = listcli.indexOf(this.options.choose)
				if(!choose && choose !== 0){
					return
				}
				if(Number(choose) in [0, 1]){
					const name = this.options.name
					input.name = name
					fixName = String(name)[0].toUpperCase() + name.slice(1)
					caseName = String(name)[0].toUpperCase() + name.slice(1, name.indexOf('.'))
					skip = true
				}

				const list = [
					// model
					{
						id: 0,
						action: async() => {
							fixName = fixName.toLowerCase()
							if(['mongoose', 'sequelize'].find(v => v == this.options.lib)){
								createDirRecursive(this.config.directory.model, fixName)
								var code = read(this.config.rootShellApp + this.options.lib +  '.js').toString()
									.replaceAll('caseName', caseName)
									.replaceAll('modelName', caseName.toLowerCase());
								write(this.config.directory.model + '/' + fixName, code)
								core.success()
							}
						}
					},
					// api
					{
						id: 1,
						action : () => {
							fixName = fixName.toLowerCase()
							copy(this.config.rootShellApp + 'api.js', this.config.directory.api + '/' + fixName)
							var code = read(this.env.root + '/app.js').toString()
							code = `const ${caseName}Router = require('./api/${fixName}');\n` + code
							code = code.replace('// catch 404 and forward to error handler', `// catch 404 and forward to error handler\napp.use('api/${caseName.toLowerCase()}', ${caseName}Router)` )
							write(this.env.root + '/app.js', code)
							core.success()
						}
					},
					// project
					{
						id: 2,
						action: () => {
							var engine = ['dust', 'ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig']
							if(engine.find(v => v == this.env.engine)){
								var exec = 'npx express-generator ' + this.arg[1] + ' --' + this.env.engine + (
									this.env.mode === 'production' ?
										' && npm i && npm i cors express-session bcrypt express-validator jsonwebtoken uuid'
										: ''
									)
								this.log(exec)
								this.subprocess(exec, {
									close: () => {
										var rootapp = this.config.rootShellApp
										var code = read(rootapp + 'app.js').toString()
										createDirRecursive(this.env.root + '/service');
										createDirRecursive(this.env.root + '/api');
										createDirRecursive(this.config.directory.model);
										copy(rootapp + 'jwt.js', this.env.root + '/service' + '/auth.js')
										write(this.env.root + '/app.js', code)
										core.success()
									}
								})
							}else{
								this.log(this.env.engine, 'is not engine.')
								process.exit()
							}
						}
					}
				]
				var find = list.find((check) => {
					if(check.id === Number(choose)){
						check.action()
						return true
					}
				})
				if(!find){
					return
				}
				this.exit = this.exit.bind(this)
				this.exit()
			}
		}
	}
	static CONSOLE_HELP(){
		return{
			react(){
				console.log('\t', '--component=name', ':= Generate component')
				console.log('\t', '--store=name', ':= Generate store')
				console.log('\t', '--route=name', ':= Generate route pages')
				console.log('\t', '--tailwindcss', ':= Installation & configuration for tailwindcss')
				console.log('\t', '--firebase-storage', ':= Generate service firebase-storage for upload & remove (v8)')
				console.log('\t', '--route-crud-store', ':= Generate route crud for store')
				console.log('\t', '--project', ':= Create new project using vite')
			},
			vue(){
				console.log('\t', '--component=name', ':= Generate component')
				console.log('\t', '--store=name', ':= Generate store')
				console.log('\t', '--route=name', ':= Generate route pages')
				console.log('\t', '--tailwindcss', ':= Installation & configuration for tailwindcss')
				console.log('\t', '--firebase-storage', ':= Generate service firebase-storage for upload & remove (v8)')
				console.log('\t', '--project', ':= Create new project using vite')
			},
			express(){
				console.log('\t', '--model=name;sequelize|mongoose', ':= Generate model')
				console.log('\t', '--project', ':= Create new project using vite')
			}
		}
	}
}

module.exports = Shell
const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });
var colors = require('colors');

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
			this.app.log('create directory'.green, dir.green)
		    return fs.mkdirSync(dir, { recursive: true });
		}
	}
	append(filepath, first, end = null){
		var text = fs.readFileSync(filepath, 'utf8').toString()
		fs.writeFileSync(filepath, first + text + (end || ''))
	}
	copy(copy, dir, callback = Function){
		if (!fs.existsSync(dir)) {
			var folder = dir.split('/')
			folder = folder.slice(0, folder.length - 1).join('/')
			fs.mkdirSync(folder, { recursive: true });
		}
		fs.copyFile(copy, dir, callback)
		return this.app.log('writing'.green, dir.green)
	}
	write(dir, val){
		fs.writeFileSync(dir, val)
		return this.app.log('writing'.green, dir.green)
	}
	read(dir){
		return fs.readFileSync(dir, 'utf8')
	}
}

class Shell{
	constructor(env = {mode: 'production', root: 'myapp'}){
		this.env = new Proxy(env, {
			get(obj, prop){
				return obj[prop]
			},
			set(obj, prop, val){
				obj[prop] = val
				return true
			}
		})
		this.config = {
			rootShell: './.shell/',
			directory: {
				component: this.env.root + '/src/component',
				route: this.env.root + '/src/route',
				store: this.env.root + '/src/store',
				style: this.env.root + '/src/style',
				service: this.env.root + '/src/service',
				model: this.env.root + '/model',
				api: this.env.root + '/api',
			}
		}
		this.root = this.env.root
		this.version = 'v1.0'
		this.framework = null
		this.LIST = ['react', 'vue', 'express']
		this.arg = []
		this.history = []
		this.options = {
			dir: null,
			choose: '',
			name: ''
		}
		this.isProduction = this.env.mode === 'production'
		this.customize = false
		this.startcli = false
		this.exit = this.exit.bind(this)
		this.plugin = []
		this.core = this.core.bind(this)
		this.use = this.use.bind(this)
		this.start = this.start.bind(this)
		this.SystemFile = new SystemFile(this)
		this.quest = this.quest.bind(this)
		this.coreFeatureDefault = this.coreFeatureDefault.bind(this)
		this.cli = this.cli.bind(this)
	}
	quest(msg){
		return prompt(this.time() + ' > ' + msg)
	}
	use(Class){
		var plugin = new Class(this)
		this.LIST.push(Class.name.toLowerCase())
		this.plugin.push(plugin)
	}
	cli(){
		if (this.customize) {
			return process.exit()
		}
		this.startcli = true
		const arg = this.quest('')
		this.arg = arg.split(' ')
		this.start();
	}
	start(customize = null){
		var firstArg = this.arg[0]
		var isFound = false
		if(!this.startcli){
			this.arg = process.argv.slice(2)
		}
		if(Array.isArray(customize)){
			this.customize = true
			this.arg = customize
		}
		if(this.arg.length === 0){
			firstArg = '-h'
		}
		this.history.push(this.arg)

		if(this.LIST.indexOf(firstArg) !== -1){
			this.framework = firstArg
			isFound = true
			if(this.arg.length >= 3){
				if(this.arg[2].indexOf('=') !== -1){
					var options = this.arg[2].split('=')
					this.options = {
						dir: this.arg[1],
						choose: options[0].split('--')[1],
						name: options[1]
					}
				}else{
					var options = this.arg[1].indexOf('--') !== -1 ? this.arg[1].split('--') : this.arg[1]
					this.options = {
						dir: null,
						choose: Array.isArray(options) ? options[1]: options,
						name: ''
					}
				}
			}
			if(this.arg.length === 2){
				if (this.arg[1].indexOf('=') !== -1) {
					var options = this.arg[1].split('=')
					this.options = {
						dir: null,
						choose: options[0].split('--')[1],
						name: String(options[1]).indexOf(';') !== -1 ? options[1].replace(new RegExp(/;\S+/), ''): options[1],
						lib: String(options[1]).indexOf(';') !== -1 ? options[1].replace(new RegExp(/\S+;/), ''): null
					}
				}else{
					var options = this.arg[1].indexOf('--') !== -1 ? this.arg[1].split('--') : this.arg[1]
					this.options = {
						dir: null,
						choose: Array.isArray(options) ? options[1]: options,
						name: null,
						lib: null
					}
				}
			}
			const showHelper = (arr) => {
				arr.forEach(v => {
					console.log('\t', (v.console.name), '\t'.repeat(v.console.tab), v.console.description)
				})
			}
			// init app
			this.application = this.application.bind(this)
			const app = this.application()
			// statement app
			var list = [
				{ name: 'react' },
				{ name: 'vue' },
				{ name: 'express' },
			]
			var find = list.find(v => {
				if(v.name === this.framework){
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.consoleHelper(() => showHelper(app[v.name](true)))
						this.exit()
					}else{
						isFound = true
						app[v.name]()
					}
					return v
				}
			})
			if(!find){
				var plugin = this.plugin.find(v => v.name == this.framework)
				if(plugin){
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						isFound = true
						this.consoleHelper(() => showHelper(plugin.action))
						this.exit()
					}else{
						var action = plugin.action.find(v => v.name === this.options.choose)
						if(action){
							if (action.maxArg && this.arg.slice(2).length < action.maxArg) {
								this.log('Error: must be 2 argument')
								this.cli()
								return
							}else{
								(async() => {
									isFound = true
									await action.action(this.arg.slice(2))
									this.cli()
								})()
							}
						}
					}
				}else{
					this.exit()
				}
			}
		}
		if(['-h', '--help'].indexOf(firstArg) !== -1){
			isFound = true
			this.consoleHelper(() => {
				console.log('\t', '-h --help', 'Show help command')
			})
			this.exit()
		}
		if(['-v', '--version'].indexOf(firstArg) !== -1){
			isFound = true
			this.log(this.version)
			this.exit()
		}
		var handle = () => {
			if(this.startcli && !isFound){
				const checkIndex = (text, arg1, arg2) => {
					return text.indexOf(arg1) !== -1 && text.indexOf(arg2) !== -1
				}
				if(firstArg == ''){
					this.cli()
				}
				if(firstArg == 'clear'){
					isFound = true
					this.history = []
					this.log('cleared history command')
					this.cli()
				}
				if(firstArg == 'exit'){
					this.log('Good Bye!')
					this.startcli = false
					this.exit(true)
				}
				if(checkIndex(firstArg, 'app', '=')){
					var name = firstArg.split('=')[1]
					isFound = true
					this.env.root = name
					this.root = this.env.root
					this.log('change default app to', name)
					this.cli()
				}
				if(checkIndex(firstArg, 'mode', '=')){
					var name = firstArg.split('=')[1]
					if(['production', 'development'].find(v => v == name)){
						isFound = true
						this.env.mode = name
						this.isProduction = this.env.mode === 'production'
						this.log('change mode to', name)
						this.cli()
					}
				}
				if(parseInt(firstArg) === -1){
					var arg = this.history[this.history.length - 2]
					if(arg){
						this.arg = arg
						this.start()
					}else{
						this.cli()
					}
				}
				else{
					if(this.arg.length > 0 && !isFound){
						const sub = async () => {
							await this.subprocess(this.arg.join(' '), {
								close: (res) => {
									this.cli()
								}
							})
						}
						sub()
					}
				}
			}
		}
		handle()
	}
	consoleHelper(options = Function){
		console.log('')
		console.log('Help Commands: ')
		console.log('\t', `node index.js [${this.LIST.join(', ')}] [options]`.underline)
		console.log('options: ')
		options((...arg) => console.log('\t', ...arg))
	}
	async subprocess(run, action = {close: Function}){
		const util = require('util');
		const exec = util.promisify(require('child_process').exec)
		const controller = new AbortController();
		const { signal } = controller;
		this.log(run.underline.blue)
		const { stdout, stderr } = await exec(run, { signal });
		if (stderr) {
			this.log(stderr)
			action.close(stderr)
			return;
		}
		await new Promise((res) => {
			setTimeout(() => res(true), 500)
		})
		console.log(stdout)
		action.close(stdout)
		controller.abort();
	}
	generateStyle(caseName, typeSelect){
		var type = prompt(this.time() + ` generate (css|scss|sass) : `);
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
		if(this.startcli){
			this.cli()
		}else{
			if(skip){
				process.exit()
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
			createProject: async(name, end = Function) => {
				var exec = 'npm create vite@latest ' + this.env.root + ' -- --template ' + name
				this.log('create new project...')
				await this.subprocess(exec, {
					close: () => {
						var core = this.core()
						var code = read(this.config.rootShell + 'vite.config.js').toString()
						code = code.replace("plugin-react", "plugin-" + name)
						write(this.env.root + '/vite.config.js', code)
						end()
					}
				})
			},
			createTailwind: async(type) => {
				var exec = this.env.mode === 'production' ? 'npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p' : 'ls'
				await this.subprocess(exec, {
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
				var code = read(this.config.rootShell + 'firebase/storage.js').toString()
				this.log('copy if you want to import!')
				this.log(`import {storage, upload, remove} from '@service/firebase-storage.js'`)
				write(this.config.directory.service + '/firebase-storage.js', code)
				var core = this.core()
				core.success()
			},
			initializeFirebase: () => {
				createDirRecursive(this.env.root + '/src')
				createDirRecursive(this.env.root + '/src/service')
				copy(this.config.rootShell + 'firebase/firebase.js', this.env.root + '/src/firebase.js')
				copy(this.config.rootShell + 'firebase/validate.js', this.env.root + '/src/service/validate-auth.js')
				var core = this.core()
				core.success()
			},
			createModelFirestore: (caseName) => {
				caseName = String(caseName).toLowerCase()
				createDirRecursive(this.env.root + '/src/model')
				var code = read(this.config.rootShell + 'firebase/model.js')
					.toString()
					.replaceAll('model', caseName)
				write(this.env.root + '/src/model/' + caseName + '.js', code)
				var core = this.core()
				core.success()
			},
			success: () => {
				// this.log('done!')
				this.exit()
			}
		}
	}
	coreFeatureDefault(core){
		return[
			{
				name: 'tailwindcss',
				console: {
					name: '--tailwindcss',
					description: 'Installation & configuration for tailwindcss',
					tab: 3
				},
				action: async(arg, options) => {
					core.createTailwind(options.framework)
				}
			},
			{
				name: 'firebase-storage',
				console: {
					name: '--firebase-storage',
					description: 'Generate service firebase-storage for upload & remove (v8)',
					tab: 2
				},
				action: async(arg, options) => {
					core.createFirebaseStorage(options.fixName)
				}
			},
			{
				name: 'init-firebase',
				console: {
					name: '--init-firebase',
					description: 'Generate config firebase (v9)',
					tab: 2
				},
				action: (arg, options) => {
					core.initializeFirebase()
				}
			},
			{
				name: 'model-firestore',
				console: {
					name: '--model-firestore=name.js',
					description: 'Generate model firestore (v9)',
					tab: 1
				},
				action: (arg, options) => {
					core.createModelFirestore(options.caseName)
				}
			},
		]
	}
	application(){
		var { quest } = this
		var { createDirRecursive, copy, read, write, append } = this.SystemFile
		var core = this.core()
		var fixName, caseName, skip
		const findAndRun = (list) => list.find((check) => {
			if(check.name === this.options.choose){
				const name = String(this.options.name)
				skip = true
				if (name) {
					fixName = name[0].toUpperCase() + name.slice(1)
				}
				if(name.indexOf('.') !== -1){
					caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
				}
				(async() => await check.action(this.arg.slice(2), {
					framework: this.framework,
					fixName: fixName,
					caseName: caseName
				}))();
				return check
			}
		})

		return{
			react: (showList = false) => {
				this.config.rootShellApp = this.config.rootShell + 'react/'

				const list = [
					...this.coreFeatureDefault(core, {
						framework: 'react',
						fixName: fixName,
						caseName: caseName
					}),
					{
						name: 'component',
						console: {
							name: '--component=name.js',
							description: 'Generate component',
							tab: 2
						},
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
					{
						name: 'route',
						console: {
							name: '--route=name.js',
							description: 'Generate route pages',
							tab: 2
						},
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
					{
						name: 'store',
						console: {
							name: '--store=name.js',
							description: 'Generate store',
							tab: 2
						},
						action: async() => {
							fixName = fixName.toLowerCase()
							caseName = caseName.toLowerCase()
							createDirRecursive(this.config.directory.store, fixName)
							var crud = quest(`type y to create CRUD using createAsyncThunk : `);
							var code
							if(String(crud).toLowerCase() == 'y'){
								var url = quest(`base url : `);
								url = url || 'http://localhost:8000/api/user'
								code = read(this.config.rootShellApp + 'store-crud.js')
									.toString()
									.replaceAll('caseName', caseName)
									.replaceAll('BASEURL', url)
							}else{
								var isCrudReducer = quest('type y to create CRUD reducer : ')
								if(String(isCrudReducer).toLowerCase() == 'y'){
									var txt = read(this.config.rootShellApp + 'store-crud-reducer.js')
									var firstCase = caseName[0].toUpperCase() + caseName.slice(1)
									code = txt.toString().replaceAll('app', caseName)
										.replaceAll('namestore', caseName)
										.replaceAll('NameExport', firstCase)
										.replaceAll('// import', `// import {handle${firstCase}, reset${firstCase}, create${firstCase}, findOne${firstCase}, update${firstCase}, remove${firstCase}} from @s/${caseName}`)
								}else{
									code = read(this.config.rootShellApp + 'store.js').toString()
										.replaceAll('appSlice', caseName + 'Slice')
										.replaceAll('namestore', caseName)
								}
							}
							write(this.config.directory.store + '/' + fixName, code)
							core.success()
						}
					},
					{
						name: 'route-crud-store',
						console: {
							name: '--route-crud-store',
							description: 'Generate route crud for store',
							tab: 2
						},
						action: async() => {
							var store = quest('name : ')
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
					{
						name: 'project',
						console: {
							name: '--project',
							description: 'Create new project using vite',
							tab: 3
						},
						action: () => {
							core.createProject('react', async () => {
								var rootapp = this.config.rootShellApp,
								exec = (this.isProduction ? 'cd ' + this.env.root + ' && npm i && npm i @reduxjs/toolkit react-redux react-router-dom axios': '')
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
								copy(rootapp + 'component/template.jsx', this.config.directory.component + '/template.jsx')
								copy(rootapp + 'App.jsx', this.env.root + '/src/App.jsx')
								copy(rootapp + 'main.jsx', this.env.root + '/src/main.jsx')
								if(exec){
									await this.subprocess(exec, {
										close: () => {
											core.success()
										}
									})
								}
							})
						}
					},
					{
						name: 'install:mui',
						console: {
							name: 'install:mui',
							description: 'Install the Material UI & include toggle dark/light theme & palette colors',
							tab: 3
						},
						action: async() => {
							await this.subprocess('cd ' + this.root + ' && npm install @mui/material @emotion/react @emotion/styled', {
								close : () => {
									copy(this.config.rootShellApp + 'store/theme', this.config.directory.store + '/theme.js', () => {})
									copy(this.config.rootShellApp + 'mui.jsx', this.env.root + '/src/mui.jsx', () => {})
									copy(this.config.rootShellApp + 'service/color.js', this.config.directory.service + '/color.js', () => {})
									core.success()
								}
							})
						}
					},
				]
				if(showList){
					return list
				}
				var find = findAndRun(list)
				if(!find){
					return
				}
			},
			vue: (showList = false) => {
				this.config.rootShellApp = this.config.rootShell + 'vue/'

				const list = [
					...this.coreFeatureDefault(core, {
						framework: 'vue',
						fixName: fixName,
						caseName: caseName
					}),
					{
						name: 'component',
						console: {
							name: '--component=name.vue',
							description: 'Generate component',
							tab: 2
						},
						action: async() => {
							createDirRecursive(this.config.directory.component + 's', fixName)
							var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
							write(this.config.directory.component + 's' + '/' + fixName, code)
							core.success()
						}
					},
					{
						name: 'route',
						console: {
							name: '--route=name.vue',
							description: 'Generate route pages',
							tab: 2
						},
						action: async() => {
							createDirRecursive(this.config.directory.route, fixName)
							var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
							write(this.config.directory.route + '/' + fixName, code)
							core.success()
						}
					},
					{
						name: 'store',
						console: {
							name: '--store=name.js',
							description: 'Generate store',
							tab: 2
						},
						action: async() => {
							fixName = fixName.toLowerCase()
							caseName = caseName.toLowerCase()
							createDirRecursive(this.config.directory.store, fixName)
							var code = read(this.config.rootShellApp + 'store.js').toString().replaceAll('caseName', caseName)
							write(this.config.directory.store + '/' + fixName, code)
							core.success()
						}
					},
					{
						name: 'project',
						console: {
							name: '--project',
							description: 'Create new project using vite',
							tab: 3
						},
						action: () => {
							core.createProject('vue', () => {
								core.success()
							})
						}
					}
				]
				if(showList){
					return list
				}
				var find = findAndRun(list)
				if(!find){
					return
				}
			},
			express: (showList = false) => {
				this.config.rootShellApp = this.config.rootShell + 'express/'
				const list = [
					{
						name: 'make:model',
						console: {
							name: 'make:model',
							description: 'Generate model',
							tab: 3
						},
						action: async(arg) => {
							var name = arg[0].toLowerCase()
							var lib = arg[1].toLowerCase()
							var caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
							if(['mongoose', 'sequelize'].find(v => v == lib)){
								createDirRecursive(this.config.directory.model, name)
								var code = read(this.config.rootShellApp + lib +  '.js').toString()
									.replaceAll('caseName', caseName)
									.replaceAll('modelName', name);
								write(this.config.directory.model + '/' + name, code)
								core.success()
							}
						}
					},
					{
						name: 'make:api',
						console: {
							name: 'make:api',
							description: 'Generate api',
							tab: 3
						},
						action : (arg) => {
							var name = arg[0].toLowerCase()
							var caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
							copy(this.config.rootShellApp + 'api.js', this.config.directory.api + '/' + name)
							var code = read(this.env.root + '/app.js').toString()
							code = `const ${caseName}Router = require('./api/${name}');\n` + code
							code = code.replace('// catch 404 and forward to error handler', `// catch 404 and forward to error handler\napp.use('api/${caseName.toLowerCase()}', ${caseName}Router)` )
							write(this.env.root + '/app.js', code)
							core.success()
						}
					},
					{
						name: 'make:project',
						console: {
							name: 'make:project',
							description: 'Create new project',
							tab: 3
						},
						action: async(arg) => {
							var lib = arg[0].toLowerCase()
							var engine = ['dust', 'ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig']
							if(engine.find(v => v == lib)){
								var folder = this.env.root
								var exec = 'npx express-generator ' + folder + ' --view=' + lib + (
									this.isProduction ?
										' && cd ' + folder +	' && npm i && npm i cors express-session bcrypt express-validator jsonwebtoken uuid mongoose'
										: ''
									)
								await this.subprocess(exec, {
									close: () => {
										var rootapp = this.config.rootShellApp
										var code = read(rootapp + 'app.js').toString()
										createDirRecursive(this.env.root + '/service');
										createDirRecursive(this.env.root + '/api');
										createDirRecursive(this.env.root + '/test');
										createDirRecursive(this.config.directory.model);
										copy(rootapp + 'jwt.js', this.env.root + '/service' + '/auth.js')
										copy(rootapp + 'api/authenticate.js', this.env.root + '/api' + '/authenticate.js')
										copy(rootapp + 'model/Token.js', this.env.root + '/model' + '/Token.js')
										copy(rootapp + 'model/User.js', this.env.root + '/model' + '/User.js')
										copy(rootapp + 'test/api.js', this.env.root + '/test' + '/api.js')
										code = `const authenticate = require('./api/authenticate');\n` + code
										code = code.replace('// catch 404 and forward to error handler', `// catch 404 and forward to error handler\napp.use('api/auth', authenticate)` )
											.replace("'view engine', 'jade'", `'view engine', '${lib}'`)
										write(this.env.root + '/app.js', code)
										core.success()
									}
								})
							}else{
								this.log(lib, 'is not engine.')
								process.exit()
							}
						}
					},
					{
						name: 'make:gcp',
						console: {
							name: 'make:gcp',
							description: 'Generate @google-cloud/storage & api route',
							tab: 3
						},
						action: () => {
							createDirRecursive(this.env.root + '/service')
							createDirRecursive(this.env.root + '/api')
							copy(this.config.rootShell + 'firebase/storage-be.js', this.env.root + '/service' + '/storage-cloud.js')
							copy(this.config.rootShellApp + 'api/storage.js', this.env.root + '/api' + '/storage.js')
							core.success()
						}
					}
				]
				if(showList){
					return list
				}
				var find = findAndRun(list)
				if(!find){
					return
				}
			}
		}
	}
}

module.exports = Shell
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
		this.isProduction = this.env.mode === 'production'
		this.startcli = false
		this.exit = this.exit.bind(this)
		this.plugin = []
		this.core = this.core.bind(this)
		this.use = this.use.bind(this)
		this.start = this.start.bind(this)
		this.SystemFile = new SystemFile(this)
		this.quest = this.quest.bind(this)
		this.cli = this.cli.bind(this)
	}
	quest(msg){
		return prompt(this.time() + ' ' + msg)
	}
	use(Class){
		var plugin = new Class(this)
		this.LIST.push(Class.name.toLowerCase())
		this.plugin.push(plugin)
	}
	cli(){
		this.startcli = true
		const arg = this.quest('')
		this.arg = arg.split(' ')
		this.start()
	}
	start(){
		if(!this.startcli){
			this.arg = process.argv.slice(2)
		}
		const firstArg = this.arg[0]
		const consoles = Shell.CONSOLE_HELP()
		var isFound = false
		// console.log('')
		if(this.LIST.indexOf(firstArg) !== -1){
			this.framework = firstArg
			isFound = true
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
						this.exit()
					}else{
						app.react()
					}
					break
				case "vue":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.consoleHelper(consoles.vue)
						this.exit()
					}else{
						app.vue()
					}
					break
				case "express":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.consoleHelper(consoles.express)
						this.exit()
					}else{
						app.express()
					}
					break
				default:
					var plugin = this.plugin.find(v => v.name == this.framework)
					if(plugin){
						if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
							this.consoleHelper(plugin.help)
							this.exit()
						}else{
							var action = plugin.action.find(v => v.name === this.options.choose)
							if(action){
								action.action()
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
		var handle = () => {
			if(this.startcli && !isFound){
				const checkIndex = (text, arg1, arg2) => {
					return text.indexOf(arg1) !== -1 && text.indexOf(arg2) !== -1
				}
				if(firstArg == 'exit' || firstArg == ''){
					this.log('Good Bye!')
					process.exit()
				}
				if(checkIndex(firstArg, 'app', '=')){
					var name = firstArg.split('=')[1]
					this.env.root = name
					this.log('change default app to', name)
					this.cli()
				}
				if(checkIndex(firstArg, 'mode', '=')){
					var name = firstArg.split('=')[1]
					if(['production', 'development'].find(v => v == name)){
						this.env.mode = name
						this.log('change mode to', name)
						this.cli()
					}
				}
				else{
					if(this.arg.length > 0){
						this.subprocess(this.arg.join(' '), {
							close: (res) => {
								this.cli()
							}
						})
					}
				}
			}
		}
		handle()
	}
	consoleHelper(options = Function){
		console.log('')
		console.log('Help Commands: ')
		console.log('\t', `node index.js [${this.LIST.join(', ')}] folder? [options]`)
		console.log('\t', `node index.js [${this.LIST.join(', ')}] [options]`)
		console.log('options: ')
		options((...arg) => console.log('\t', ...arg))
	}
	subprocess(run, action = {close: Function}){
		const { exec } = require('child_process');
		exec(run, (err, stdout, stderr) => {
		  if (err) {
		    this.log(stderr)
		    action.close(stderr)
		    return;
		  }
		  console.log(stdout)
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
		const autoremove = () => {
			if(!this.isProduction){
				fs.rmSync(this.env.root, { recursive: true, force: true })
			}
		}
		if(this.startcli){
			this.cli()
		}else{
			if(skip){
				process.exit()
			}
		}
		autoremove()
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
						var core = this.core()
						var code = read(this.config.rootShell + 'vite.config.js').toString()
						code = code.replace("plugin-react", "plugin-" + name)
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
				var code = read(this.config.rootShell + 'firebase/storage.js').toString()
				this.log('copy if you want to import!')
				this.log(`import {storage, upload, remove} from '@service/firebase-storage.js'`)
				write(this.config.directory.service + '/firebase-storage.js', code)
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
				caseName = caseName.toLowerCase()
				createDirRecursive(this.env.root + '/src/model')
				var code = read(this.config.rootShell + 'firebase/model.js')
					.toString()
					.replaceAll('model', caseName)
				write(this.env.root + '/src/model/' + caseName + '.js', code)
				var core = this.core()
				core.success()
			},
			success: () => {
				this.log('done!\n')
				this.exit()
			}
		}
	}
	application(){
		const { input, quest } = this
		const { createDirRecursive, copy, read, write, append } = this.SystemFile
		const core = this.core()

		return{
			react: () => {
				this.config.rootShellApp = this.config.rootShell + 'react/'
				var fixName, caseName, skip

				const list = [
					{
						name: 'component',
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
						action: async() => {
							fixName = fixName.toLowerCase()
							caseName = caseName.toLowerCase()
							createDirRecursive(this.config.directory.store, fixName)
							var crud = quest(`type y to create CRUD using createAsyncThunk : `);
							var code
							if(String(crud).toLowerCase() == 'y'){
								var url = quest(`base url (http://localhost:8000/api/user) : `);
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
					{
						name: 'tailwindcss',
						action: async() => {
							core.createTailwind('react')
						}
					},
					{
						name: 'firebase-storage',
						action: async() => {
							core.createFirebaseStorage(fixName)
						}
					},
					{
						name: 'route-crud-store',
						action: async() => {
							input.name = null
							var store = quest('type store name (user) : ')
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
						name: 'init-firebase',
						action: () => {
							core.initializeFirebase()
						}
					},
					{
						name: 'model-firestore',
						action: () => {
							core.createModelFirestore(caseName)
							
						}
					},
					{
						name: 'project',
						action: () => {
							this.core().createProject('react', () => {
								 var rootapp = this.config.rootShellApp,
								 exec = 'cd ' + this.env.root + ' && npm i && npm i @reduxjs/toolkit react-redux react-router-dom axios'
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
								 if(this.isProduction){
								 	this.log(exec)
								 	this.subprocess(exec, {
								 		close: () => {}
								 	})
								 }
							})
						}
					}
				]

				var find = list.find((check, index) => {
					if(check.name === this.options.choose){
						const name = String(this.options.name)
						input.name = name
						fixName = name[0].toUpperCase() + name.slice(1)
						if(name.indexOf('.') !== -1){
							caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
						}
						skip = true
						check.action()
						return check
					}
				})
				if(!find){
					return
				}
			},
			vue: () => {
				this.config.rootShellApp = this.config.rootShell + 'vue/'
				var fixName, caseName, skip

				const list = [
					{
						name: 'component',
						action: async() => {
							createDirRecursive(this.config.directory.component + 's', fixName)
							var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
							write(this.config.directory.component + 's' + '/' + fixName, code)
							core.success()
						}
					},
					{
						name: 'route',
						action: async() => {
							createDirRecursive(this.config.directory.route, fixName)
							var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
							write(this.config.directory.route + '/' + fixName, code)
							core.success()
						}
					},
					{
						name: 'store',
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
						name: 'tailwindcss',
						action: async() => {
							core.createTailwind('vue')
						}
					},
					{
						name: 'firebase-storage',
						action: async() => {
							core.createFirebaseStorage(fixName)
						}
					},
					{
						name: 'init-firebase',
						action: () => {
							core.initializeFirebase()
						}
					},
					{
						name: 'model-firestore',
						action: () => {
							core.createModelFirestore(caseName)
							
						}
					},
					{
						name: 'project',
						action: () => {
							this.core().createProject('vue')
						}
					}
				]
				var find = list.find((check, index) => {
					if(check.name === this.options.choose){
						const name = this.options.name
						input.name = name
						fixName = String(name)[0].toUpperCase() + name.slice(1)
						if(name.indexOf('.') !== -1){
							caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
						}
						skip = true
						check.action()
						return true
					}
				})
				if(!find){
					return
				}
			},
			express: () => {
				this.config.rootShellApp = this.config.rootShell + 'express/'
				var fixName, caseName, skip
				const list = [
					// model
					{
						id: 0,
						name: 'model',
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
						name: 'api',
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
						name: 'project',
						action: () => {
							if(this.arg.length === 3){
								var engine = ['dust', 'ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig']
								if(engine.find(v => v == this.env.engine)){
									var folder = this.arg[1]
									var exec = 'npx express-generator ' + folder + ' --' + this.env.engine + (
										this.isProduction ?
											' && cd ' + folder +	' && npm i && npm i cors express-session bcrypt express-validator jsonwebtoken uuid mongoose'
											: ''
										)
									this.log(exec)
									this.subprocess(exec, {
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
												.replace("'view engine', 'jade'", `'view engine', '${this.env.engine}'`)
											write(this.env.root + '/app.js', code)
											core.success()
										}
									})
								}else{
									this.log(this.env.engine, 'is not engine.')
									process.exit()
								}
							}else{
								this.log('please write your project folder')
							}
						}
					},
					// google-cloud-storage
					{
						id: 3,
						name: 'google-cloud-storage',
						action: () => {
							createDirRecursive(this.env.root + '/service')
							createDirRecursive(this.env.root + '/api')
							copy(this.config.rootShell + 'firebase/storage-be.js', this.env.root + '/service' + '/storage-cloud.js')
							copy(this.config.rootShellApp + 'api/storage.js', this.env.root + '/api' + '/storage.js')
							core.success()
						}
					}
				]
				var find = list.find((check, index) => {
					if(check.name === this.options.choose){
						const name = this.options.name
						input.name = name
						fixName = String(name)[0].toUpperCase() + name.slice(1)
						skip = true
						if(name.indexOf('.') !== -1){
							caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
						}
						check.action()
						return true
					}
				})
				if(!find){
					return
				}
			}
		}
	}
	static CONSOLE_HELP(){
		return{
			react(){
				console.log('\t', '--component=name.jsx', '\t\t', 'Generate component')
				console.log('\t', '--store=name.js', '\t\t', 'Generate store')
				console.log('\t', '--route=name.js', '\t\t', 'Generate route pages')
				console.log('\t', '--tailwindcss', '\t\t\t', 'Installation & configuration for tailwindcss')
				console.log('\t', '--firebase-storage', '\t\t', 'Generate service firebase-storage for upload & remove (v8)')
				console.log('\t', '--init-firebase', '\t\t', 'Generate config firebase (v9)')
				console.log('\t', '--model-firestore=name.js', '\t', 'Generate model firestore (v9)')
				console.log('\t', '--route-crud-store', '\t\t', 'Generate route crud for store')
				console.log('\t', '--project', '\t\t\t', 'Create new project using vite')
			},
			vue(){
				console.log('\t', '--component=name.vue', '\t\t', 'Generate component')
				console.log('\t', '--store=name.js', '\t\t', 'Generate store')
				console.log('\t', '--route=name.vue', '\t\t', 'Generate route pages')
				console.log('\t', '--tailwindcss', '\t\t\t', 'Installation & configuration for tailwindcss')
				console.log('\t', '--firebase-storage', '\t\t', 'Generate service firebase-storage for upload & remove (v8)')
				console.log('\t', '--init-firebase', '\t\t', 'Generate config firebase (v9)')
				console.log('\t', '--model-firestore=name.js', '\t', 'Generate model firestore (v9)')
				console.log('\t', '--project', '\t\t\t', 'Create new project using vite')
			},
			express(){
				console.log('\t', '--model=name;sequelize|mongoose', '\t', 'Generate model')
				console.log('\t', '--api=name.js', '\t\t\t\t', 'Generate api')
				console.log('\t', '--project', '\t\t\t\t', 'Create new project using vite')
				console.log('\t', '--google-cloud-storage', '\t\t', 'Generate @google-cloud/storage & api route')
			}
		}
	}
}

module.exports = Shell
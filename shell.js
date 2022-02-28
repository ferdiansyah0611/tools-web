const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });

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
		this.createDirRecursive = this.createDirRecursive.bind(this)
		this.append = this.append.bind(this)
		this.use = this.use.bind(this)
		this.start = this.start.bind(this)
	}
	use(Class){
		var plugin = new Class(this)
		this.LIST.push(Class.name.toLowerCase())
		this.plugin.push(plugin)
	}
	start(){
		this.arg = process.argv.slice(2)
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
						this.__console__(() => {
							console.log('\t', '--component=name', ':= Generate component')
							console.log('\t', '--store=name', ':= Generate store')
							console.log('\t', '--route=name', ':= Generate route pages')
							console.log('\t', '--tailwindcss', ':= Installation & configuration for tailwindcss')
							console.log('\t', '--firebase-storage', ':= Generate service firebase-storage for upload & remove (v8)')
							console.log('\t', '--route-crud-store', ':= Generate route crud for store')
							console.log('\t', '--project', ':= Create new project using vite')
						})
						process.exit()
					}else{
						app.react()
					}
					break
				case "vue":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.__console__(() => {
							console.log('\t', '--component=name', ':= Generate component')
							console.log('\t', '--store=name', ':= Generate store')
							console.log('\t', '--route=name', ':= Generate route pages')
							console.log('\t', '--tailwindcss', ':= Installation & configuration for tailwindcss')
							console.log('\t', '--firebase-storage', ':= Generate service firebase-storage for upload & remove (v8)')
							console.log('\t', '--project', ':= Create new project using vite')
						})
						process.exit()
					}else{
						app.vue()
					}
					break
				case "express":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.__console__(() => {
							console.log('\t', '--component=name', ':= Generate component')
							console.log('\t', '--model=name;sequelize|mongoose', ':= Generate model')
							console.log('\t', '--route=name', ':= Generate route pages')
							console.log('\t', '--project', ':= Create new project using vite')
						})
						process.exit()
					}else{
						app.express()
					}
					break
				default:
					var plugin = this.plugin.find(v => v.name == this.framework)
					if(plugin){
						if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
							this.__console__(plugin.help)
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
			this.__console__(() => {
				console.log('\t', '-h --help', 'Show help command')
			})
		}
	}
	async append(filepath, first, end = null){
		var txt = await fs.readFileSync(filepath, 'utf8')
		txt = txt.toString()
		fs.writeFileSync(filepath, first + txt + (end || ''))
	}
	__console__(options = Function){
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
	createDirRecursive(root, fixName){
		var dir = this.options.dir
		if(dir){
			dir = `${root}/${dir}/`
			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir, { recursive: true });
			}
			this.input.name = dir + (fixName || '')
		}else{
			dir = root
			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir, { recursive: true });
			}
			this.input.name = `${root}/` + (fixName || '')
		}
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
			this.write(this.env.root + `/src/style/${typeSelect}/${caseName}`, `/*${caseName}*/`)
			return caseName
		}
	}
	log(...log){
		console.log(this.time(), ...log)
	}
	copy(old, newDir, callback = () => {}){
		return fs.copyFile(old, newDir, callback)
	}
	write(dir, value){
		return fs.writeFileSync(dir, value)
	}
	read(dir){
		return fs.readFileSync(dir, 'utf8')
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
		return{
			writing: (isMsg = true) => {
				if(this.input.code){
					this.log('writing', this.input.name)
					this.write(this.input.name, this.input.code)
				}
				if(isMsg){
					this.log('create successfuly!\n')
				}
			},
			createProject: (name, end = Function) => {
				this.log('create new project...')
				this.subprocess('npm create vite@latest ' + this.arg[1] + ' -- --template ' + name, {
					close: () => {
						var txt = this.read(this.config.rootShell + 'vite.config.js')
						var code = txt.toString()
						this.input.name = this.env.root + '/vite.config.js'
						this.input.code = String(code)
						this.core().writing(false)
						end()
						this.log('successfuly create project!')
					}
				})
			},
			createTailwind: (type) => {
				var install_tailwind = 'npm install -D tailwindcss postcss autoprefixer sass && npx tailwindcss init -p'
				this.log(install_tailwind)
				this.subprocess(install_tailwind, {
					close: () => {
						this.copy(this.config.rootShell + 'tailwind.sass', this.env.root + '/src/tailwind.sass')
						this.copy(this.config.rootShell + 'tailwind.config.js', this.env.root + '/tailwind.config.js')
						var dir = this.env.root + (type == 'react' ? '/src/main.jsx': '/src/main.js')
						var txt = this.read(dir)
						var code = txt.toString()
						this.write(dir, "import './tailwind.sass'\n" + code)
						this.log('successfuly setup & install tailwindcss!')
					}
				})
			},
			createFirebaseStorage: (fixName) => {
				this.createDirRecursive(this.config.directory.service, fixName)
				var txt = this.read(this.config.rootShell + 'firebase/storage.js')
				var code = txt.toString()
				this.input.name = this.config.directory.service + '/firebase-storage.js'
				this.input.code = code
				this.log('copy if you want to import!')
				this.log(`import {storage, upload, remove} from '@service/firebase-storage.js'`)
				this.core().writing()
			}
		}
	}
	application(){
		const {input, createDirRecursive} = this
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
							createDirRecursive(this.config.directory.component, fixName)
							var txt = this.read(this.config.rootShellApp + 'component.jsx')
							var style = this.generateStyle(caseName, 'component')
							var code = txt.toString()
							if(style){
								code = `import '@style/component/${style}'\n` + code
							}
							code = code.replaceAll('caseName', caseName)
							input.code = String(code)
							writing()
						}
					},
					// route
					{
						id: 1,
						action: async() => {
							createDirRecursive(this.config.directory.route, fixName)
							var txt = this.read(this.config.rootShellApp + 'route.jsx')
							var style = this.generateStyle(caseName, 'component')
							var code = txt.toString()
							if(style){
								code = `import '@style/component/${style}'\n` + code
							}
							code = code.replaceAll('caseName', caseName)
							input.code = String(code)
							writing()
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
							if(String(crud).toLowerCase() == 'y'){
								var url = prompt(this.time() + ` base url (http://localhost:8000/api/user) = `);
								url = url || 'http://localhost:8000/api/user'
								this.input.code = ``
								var txt = this.read(this.config.rootShellApp + 'store-crud.js')
								var code = txt.toString().replaceAll('caseName', caseName).replaceAll('BASEURL', url)
								this.input.code = String(code)
							}else{
								var isCrudReducer = prompt(this.time() + ' type y to create CRUD reducer = ')
								if(String(isCrudReducer).toLowerCase() == 'y'){
									var txt = this.read(this.config.rootShellApp + 'store-crud-reducer.js')
									var firstCase = caseName[0].toUpperCase() + caseName.slice(1)
									var code = txt.toString().replaceAll('app', caseName)
									.replaceAll('namestore', input.name)
									.replaceAll('NameExport', firstCase)
									.replaceAll('// import', `// import {handle${firstCase}, reset${firstCase}, create${firstCase}, findOne${firstCase}, update${firstCase}, remove${firstCase}} from @s/${input.name}`)
									input.code = String(code)
								}else{
									var txt = this.read(this.config.rootShellApp + 'store.js')
									var code = txt.toString().replaceAll('appSlice', caseName + 'Slice').replaceAll('namestore', input.name)
									input.code = String(code)
								}
							}
							writing()
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
							fullDir = this.config.directory.route + '/' + store + '/',
							fullDirName = fullDir + upperName
							if(store){
								var generateCreateoredit = () => {
									var txt = this.read(this.config.rootShellApp + 'crud/createoredit.jsx')
									var code = txt.toString().replaceAll('storename', store)
									this.write(fullDirName + 'createoredit.jsx', code)
								}
								var generateShow = () => {
									var txt = this.read(this.config.rootShellApp + 'crud/show.jsx')
									var code = txt.toString().replaceAll('storename', store)
									this.write(fullDirName + 'show.jsx', code)
								}
								var generateTable = () => {
									var txt = this.read(this.config.rootShellApp + 'crud/table.jsx')
									var code = txt.toString().replaceAll('storename', store)
									this.write(fullDirName + 'table.jsx', code)
								}
								generateCreateoredit()
								generateShow()
								generateTable()
							}
							var dirImport = '@r/' + store + '/' + upperName
							this.append(this.config.directory.route + '/index.jsx', `import ${upperName}createoredit from '${dirImport}createoredit'\nimport ${upperName}show from '${dirImport}show'\nimport ${upperName}table from '${dirImport}table'\n`)
							writing()
						}
					},
					// project
					{
						id: 6,
						action: () => {
							this.core().createProject('react', () => {
								 fs.mkdirSync(this.config.directory.service, { recursive: true });
								 fs.mkdirSync(this.config.directory.style, { recursive: true });
								 fs.mkdirSync(this.config.directory.component, { recursive: true });
								 fs.mkdirSync(this.config.directory.store, { recursive: true });
								 fs.mkdirSync(this.config.directory.route, { recursive: true });
								 var copied = (copy, dir) => {
									this.copy(copy, dir, () => {})
									this.log('writing', dir)
								 }, rootapp = this.config.rootShellApp
								 copied(rootapp + 'route/index.jsx', this.config.directory.route + '/index.jsx')
								 copied(rootapp + 'route/Home.jsx', this.config.directory.route + '/Home.jsx')
								 copied(rootapp + 'route/About.jsx', this.config.directory.route + '/About.jsx')
								 copied(rootapp + 'service/auth.js', this.config.directory.service + '/auth.js')
								 copied(rootapp + 'service/http.js', this.config.directory.service + '/http.js')
								 copied(rootapp + 'store/index.js', this.config.directory.store + '/index.js')
								 copied(rootapp + 'store/app.js', this.config.directory.store + '/app.js')
								 copied(rootapp + 'App.jsx', this.env.root + '/src/App.jsx')
								 copied(rootapp + 'main.jsx', this.env.root + '/src/main.jsx')
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
							var txt = this.read(this.config.rootShellApp + 'component.vue')
							var code = txt.toString().replaceAll('caseName', caseName)
							this.input.code = String(code)
							writing()
						}
					},
					// route
					{
						id: 1,
						action: async() => {
							createDirRecursive(this.config.directory.route, fixName)
							var txt = this.read(this.config.rootShellApp + 'component.vue')
							var code = txt.toString().replaceAll('caseName', caseName)
							input.code = String(code)
							writing()
						}
					},
					// store
					{
						id: 2,
						action: async() => {
							fixName = fixName.toLowerCase()
							caseName = caseName.toLowerCase()
							createDirRecursive(this.config.directory.store, fixName)
							var txt = this.read(this.config.rootShellApp + 'store.js')
							var code = txt.toString().replaceAll('caseName', caseName)
							input.code = String(code)
							writing()
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
				var listcli = ['component', 'model', 'project'];
				const choose = listcli.indexOf(this.options.choose)
				var skip = false
				var fixName, caseName
				if(!choose && choose !== 0){
					return
				}
				if(Number(choose) in [1,2]){
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
							var txt = this.read(this.config.rootShellApp + 'component.vue')
							var code = txt.toString().replaceAll('caseName', caseName)
							this.input.code = String(code)
							writing()
						}
					},
					// model
					{
						id: 1,
						action: async() => {
							fixName = fixName.toLowerCase()
							if(['mongoose', 'sequelize'].find(v => v == this.options.lib)){
								createDirRecursive(this.config.directory.model, fixName)
								var txt = this.read(this.config.rootShellApp + this.options.lib +  '.js')
								var code = txt.toString()
									.replaceAll('caseName', caseName)
									.replaceAll('modelName', caseName.toLowerCase());
								this.input.code = String(code)
								writing()
							}
						}
					},
					// project
					{
						id: 2,
						action: () => {
							var engine = ['dust', 'ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig']
							if(['dust', 'ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig'].find(v => v == this.env.engine)){
								var exec = 'npx express-generator ' + this.arg[1] + ' --' + this.env.engine + ' && npm i && npm i cors express-session'
								this.log(exec)
								this.subprocess(exec, {
									close: () => {
										this.createDirRecursive(this.config.directory.service, fixName)
										var txt = this.read(this.config.rootShellApp + 'app.js')
										var code = txt.toString()
										this.input.name = this.env.root + '/app.js'
										this.input.code = code
										writing(false)
										this.log('successfuly create project!')
									}
								})
							}else{
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
}

module.exports = Shell
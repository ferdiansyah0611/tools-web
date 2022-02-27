const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });

class Shell{
	constructor(config = {}, env = {mode: 'production', root: 'myapp'}){
		this.config = Object.assign({
			rootShell: './_shell/',
			directory: {
				component: env.root + '/src/component',
				route: env.root + '/src/route',
				store: env.root + '/src/store',
				style: env.root + '/src/style',
				service: env.root + '/src/service',
			}
		}, config)
		this.input = {
			name: '',
			code: ''
		}
		this.options = {
			dir: null,
			choose: '',
			name: ''
		}
		this.fm = null
		this.env = env
		this.arg = {}
		this.__core__ = this.__core__.bind(this)
		this.createDir = this.createDir.bind(this)
		this.createCrud = this.createCrud.bind(this)
		this.append = this.append.bind(this)
		this.prepend()
	}
	prepend(){
		this.arg = process.argv.slice(2)
		console.log('')
		if(['react', 'vue', 'express'].indexOf(this.arg[0]) !== -1){
			this.fm = this.arg[0]
			if(this.arg.length === 3){
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
					name: options[1]
				}
			}
			switch(this.arg[0]){
				case "react":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.__console(() => {
							console.log('\t', '--component=name', ':= Generate component')
							console.log('\t', '--store=name', ':= Generate store')
							console.log('\t', '--route=name', ':= Generate route pages')
							console.log('\t', '--project=name', ':= Create new project')
							console.log('\t', '--tailwindcss', ':= Installation & configuration for tailwindcss')
							console.log('\t', '--firebase-storage', ':= Generate service firebase-storage for upload & remove (v8)')
							console.log('\t', '--route-crud-store', ':= Generate route crud for store')
							console.log('\t', '--project', ':= Create new project using vite')
						})
						process.exit()
					}else{
						this.react = this.react.bind(this)
						this.react()
					}
					break
				case "vue":
					if(['-h', '--help'].indexOf(this.arg[1]) !== -1){
						this.__console(() => {
							console.log('\t', '--component=name', ':= Generate component')
							console.log('\t', '--store=name', ':= Generate store')
							console.log('\t', '--route=name', ':= Generate route pages')
							console.log('\t', '--project=name', ':= Create new project')
							console.log('\t', '--tailwindcss', ':= Installation & configuration for tailwindcss')
							console.log('\t', '--firebase-storage', ':= Generate service firebase-storage for upload & remove (v8)')
							console.log('\t', '--route-crud-store', ':= Generate route crud for store')
							console.log('\t', '--project', ':= Create new project using vite')
						})
						process.exit()
					}else{
						this.vue = this.vue.bind(this)
						this.vue()
					}
					break
			}
		}
		if(['-h', '--help'].indexOf(this.arg[0]) !== -1){
			this.__console(() => {
				console.log('\t', '-h --help', 'Show help command')
			})
		}
	}
	async append(file, first, end = null){
		var txt = await fs.readFileSync(file, 'utf8')
		txt = txt.toString()
		fs.writeFileSync(file, first + txt + (end || ''))
	}
	__console(options = Function){
		console.log('Help Commands: ')
		console.log('\t', 'node index.js [react, vue, express] folder? [options]')
		console.log('options: ')
		options()
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
	createDir(root, fixName){
		var dir = this.options.dir
		if(dir){
			dir = `${root}/${dir}/`
			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir, { recursive: true });
			}
			this.input.name = dir + fixName
		}else{
			dir = root
			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir, { recursive: true });
			}
			this.input.name = `${root}/` + fixName
		}
	}
	async createCrud(caseName){
		console.log('')
		var crud = prompt(`Create CRUD using createAsyncThunk (y/n) : `);
		console.log('')
		if(crud === 'y'){
			var url = prompt(`Base url (http://localhost:8000/api/user) : `);
			url = url || 'http://localhost:8000/api/user'
			this.input.code = ``
			var txt = this.read(this.config.rootShell + 'store-crud.js')
			var code = txt.toString().replaceAll('caseName', caseName).replaceAll('url', url)
			this.input.code = String(code)
			return new Promise((res) => res(true))
		}else{
			return new Promise((res) => res(false))
		}
	}
	generateStyle(caseName, typeSelect){
		console.log('')
		var type = prompt(this.time() + ` generate (css|scss|sass) *optional = `);
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
	endrun(skip){
		if(skip){
			if(this.env.mode == 'development'){
				fs.rmSync(this.env.root, { recursive: true, force: true })
			}
		}
	}
	time(){
		var date = new Date()
		return `[${date.getHours()}:${date.getMinutes()}]`
	}
	__core__(){
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
			createProject: (name) => {
				this.log('create new project...')
				this.subprocess('npm create vite@latest ' + this.arg[1] + ' -- --template ' + name, {
					close: () => {
						var txt = this.read(this.config.rootShell + 'vite.config.js')
						var code = txt.toString()
						this.input.name = this.env.root + '/vite.config.js'
						this.input.code = String(code)
						this.__core__().writing(false)
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
				this.createDir(this.config.directory.service, fixName)
				var txt = this.read(this.config.rootShell + 'firebase/storage.js')
				var code = txt.toString()
				this.input.name = this.config.directory.service + '/firebase-storage.js'
				this.input.code = code
				this.log('copy if you want to import!')
				this.log(`import {storage, upload, remove} from '@service/firebase-storage.js'`)
				this.__core__().writing()
			}
		}
	}
	async react(){
		const {input, createDir, createCrud} = this
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
		const core = this.__core__()
		const writing = core.writing

		const list = [
			// component
			{
				id: 0,
				action: async() => {
					createDir(this.config.directory.component, fixName)
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
					createDir(this.config.directory.route, fixName)
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
					createDir(this.config.directory.store, fixName)
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
					createDir(this.config.directory.route + '/' + store, fixName)
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
					this.__core__().createProject('react')
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
		this.endrun = this.endrun.bind(this)
		this.endrun()
	}
	async vue(){
		const {input, createDir, createCrud} = this
		this.config.rootShellApp = this.config.rootShell + 'vue/'
		var listcli = ['component', 'route', 'tailwindcss', 'firebase-storage', 'project'];
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
		const core = this.__core__()
		const writing = core.writing

		const list = [
			// component
			{
				id: 0,
				action: async() => {
					createDir(this.config.directory.component + 's', fixName)
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
					createDir(this.config.directory.route, fixName)
					var txt = this.read(this.config.rootShellApp + 'component.vue')
					var code = txt.toString().replaceAll('caseName', caseName)
					input.code = String(code)
					writing()
				}
			},
			// tailwind
			{
				id: 2,
				action: async() => {
					core.createTailwind('vue')
				}
			},
			// firebase-storage
			{
				id: 3,
				action: async() => {
					core.createFirebaseStorage(fixName)
				}
			},
			// project
			{
				id: 4,
				action: () => {
					this.__core__().createProject('vue')
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
		this.endrun = this.endrun.bind(this)
		this.endrun()
	}
}

module.exports = Shell
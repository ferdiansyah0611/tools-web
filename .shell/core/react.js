const React = function(sh) {
	this.name = 'react'
	this.config = sh.config
	this.config.rootShellApp = sh.config.rootShell + 'react/'
	this.parse = sh.parse()
	this.init = (arg) => {
		const {createDirRecursive, read, write} = sh.SystemFile
		const core = sh.core()
		const fixName = this.parse.toUpper(arg[0])
		const caseName = this.parse.removeFormat(arg[0])
		return{
			core, fixName, caseName, createDirRecursive, read, write
		}
	}
	this.action = [
		...sh.coreFeatureDefault(sh.core(), {
			framework: 'react',
		}),
		{
			name: 'make:component',
			console: {
				name: 'make:component [file] [css|sass|scss]',
				description: 'Generate component',
				tab: 2
			},
			action: async(arg) => {
				const {createDirRecursive, read, write, core, fixName, caseName} = this.init(arg)
				createDirRecursive(this.config.directory.component, fixName)
				var code = read(this.config.rootShellApp + 'component.jsx').toString().replaceAll('caseName', caseName)
				if (arg[1]) {
					var style = sh.generateStyle(caseName, 'component', arg[1])
					if(style){
						code = `import '@style/component/${style}'\n` + code
					}
				}
				write(this.config.directory.component + '/' + fixName, code)
				core.success()
			}
		},
		{
			name: 'make:route',
			console: {
				name: 'make:route [file] [css|sass|scss]',
				description: 'Generate route pages',
				tab: 2
			},
			action: async(arg) => {
				const {createDirRecursive, read, write, core, fixName, caseName} = this.init(arg)
				createDirRecursive(this.config.directory.route, fixName)
				var code = read(this.config.rootShellApp + 'route.jsx').toString().replaceAll('caseName', caseName)
				if (arg[1]) {
					var style = sh.generateStyle(caseName, 'route', arg[1])
					if(style){
						code = `import '@style/route/${style}'\n` + code
					}
				}
				write(this.config.directory.route + '/' + fixName, code)
				core.success()
			}
		},
		{
			name: 'make:store',
			console: {
				name: 'make:store [file] [async|reducer] [url]',
				description: 'Generate store',
				tab: 1
			},
			action: async(arg) => {
				let {createDirRecursive, read, write, core, fixName, caseName} = this.init(arg)
				fixName = fixName.toLowerCase()
				caseName = caseName.toLowerCase()
				createDirRecursive(this.config.directory.store, fixName)
				var code
				var async = arg[1] && arg[1].toLowerCase() == 'async'
				var reducer = arg[1] && arg[1].toLowerCase() == 'reducer'
				if(async){
					var url = arg[2] || 'http://localhost:8000/api/user'
					code = read(this.config.rootShellApp + 'store-crud.js')
						.toString()
						.replaceAll('caseName', caseName)
						.replaceAll('BASEURL', url)
				}else{
					if(reducer){
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
			name: 'make:route:crud',
			console: {
				name: 'make:route:crud [name]',
				description: 'Generate route crud for store',
				tab: 3
			},
			action: async(arg) => {
				let {createDirRecursive, read, write, core, fixName, caseName} = this.init(arg)
				const {append} = sh.SystemFile
				var store = arg[0]
				createDirRecursive(this.config.directory.route + '/' + store, fixName)
				var upperName = fixName,
				fullDir = this.config.directory.route + '/' + store + '/' + upperName
				if(store){
					var generateCreateoredit = () => {
						var code = read(this.config.rootShellApp + 'crud/createoredit.jsx').toString()
							.replaceAll('storename', store)
						write(fullDir + 'createoredit.jsx', code)
					}
					var generateShow = () => {
						var code = read(this.config.rootShellApp + 'crud/show.jsx').toString()
							.replaceAll('storename', store)
						write(fullDir + 'show.jsx', code)
					}
					var generateTable = () => {
						var code = read(this.config.rootShellApp + 'crud/table.jsx').toString()
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
			name: 'make:project',
			console: {
				name: 'make:project',
				description: 'Create new project using vite',
				tab: 5
			},
			action: async (arg) => {
				let {createDirRecursive, core} = this.init([''])
				let {copy} = sh.SystemFile
				await core.createProject('react', async () => {
					var rootapp = this.config.rootShellApp,
					exec = 'cd ' + sh.env.root + ' && npm i && npm i @reduxjs/toolkit react-redux react-router-dom axios'
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
					copy(rootapp + 'App.jsx', sh.env.root + '/src/App.jsx')
					copy(rootapp + 'main.jsx', sh.env.root + '/src/main.jsx')
					sh.log('please run:', exec.underline)
					core.success()
				})
			}
		},
		{
			name: 'install:mui',
			console: {
				name: 'install:mui',
				description: 'Install the Material UI & include toggle dark/light theme & palette colors',
				tab: 5
			},
			action: async() => {
				await sh.subprocess('cd ' + sh.root + ' && npm install @mui/material @emotion/react @emotion/styled', {
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
}

module.exports = React
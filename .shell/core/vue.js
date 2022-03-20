const Vue = function(sh) {
	this.name = 'vue'
	this.config = sh.config
	this.config.rootShellApp = sh.config.rootShell + 'vue/'
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
			framework: 'vue',
		}),
		{
			name: 'make:component',
			console: {
				name: 'make:component [file]',
				description: 'Generate component',
				tab: 4
			},
			action: async(arg) => {
				const {createDirRecursive, read, write, core, fixName, caseName} = this.init(arg)
				createDirRecursive(this.config.directory.component + 's', fixName)
				var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
				write(this.config.directory.component + 's' + '/' + fixName, code)
				core.success()
			}
		},
		{
			name: 'make:route',
			console: {
				name: 'make:route [file]',
				description: 'Generate route pages',
				tab: 4
			},
			action: async(arg) => {
				const {createDirRecursive, read, write, core, fixName, caseName} = this.init(arg)
				createDirRecursive(this.config.directory.route, fixName)
				var code = read(this.config.rootShellApp + 'component.vue').toString().replaceAll('caseName', caseName)
				write(this.config.directory.route + '/' + fixName, code)
				core.success()
			}
		},
		{
			name: 'make:store',
			console: {
				name: 'make:store [file]',
				description: 'Generate store',
				tab: 4
			},
			action: async(arg) => {
				let {createDirRecursive, read, write, core, fixName, caseName} = this.init(arg)
				fixName = fixName.toLowerCase()
				caseName = caseName.toLowerCase()
				createDirRecursive(this.config.directory.store, fixName)
				var code = read(this.config.rootShellApp + 'store.js').toString().replaceAll('caseName', caseName)
				write(this.config.directory.store + '/' + fixName, code)
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
				await core.createProject('vue', () => {
					var exec = exec = 'cd ' + sh.env.root + ' && npm i && npm i vuex@next vue-router@next'
					sh.log('please run:', exec.underline)
					core.success()
				})
			}
		},
	]
}

module.exports = Vue
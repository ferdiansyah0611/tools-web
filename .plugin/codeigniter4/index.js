const CI4 = function(sh){
	this.name = 'ci4'
	this.path = {
		argon: '.plugin/codeigniter4/src/argon'
	}
	this.action = [
		{
			name: 'make:auth',
			console: {
				name: 'make:auth',
				description: 'Generate auth controller & migrations',
				tab: 2
			},
			action: () => {
				const file = sh.SystemFile
				file.copy('.plugin/codeigniter4/src/AuthController', sh.root + '/app/Controllers/AuthController.php', () => {})
				file.copy('.plugin/codeigniter4/src/BaseController', sh.root + '/app/Controllers/BaseController.php', () => {})
				file.copy('.plugin/codeigniter4/src/2022-03-05-151542_User', sh.root + '/app/Database/Migrations/2022-03-05-151542_User.php', () => {})
			}
		},
		{
			name: 'make:user',
			console: {
				name: 'make:user',
				description: 'Generate user controller',
				tab: 2
			},
			action: () => {
				const file = sh.SystemFile
				file.copy('.plugin/codeigniter4/src/UserController', sh.root + '/app/Controllers/UserController.php', () => sh.log('success'))
			}
		},
		{
			name: 'make:crud',
			maxArg: 2,
			console: {
				name: 'make:crud',
				description: 'Create new crud',
				tab: 2
			},
			action: (arg) => {
				const file = sh.SystemFile
				var name = arg[0]
				var model = arg[1]
				var code = file.read('.plugin/codeigniter4/src/CRUD').toString()
					.replaceAll('CRUDController', name)
					.replaceAll('YourModel', model)
				file.write(sh.root + `/app/Controllers/${name}.php`, code)
			}
		},
		{
			name: 'make:api:crud',
			maxArg: 2,
			console: {
				name: 'make:api:crud',
				description: 'Create new crud api',
				tab: 2,
			},
			action: (arg) => {
				const file = sh.SystemFile
				var name = arg[0]
				var model = arg[1]
				var code = file.read('.plugin/codeigniter4/src/CRUDAPI').toString()
					.replaceAll('CRUDController', name)
					.replaceAll('YourModel', model)
				file.write(sh.root + `/app/Controllers/${name}.php`, code)
			}
		},
		{
			name: 'make:api:auth',
			console: {
				name: 'make:api:auth',
				description: 'Generate AuthController & Filters API',
				tab: 2
			},
			action: () => {
				const file = sh.SystemFile
				file.copy('.plugin/codeigniter4/src//AuthControllerAPI', sh.root + `/app/Controllers/AuthController.php`, () => {})
				file.copy('.plugin/codeigniter4/src//AuthFilterAPI', sh.root + `/app/Filters/AuthFilterAPI.php`, () => {})
			}
		},
		{
			name: 'make:project',
			console: {
				name: 'make:project',
				description: 'Create new project',
				tab: 2
			},
			action: async () => {
				await sh.subprocess('composer create-project codeigniter4/appstarter ' + sh.root, {
					close: () => {
						sh.log('done!')
					}
				})
			}
		},
		{
			name: 'view:argon',
			maxArg: 1,
			console: {
				name: 'view:argon',
				description: 'Generate view index & create using template argon',
				tab: 2
			},
			action: (arg) => {
				const file = sh.SystemFile
				var folder = arg[0]
				file.copy(this.path.argon + '/create', sh.root + `/app/Views/${folder}/create.php`, () => {})
				file.copy(this.path.argon + '/index', sh.root + `/app/Views/${folder}/index.php`, () => {})
			}
		},
		{
			name: 'view:auth-argon',
			console: {
				name: 'view:auth-argon',
				description: 'Generate view auth login & register using template argon',
				tab: 1
			},
			action: () => {
				const file = sh.SystemFile
				file.copy(this.path.argon + '/login', sh.root + `/app/Views/auth/login.php`, () => {})
				file.copy(this.path.argon + '/register', sh.root + `/app/Views/auth/register.php`, () => {})
			}
		},
		{
			name: 'view:template-argon',
			console: {
				name: 'view:template-argon',
				description: 'Generate template using argon',
				tab: 1
			},
			action: () => {
				const file = sh.SystemFile
				file.copy(this.path.argon + '/template', sh.root + '/app/Views/template.php', () => {})
				file.copy(this.path.argon + '/alert-form', sh.root + '/app/Views/component/alert-form.php', () => {})
			}
		},
		{
			name: 'run:server',
			console: {
				name: 'run:server',
				description: 'Run the server application',
				tab: 2
			},
			action: async () => {
				await sh.subprocess('cd ' + sh.root + ' && php spark serve', {
					close: () => {
						sh.log('done!')
					}
				})
			}
		},
	]
}

module.exports = CI4
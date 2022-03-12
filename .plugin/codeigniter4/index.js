const CI4 = function(sh){
	this.name = 'ci4'
	this.path = {
		argon: '.plugin/codeigniter4/src/argon'
	}
	this.action = [
		{
			name: 'auth',
			console: {
				name: '--auth',
				description: 'Generate auth controller',
				tab: 2
			},
			action: () => {
				const file = sh.SystemFile
				file.copy('.plugin/codeigniter4/src/AuthController', sh.root + '/app/Controllers/AuthController.php', () => sh.log('success'))
				file.copy('.plugin/codeigniter4/src/BaseController', sh.root + '/app/Controllers/BaseController.php', () => sh.log('success'))
			}
		},
		{
			name: 'user',
			console: {
				name: '--user',
				description: 'Generate user controller',
				tab: 2
			},
			action: () => {
				const file = sh.SystemFile
				file.copy('.plugin/codeigniter4/src/UserController', sh.root + '/app/Controllers/UserController.php', () => sh.log('success'))
			}
		},
		{
			name: 'template-argon',
			console: {
				name: '--template-argon',
				description: 'Generate template using argon',
				tab: 1
			},
			action: () => {
				const file = sh.SystemFile
				file.copy(this.path.argon + '/template', sh.root + '/app/Views/template.php', () => sh.log('success'))
				file.copy(this.path.argon + '/alert-form', sh.root + '/app/Views/component/alert-form.php', () => sh.log('success'))
			}
		},
		{
			name: 'view-argon',
			console: {
				name: '--view-argon',
				description: 'Generate view index & create using template argon',
				tab: 2
			},
			action: () => {
				const file = sh.SystemFile
				file.copy(this.path.argon + '/create', sh.root + `/app/Views/${sh.options.name}/create.php`, () => sh.log('success'))
				file.copy(this.path.argon + '/index', sh.root + `/app/Views/${sh.options.name}/index.php`, () => sh.log('success'))
			}
		},
		{
			name: 'project',
			console: {
				name: '--project',
				description: 'Create new project',
				tab: 2
			},
			action: () => {
				sh.subprocess('composer create-project codeigniter4/appstarter ' + sh.root, {
					close: () => {
						sh.log('done!')
					}
				})
			}
		},
		{
			name: 'crud',
			console: {
				name: '--crud',
				description: 'Create new crud',
				tab: 2
			},
			action: () => {
				const file = sh.SystemFile
				var code = file.read('.plugin/codeigniter4/src/CRUD')
					.toString()
					.replaceAll('CRUDController', sh.options.name)
					.replaceAll('YourModel', sh.options.lib)
				file.write(sh.root + `/app/Controllers/${sh.options.name}.php`, code)
			}
		},
	]
}

module.exports = CI4
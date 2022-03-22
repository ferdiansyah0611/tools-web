const Express = function(sh) {
    this.name = 'express'
    this.config = sh.config
    this.root = sh.config.rootShell + 'express/'
    this.parse = sh.parse()
    this.engine = ['dust', 'ejs', 'hbs', 'hjs', 'jade', 'pug', 'twig']
    this.lib = ['mongoose', 'sequelize']
    this.init = (arg) => {
        const {
            createDirRecursive,
            read,
            write
        } = sh.SystemFile
        const core = sh.core()
        const fixName = this.parse.toUpper(arg[0])
        const caseName = this.parse.removeFormat(arg[0])
        return {
            core,
            fixName,
            caseName,
            createDirRecursive,
            read,
            write
        }
    }
    this.action = [{
        name: 'make:model',
        maxArg: 3,
        console: {
            name: 'make:model [file] [mongoose|sequelize] [col]',
            description: 'Generate model',
            tab: 1
        },
        action: async(arg) => {
            var {
                createDirRecursive,
                read,
                write,
                core,
                caseName
            } = this.init(arg)
            var name = arg[0].toLowerCase()
            var lib = arg[1].toLowerCase()
            var col = arg[2].indexOf(',') !== -1 ? arg[2] : []
            var column = ''
            var caseName = name[0].toUpperCase() + name.slice(1, name.indexOf('.'))
            var choose = this.lib.find(v => v == lib)
            if (choose) {
                var split = col.split(',')
                createDirRecursive(this.config.directory.model, name)
                split.forEach((v, i) => {
                    if (choose == 'mongoose') {
                        column += `\t${v}: String,` + (i === split.length - 1 ? '' : '\n')
                    } else {
                        column += `\t${v}: DataTypes.STRING,` + (i === split.length - 1 ? '' : '\n')
                    }
                })
                var onreplace = choose == 'mongoose' ? 'new Schema({' : '.init({'
                var code = read(this.root + lib + '.js').toString()
                    .replaceAll('caseName', caseName)
                    .replaceAll('models', caseName.toLowerCase())
                    .replace(onreplace, onreplace + '\n' + column)
                write(this.config.directory.model + '/' + name, code)
                core.success()
            } else {
                sh.log(lib.red, 'is not library.'.red, 'You can choose:', this.lib.join(', ').underline)
                core.success()
            }
        }
    }, {
        name: 'make:gcs',
        console: {
            name: 'make:gcs',
            description: 'Generate google cloud storage in service folder',
            tab: 5
        },
        action: async(arg) => {
            var {
                createDirRecursive,
                read,
                write,
                core,
                caseName
            } = this.init(arg)
            const {
                copy
            } = sh.SystemFile
            createDirRecursive(this.config.directory.service)
            copy(this.config.rootShell + 'firebase/storage-be.js', this.config.directory.service + '/storage.js')
            core.success()
        }
    }, {
        name: 'make:api',
        maxArg: 3,
        console: {
            name: 'make:api [file] [mongoose|sequelize] [col]',
            description: 'Generate crud api, routes & validation',
            tab: 1
        },
        action: async(arg) => {
            var {
                core,
                caseName
            } = this.init(arg)
            const {
                copy,
                write,
                read
            } = sh.SystemFile
            var name = arg[0].toLowerCase()
            var lib = arg[1].toLowerCase()
            var split = arg[2].toLowerCase().split(',')
            var valid = '',
                middleware = ''
            var api = read(this.root + `api${lib}.js`).toString()
            split.forEach((v, i) => {
                valid += `\t${v}: body('${v}').not().isEmpty().trim().escape().withMessage('${v} is required'),` + (i === split.length - 1 ? '' : '\n')
                middleware += `, valid.${v}`
            })
            api = api.replace('const valid = {', `const valid = {\n${valid}`)
            api = api.replace(`router.post('/', validate`, `router.post('/', validate${middleware}`)
            api = api.replace(`router.patch('/:id', validate`, `router.patch('/:id', validate${middleware}`)
            write(sh.env.root + `/api/${caseName.toLowerCase()}.js`, api)

            var code = read(sh.env.root + '/app.js').toString()
            code = `const ${caseName}Router = require('./api/${name}');\n` + code
            code = code.replace('// catch 404 and forward to error handler', `// catch 404 and forward to error handler\napp.use('api/${caseName.toLowerCase()}', ${caseName}Router)`)
            write(sh.env.root + '/app.js', code)
            core.success()
        }
    }, {
        name: 'make:project',
        maxArg: 2,
        console: {
            name: `make:project [template] [mongoose|sequelize]`,
            description: 'Create new project include middleware authentication',
            tab: 1
        },
        action: async(arg) => {
            let {
                core
            } = this.init([''])
            const {
                copy,
                write,
                read,
                createDirRecursive
            } = sh.SystemFile
            var lib = arg[0].toLowerCase()
            var engine = this.engine
            var db = arg[1]
            if (engine.find(v => v == lib.toLowerCase()) && ['mongoose', 'sequelize'].find(v => v == db)) {
                var folder = sh.env.root
                var exec = 'npx express-generator ' + folder + ' --view=' + lib + (
                    sh.isProduction ?
                    ' && cd ' + folder + ' && npm i && npm i cors express-session bcrypt express-validator jsonwebtoken uuid mongoose' :
                    ''
                )
                await sh.subprocess(exec, {
                    close: () => {
                        var rootapp = this.root
                        var code = read(rootapp + 'app.js').toString()
                        var dbparse = this.parse.toUpper(db)
                        createDirRecursive(sh.env.root + '/service');
                        createDirRecursive(sh.env.root + '/api');
                        createDirRecursive(sh.env.root + '/test');
                        createDirRecursive(this.config.directory.model);
                        copy(rootapp + `jwt${db}.js`, sh.env.root + '/service' + '/auth.js')
                        copy(rootapp + `api/authenticate${dbparse}.js`, sh.env.root + '/api' + '/authenticate.js')
                        copy(rootapp + `model/Token${dbparse}.js`, sh.env.root + '/model' + '/Token.js')
                        copy(rootapp + `model/User${dbparse}.js`, sh.env.root + '/model' + '/User.js')
                        copy(rootapp + `test/api.js`, sh.env.root + '/test' + '/api.js')
                        code = `const authenticate = require('./api/authenticate');\n` + code
                        code = code.replace('// catch 404 and forward to error handler', `// catch 404 and forward to error handler\napp.use('api/auth', authenticate)`)
                            .replace("'view engine', 'jade'", `'view engine', '${lib}'`)
                        write(sh.env.root + '/app.js', code)
                        core.success()
                    },
                    hide: true,
                    hideLog: true
                })
            } else {
                sh.log(lib.red, 'is not engine.'.red, 'You can choose one:', engine.join(', ').underline)
                core.success()
            }
        }
    }, {
        name: 'run:server',
        console: {
            name: 'run:server',
            description: 'Run the server application on the background',
            tab: 5
        },
        action: async() => {
            sh.subprocess('cd ' + sh.root + ' && npm run start', {
                close: () => {},
                notSync: true
            })
        }
    }, ]
}

module.exports = Express
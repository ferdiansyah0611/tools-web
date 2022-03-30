const checkIndex = (text, arg1, arg2) => {
    return text.indexOf(arg1) !== -1 && text.indexOf(arg2) !== -1
}
const addRequireIndex = (ROOT, append, plugin) => {
    const file = ROOT + '/index'
    append(file, ``, null, (text) => (
        text.replace(
            "// don't remove this comment",
            `// don't remove this comment\nsh.use(require('${plugin}'))`
        )
        .trim()
    ))
}

module.exports = [{
    statement: (arg) => arg[0] == 'make:form',
    maxArg: 2,
    console: {
        name: 'make:form [name] [type]',
        description: 'Create form boostrap',
        tab: 3
    },
    action: async(sh) => {
        if (sh.arg[1].indexOf(',') && sh.arg[2].indexOf(',')) {
            var file = sh.SystemFile
            var input = ''
            var name = sh.arg[1].split(','),
                type = sh.arg[2].split(',')
            var date = new Date()
            var parse = sh.parse()

            input += '<form action="" method="">\n\t<div className="row">\n'
            file.createDirRecursive(sh.root + '/form')

            for (var i = 0; i < name.length; i++) {
                var id = `${name[i]}_${i}`;
                var defaults = ['text', 'email', 'number', 'password', 'date', 'datetime-local', 'radio', 'checkbox', 'tel', 'submit', 'range', 'button', 'color', 'file', 'month', 'url', 'week'];
                (() => {
                    if (type[i] !== 'hidden') {
                        input += '\t\t<div className="col-auto mb-3">\n';
                        input += `\t\t\t<label class="form-label" for="${id}">${parse.toUpper(name[i])}</label>\n`
                    }
                })();
                if (defaults.find(v => v == type[i])) {
                    input += `\t\t\t<input class="form-control" type="${type[i]}" name="${name[i]}" placeholder="Required" id="${id}" required />\n`
                } else if (type[i] == 'select') {
                    input += `\t\t\t<select class="form-control" name="${name[i]}" id="${id}" required><option value="">-- ${name[i]} --</option></select>\n`
                } else if (type[i] == 'textarea') {
                    input += `\t\t\t<textarea rows="3" class="form-control" name="${name[i]}" id="${id}" required></textarea>\n`
                } else if (type[i] == 'hidden') {
                    input += `\t\t<input type="hidden" name="${name[i]}" id="${id}"/>\n`
                }
                (() => {
                    if (type[i] !== 'hidden') {
                        input += '\t\t</div>\n'
                    }
                })();
            }
            input += '\t</div>\n</form>'
            file.write(sh.root + '/form/form_' + date.getFullYear() + date.getDay() + date.getMinutes() + date.getSeconds() + '.html', input)
        }
        sh.cli()
    }
}, {
    statement: (arg) => arg[0] == 'show',
    maxArg: 2,
    console: {
        name: 'show [name]',
        description: 'Show value of variable in the class',
        tab: 5
    },
    action: async(sh) => {
        if (sh.arg[1] && sh.arg[1] in sh) {
            sh.log(sh[sh.arg[1]])
        }
        sh.cli()
    }
}, {
    statement: (arg) => arg[0] == 'schedule',
    maxArg: 2,
    console: {
        name: 'schedule [file]',
        description: 'Run multiple command with file',
        tab: 4
    },
    action: async(sh) => {
        var file = sh.SystemFile
        var txt = file.read(sh.arg[1]).toString()
        txt.split('\n').forEach(async(arg, i) => {
            await sh.start(arg.split(' '))
        })
        sh.cli()
    }
}, {
    statement: (arg) => arg[0] == 'clear',
    console: {
        name: 'clear',
        description: 'Clear history command',
        tab: 6
    },
    action: async(sh) => {
        sh.history = []
        sh.cli()
    }
}, {
    statement: (arg) => arg[0] == 'exit',
    console: {
        name: 'exit',
        description: 'Exit the command. Not recommend if you run server on the background (CTRL+BREAK)',
        tab: 6
    },
    action: async(sh) => {
        sh.log('==> CREATED BY FERDIANSYAH0611 <=='.blue)
        sh.log('Good Bye!'.green)
        sh.startcli = false
        sh.exit(true)
    }
}, {
    statement: (arg) => arg[0] == 'edit',
    console: {
        name: 'edit',
        description: 'Show how to edit cli using vim',
        tab: 6
    },
    action: async(sh, ROOT) => {
        sh.log('please run:', ('cd ' + ROOT + ' && vim index').blue)
    }
}, {
    statement: (arg) => arg[0] == 'app',
    maxArg: 2,
    console: {
        name: 'app [folder]',
        description: 'Change default app folder',
        tab: 5
    },
    action: async(sh, ROOT) => {
        const name = sh.arg[1]
        const {
            append
        } = sh.SystemFile;
        append(ROOT + '/index', '', null, (text) => text.replace(`'${sh.root}'`, `'${name}'`))
        sh.env.root = name
        sh.root = sh.env.root
        sh._config()
        sh.cli()
    }

}, {
    statement: (arg) => arg[0] == 'mode',
    maxArg: 2,
    console: {
        name: 'mode [production|development]',
        description: 'Change mode command',
        tab: 3
    },
    action: async(sh, ROOT) => {
        const name = sh.arg[1]
        if (['production', 'development'].find(v => v == name)) {
            const {
                append
            } = sh.SystemFile;
            append(ROOT + '/index', '', null, (text) => text.replace(`'${sh.env.mode}'`, `'${name}'`))
            sh.env.mode = name
            sh.isProduction = sh.env.mode === 'production'
            sh.cli()
        }
    }
}, {
    statement: (arg) => arg[0] == 'install',
    maxArg: 2,
    console: {
        name: 'install [name]',
        description: 'Install the plugin and the plugin must be publish on npm',
        tab: 4
    },
    action: async(sh, ROOT) => {
        const plugin = sh.arg[1]
        const {
            append
        } = sh.SystemFile;
        (async() => {
            await sh.subprocess('cd ' + ROOT + ' && npm i ' + plugin, {
                close: () => {
                    const file = ROOT + '/index'
                    addRequireIndex(ROOT, append, plugin)
                    append(ROOT + '/package.twb', plugin + '\n', null, null)
                    sh.log('restart now!')
                },
                hide: true,
                hideLog: true,
            })
        })()
    }

}, {
    statement: (arg) => arg[0] == 'update',
    console: {
        name: 'update',
        description: 'Update the package',
        tab: 5
    },
    action: async(sh, ROOT) => {
        const {
            read,
            append
        } = sh.SystemFile
        await sh.subprocess('cd ' + ROOT + ' && npm i -g tools-web', {
            close: () => {
                var package = read(ROOT + '/package.twb').toString().trim().split('\n')
                if (package.length >= 1) {
                    (async() => {
                        await sh.subprocess('cd ' + ROOT + ' && npm i ' + package.join(' '), {
                            close() {
                                for (var i = 0; i < package.length; i++) {
                                    addRequireIndex(ROOT, append, package[i])
                                }
                                sh.log('restart now!')
                            },
                            hide: true,
                            hideLog: true
                        })
                    })();

                } else {
                    sh.log('restart now!')
                }
            },
            hide: true,
            hideLog: true
        })
    }
}, {
    statement: (arg) => arg[0] == 'uninstall',
    maxArg: 2,
    console: {
        name: 'uninstall [name]',
        description: 'Uninstall the plugin',
        tab: 4
    },
    action: async(sh, ROOT) => {
        const plugin = sh.arg[1]
        const {
            read,
            write,
            append
        } = sh.SystemFile;
        (async() => {
            await sh.subprocess('cd ' + ROOT + ' && npm uninstall ' + plugin, {
                close: () => {
                    const file = ROOT + '/index'
                    var code = read(file).toString()
                        .replace(`sh.use(require('${plugin}'))`, '')
                    write(file, code.trim())
                    append(ROOT + '/package.twb', '', null, (text) => text.replace(plugin, '').trim())
                    sh.log('restart now!')
                },
                hide: true,
                hideLog: true,
            })
        })()
    }

}, {
    statement: (arg) => parseInt(arg[0]) === -1,
    console: {
        name: '-1',
        description: 'Run previous command',
        tab: 6
    },
    action: async(sh, ROOT) => {
        var arg = sh.history[sh.history.length - 2]
        if (arg) {
            sh.arg = arg
            sh.start()
        } else {
            sh.cli()
        }
    }
}]
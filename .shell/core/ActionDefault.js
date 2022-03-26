const checkIndex = (text, arg1, arg2) => {
    return text.indexOf(arg1) !== -1 && text.indexOf(arg2) !== -1
}

module.exports = [{
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
        name: 'schedule [my.txt]',
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
    maxArg: 3,
    console: {
        name: 'install [name] [npm_name]',
        description: 'Install the plugin and the plugin must be publish on npm',
        tab: 3
    },
    action: async(sh, ROOT) => {
        const name = sh.arg[1]
        const plugin = sh.arg[2]
        const parse = sh.parse().toUpper(name)
        const {
            append
        } = sh.SystemFile;
        (async() => {
            await sh.subprocess('cd ' + ROOT + ' && npm i ' + plugin, {
                close: () => {
                    const file = ROOT + '/index'
                    append(file, ``, null, (text) => (
                        text.replace("// don't remove this comment", "// don't remove this comment\nsh.use(" + parse + ")")
                        .replace('#!/usr/bin/env node', `#!/usr/bin/env node\nconst ${parse} = require('${plugin}')`)
                        .trim()
                    ))
                    sh.log('restart now!')
                },
                hide: true
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
        await sh.subprocess('cd ' + ROOT + ' && npm update', {
            close: () => {
                sh.log('restart now!')
            },
            hide: true,
            hideLog: true
        })
    }
}, {
    statement: (arg) => arg[0] == 'uninstall',
    maxArg: 3,
    console: {
        name: 'uninstall [name] [npm_name]',
        description: 'Uninstall the plugin',
        tab: 3
    },
    action: async(sh, ROOT) => {
        const name = sh.arg[1]
        const plugin = sh.arg[2]
        const parse = sh.parse().toUpper(name)
        const {
            read,
            write
        } = sh.SystemFile;
        (async() => {
            await sh.subprocess('cd ' + ROOT + ' && npm uninstall ' + plugin, {
                close: () => {
                    const file = ROOT + '/index'
                    var code = read(file).toString()
                        .replace(`const ${parse} = require('${plugin}')`, ``)
                        .replace(`sh.use(${parse})`, '')
                    write(file, code.trim())
                    sh.log('restart now!')
                },
                hide: true
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
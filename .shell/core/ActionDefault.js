const checkIndex = (text, arg1, arg2) => {
    return text.indexOf(arg1) !== -1 && text.indexOf(arg2) !== -1
}

module.exports = [{
    statement: (arg) => arg[0] == 'clear',
    console: {
        name: 'clear',
        description: 'Clear history command',
        tab: 6
    },
    action: async($this) => {
        $this.history = []
        $this.log('cleared history command')
        $this.cli()
    }
}, {
    statement: (arg) => arg[0] == 'exit',
    console: {
        name: 'exit',
        description: 'Exit the command. Not recommend if you run server on the background',
        tab: 6
    },
    action: async($this) => {
        $this.log('==> CREATED BY FERDIANSYAH0611 <=='.blue)
        $this.log('Good Bye!'.green)
        $this.startcli = false
        $this.exit(true)
    }
}, {
    statement: (arg) => arg[0] == 'edit',
    console: {
        name: 'edit',
        description: 'Show how to edit cli using vim',
        tab: 6
    },
    action: async($this, ROOT) => {
        $this.log('please run:', ('cd ' + ROOT + ' && vim index').blue)
    }
}, {
    statement: (arg) => arg[0] == 'app',
    maxArg: 2,
    console: {
        name: 'app [folder]',
        description: 'Change default app folder',
        tab: 5
    },
    action: async($this, ROOT) => {
        const name = $this.arg[1]
        const {
            append
        } = $this.SystemFile;
        append(ROOT + '/index', '', null, (text) => text.replace(`'${$this.root}'`, `'${name}'`))
        $this.env.root = name
        $this.root = $this.env.root
        $this._config()
        $this.log('change default app to', name)
        $this.cli()
    }

}, {
    statement: (arg) => arg[0] == 'mode',
    maxArg: 2,
    console: {
        name: 'mode [production|development]',
        description: 'Change mode command',
        tab: 3
    },
    action: async($this, ROOT) => {
        const name = $this.arg[1]
        if (['production', 'development'].find(v => v == name)) {
            const {
                append
            } = $this.SystemFile;
            append(ROOT + '/index', '', null, (text) => text.replace(`'${$this.env.mode}'`, `'${name}'`))
            $this.env.mode = name
            $this.isProduction = $this.env.mode === 'production'
            $this.log('change mode to', name)
            $this.cli()
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
    action: async($this, ROOT) => {
        const name = $this.arg[1]
        const plugin = $this.arg[2]
        const parse = $this.parse().toUpper(name)
        const {
            append
        } = $this.SystemFile;
        (async() => {
            await $this.subprocess('cd ' + ROOT + ' && npm i ' + plugin, {
                close: () => {
                    const file = ROOT + '/index'
                    append(file, ``, null, (text) => (
                        text.replace("// don't remove this comment", "// don't remove this comment\nsh.use(" + parse + ")")
                        .replace('#!/usr/bin/env node', `#!/usr/bin/env node\nconst ${parse} = require('${plugin}')`)
                        .trim()
                    ))
                    $this.log('restart now!')
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
    action: async($this, ROOT) => {
        await $this.subprocess('cd ' + ROOT + ' && npm update', {
            close: () => {
                $this.log('restart now!')
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
    action: async($this, ROOT) => {
        const name = $this.arg[1]
        const plugin = $this.arg[2]
        const parse = $this.parse().toUpper(name)
        const {
            read,
            write
        } = $this.SystemFile;
        (async() => {
            await $this.subprocess('cd ' + ROOT + ' && npm uninstall ' + plugin, {
                close: () => {
                    const file = ROOT + '/index'
                    var code = read(file).toString()
                        .replace(`const ${parse} = require('${plugin}')`, ``)
                        .replace(`sh.use(${parse})`, '')
                    write(file, code.trim())
                    $this.log('restart now!')
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
    action: async($this, ROOT) => {
        var arg = $this.history[$this.history.length - 2]
        if (arg) {
            $this.arg = arg
            $this.start()
        } else {
            $this.cli()
        }
    }
}]
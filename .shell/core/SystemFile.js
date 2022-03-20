const fs = require('fs');

class SystemFile {
    constructor(app) {
        this.app = app
        this.createDirRecursive = this.createDirRecursive.bind(this)
        this.append = this.append.bind(this)
        this.copy = this.copy.bind(this)
        this.write = this.write.bind(this)
        this.read = this.read.bind(this)
    }
    createDirRecursive(dir) {
        if (!fs.existsSync(dir)) {
            this.app.log('create directory'.green, dir.green)
            return fs.mkdirSync(dir, {
                recursive: true
            });
        }
    }
    append(filepath, first, end = null, replace = null) {
        var text = fs.readFileSync(filepath, 'utf8').toString()
        fs.writeFileSync(filepath, first + (replace ? replace(text) : text) + (end || ''))
    }
    copy(copy, dir, callback = Function) {
        if (!fs.existsSync(dir)) {
            var folder = dir.split('/')
            folder = folder.slice(0, folder.length - 1).join('/')
            fs.mkdirSync(folder, {
                recursive: true
            });
        }
        fs.copyFile(copy, dir, callback)
        return this.app.log('writing'.green, dir.green)
    }
    write(dir, val) {
        fs.writeFileSync(dir, val)
        return this.app.log('writing'.green, dir.green)
    }
    read(dir) {
        return fs.readFileSync(dir, 'utf8')
    }
}

module.exports = SystemFile
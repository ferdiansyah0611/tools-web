const fs = require("fs");

class SystemFile {
  constructor(app) {
    this.app = app;
    this.createDirRecursive = this.createDirRecursive.bind(this);
    this.append = this.append.bind(this);
    this.copy = this.copy.bind(this);
    this.write = this.write.bind(this);
    this.read = this.read.bind(this);
  }
  createDirRecursive(dir) {
    if (!fs.existsSync(dir)) {
      this.app.log(`create directory ${dir}`.green);
      return fs.mkdirSync(dir, {
        recursive: true,
      });
    }
  }
  append(filepath, first, end = null, replace = null) {
    var text = fs.readFileSync(filepath, "utf8").toString();
    fs.writeFileSync(
      filepath,
      first + (replace ? replace(text) : text) + (end || "")
    );
  }
  copy(copy, dir, callback = Function) {
    fs.copyFile(copy, dir, callback);
    return this.app.log(`writing ${dir}`.green);
  }
  write(dir, val) {
    fs.writeFileSync(dir, val);
    return this.app.log(`writing ${dir}`.green);
  }
  read(dir) {
    return fs.readFileSync(dir, "utf8");
  }
  createDirRecursiveRemoveFile(dir){
    let split = dir.split('/');
    this.createDirRecursive(split.slice(0, split.length - 2).join('/'));
  }
}

module.exports = SystemFile;

const Shell = require('./shell')

const sh = new Shell({
	mode: 'development',
	root: 'myapp',
	engine: 'ejs'
})
sh.start()
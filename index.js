const Shell = require('./shell')

const sh = new Shell({
	mode: 'production',
	root: 'myapp',
	engine: 'ejs'
})
sh.cli()
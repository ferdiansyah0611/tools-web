const Shell = require('./shell')

const sh = new Shell({
	mode: 'production',
	root: 'myapp',
})
sh.cli()
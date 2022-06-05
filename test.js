const Shell = require("./shell");
const Ci4 = require("../.plugin/codeigniter4");
const React = require("./.shell/core/react");
const Vue = require("./.shell/core/vue");
const Express = require("./.shell/core/express");

const sh = new Shell({
	mode: 0,
	root: "myapp",
});
// don't remove this comment
sh.use(React);
sh.use(Vue);
sh.use(Express);
sh.use(Ci4);
sh.cli();

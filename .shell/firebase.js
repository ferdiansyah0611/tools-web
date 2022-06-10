const Firebase = function () {
	this.name = "firebase";
	this.action = [
		{
			name: "init",
			console: {
				name: "init",
				description:
					"Generate initialize firebase, storage & authenticate (v9)",
				tab: 6,
			},
			action(arg, sh, plug, ROOT) {
				const file = sh.SystemFile;
				file.createDirRecursive(sh.env.root + "/src/service");
				file.copy(
					sh.config.firebase + "firebase.js",
					sh.env.root + "/src/firebase.js"
				);
				file.copy(
					sh.config.firebase + "validate.js",
					sh.env.root + "/src/service/validate-auth.js"
				);
			},
		},
		{
			name: "make:model",
			console: {
				name: "make:model [file]",
				description: "Generate model firestore",
				tab: 4,
			},
			action(arg, sh, plug, ROOT) {
				let file = sh.SystemFile,
					name = sh.parse().removeFormat(arg[0]);
				name = String(name).toLowerCase();
				file.createDirRecursive(sh.env.root + "/src/model");
				var code = file
					.read(sh.config.firebase + "model.js")
					.toString()
					.replaceAll("model", name);
				file.write(sh.env.root + "/src/model/" + name + ".js", code);
			},
		},
		{
			name: "storage",
			console: {
				name: "storage",
				description: "Generate service storage",
				tab: 5,
			},
			action(arg, sh, plug, ROOT) {
				let file = sh.SystemFile;
				file.createDirRecursive(sh.config.directory.service);
				var code = file
					.read(sh.config.firebase + "storage.js")
					.toString();
				file.write(
					sh.config.directory.service + "/firebase-storage.js",
					code
				);
			},
		},
		{
			name: "gcs",
			console: {
				name: "gcs",
				description:
					"Generate service google cloud storage for backend",
				tab: 6,
			},
			action(arg, sh, plug, ROOT) {
				let file = sh.SystemFile;
				file.createDirRecursive(sh.config.directory.service);
				file.copy(
					sh.config.firebase + "storage-be.js",
					sh.config.directory.service + "/storage.js"
				);
			},
		},
	];
	return this;
};

module.exports = Firebase;

import { paths } from "../constraint.js";
import { program, output } from "../lib.js";
import config from "../utils/config.js";
import file from "../utils/file.js";
import { toFilename } from "../utils/text.js";

const configure = {
  data: paths.root + "/data/firebase/",
};
const firebase = program.command("firebase").description("List firebase cli");
firebase
  .command("init")
  .description("Generate initialize firebase, storage & authenticate (v9)")
  .action(init);
firebase
  .command("make:model")
  .description("Generate model firestore")
  .argument("<name>", "model name")
  .action(makeModel);
firebase
  .command("storage")
  .description("Generate service storage")
  .action(storage);
firebase
  .command("gcs")
  .description("Generate service google cloud storage for backend")
  .action(gcs);

export function init() {
  const task = output.task("Generate Code");
  const value = config.read();
  const dir = config.getFullPathApp(value);
  file.mkdir(dir + "/src/service");
  file.copy(configure.data + "firebase.js", dir + "/src/firebase.js");
  file.copy(
    configure.data + "validate.js",
    dir + "/src/service/validate-auth.js",
  );
  task.done();
}
export function makeModel(name: string) {
  const task = output.task("Generate Code");
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const filename = toFilename(name);
  const code = file
    .read(configure.data + "model.js")
    .toString()
    .replaceAll("model", name);

  file.mkdir(dir + "/src/model");
  file.write(`${dir}/src/model/${filename}`, code);
  task.done();
}
export function storage() {
  const task = output.task("Generate Code");
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const code = file.read(configure.data + "storage.js").toString();

  file.mkdir(dir + "/src/service");
  file.write(`${dir}/src/service/firebase-storage.js`, code);
  task.done();
}
export function gcs() {
  const task = output.task("Generate Code");
  const value = config.read();
  const dir = config.getFullPathApp(value);
  file.mkdir(dir + "/src/service");
  file.copy(configure.data + "storage-be.js", `${dir}/src/service/storage.js`);
  task.done();
}

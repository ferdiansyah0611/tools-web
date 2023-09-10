import { paths } from "../constraint.js";
import { program } from "../lib.js";
import config from "../utils/config.js";
import file from "../utils/file.js";
import { compactName } from "../utils/text.js";

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
  const value = config.read();
  const dir = config.getFullPathApp(value);
  file.mkdir(dir + "/src/service");
  file.copy(paths.data.firebase + "firebase.js", dir + "/src/firebase.js");
  file.copy(
    paths.data.firebase + "validate.js",
    dir + "/src/service/validate-auth.js",
  );
}
export function makeModel(name: string) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(name, ".js");
  const code = file
    .read(paths.data.firebase + "model.js")
    .toString()
    .replaceAll("model", compact.camelCase);

  file.mkdir(paths.directory.model([compact.folder], dir));
  file.write(paths.directory.model([compact.path], dir), code);
}
export function storage() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const code = file.read(paths.data.firebase + "storage.js").toString();

  file.mkdir(dir + "/src/service");
  file.write(`${dir}/src/service/firebase-storage.js`, code);
}
export function gcs() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  file.mkdir(dir + "/src/service");
  file.copy(
    paths.data.firebase + "storage-be.js",
    `${dir}/src/service/storage.js`,
  );
}

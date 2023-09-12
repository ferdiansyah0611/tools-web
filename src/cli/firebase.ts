import { paths } from "../constraint.js";
import { program } from "../lib.js";
import { file } from "../utils/file.js";
import { compactName } from "../utils/text.js";
import config from "../utils/config.js";

program
  .command("firebase init", "Generate initialize firebase(v9)")
  .action(init)

  .command("firebase make:model", "Generate model firestore")
  .argument("<name>", "model name")
  .action(makeModel)

  .command("firebase storage", "Generate service storage")
  .action(storage)

  .command("firebase gcs", "Generate service google cloud storage for backend")
  .action(gcs);

export async function init() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  file.mkdir(dir + "/src/service");
  file.copy(paths.data.firebase + "firebase.js", dir + "/src/firebase.js");
  file.copy(
    paths.data.firebase + "validate.js",
    dir + "/src/service/validate-auth.js",
  );
}
export async function makeModel({ args }: any) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const compact = compactName(args.name, ".js");
  const code = file
    .read(paths.data.firebase + "model.js")
    .replaceAll("model", compact.camelCase);

  file.mkdir(paths.directory.model([compact.folder], dir));
  file.write(paths.directory.model([compact.path], dir), code);
}
export async function storage() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const code = file.read(paths.data.firebase + "storage.js");

  file.mkdir(dir + "/src/service");
  file.write(`${dir}/src/service/firebase-storage.js`, code);
}
export async function gcs() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  file.mkdir(dir + "/src/service");
  file.copy(
    paths.data.firebase + "storage-be.js",
    `${dir}/src/service/storage.js`,
  );
}

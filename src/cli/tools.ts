import { output, program } from "../lib.js";
import { execute } from "../utils/execute.js";
import config from "../utils/config.js";
import { paths } from "../constraint.js";

program
  .command("tools prettier:all", "Run prettier in the current project")
  .action(prettierAll)
  .hide()

  .command("tools git:automate", "Commit any files & push to repository")
  .argument("<remote>", "remote url target")
  .argument("<branch>", "branch target")
  .action(gitAutomate)
  .hide();

export async function prettierAll() {
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${dir} && npx prettier --write . --log-level silent`,
    {},
  );

  sub.doSync();
  output.log("Completed");
}
export async function gitAutomate({ args }: any) {
  const value = config.value;
  const dir = config.pathApp[0];
  console.log(paths.root)
  const sub = execute(
    `cd ${dir} && git add . && git commit -m "automate push" && git push ${args.remote} ${args.branch}`,
    {},
  );

  sub.changeEcho(value);
  sub.doSync();
  output.log("Completed");
}

import { actionRunner, output, program } from "../lib.js";
import { execute } from "../utils/execute.js";
import config from "../utils/config.js";

const tools = program.command("tools").description("List tools code");
tools
  .command("prettier:all")
  .description("Run prettier in the current project")
  .action(actionRunner(prettierAll));

tools
  .command("git:automate")
  .description("Commit any files & push to repository")
  .argument("<remote>", "remote url target")
  .argument("<branch>", "branch target")
  .action(actionRunner(gitAutomate));

export async function prettierAll() {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(
    `cd ${dir} && npx prettier --write . --log-level silent`,
    {},
  );

  sub.doSync();
  output.log("Completed");
}
export async function gitAutomate(remote: string, branch: string) {
  const value = config.read();
  const dir = config.getFullPathApp(value);
  const sub = execute(
    `cd ${dir} && git add . && git commit -m "automate push" && git push ${remote} ${branch}`,
    {},
  );

  sub.changeEcho(value);
  sub.doSync();
  output.log("Completed");
}

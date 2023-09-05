import { program } from "../lib.js";
import config from "../utils/config.js";
import subprocess from "../utils/subprocess.js";
import ora from "ora";

const tools = program.command("tools").description("List tools code");
tools
  .command("prettier:all")
  .description("Run prettier in the current project")
  .action(prettierAll);

tools
  .command("git:automate")
  .description("Commit any files & push to repository")
  .argument("<remote>", "remote url target")
  .argument("<branch>", "branch target")
  .action(gitAutomate);

export function prettierAll() {
  const task = ora("Processing...").start();
  const value = config.read();
  let execute = `cd ${config.getFullPathApp(
    value,
  )} && npx prettier --write . --loglevel silent`;

  subprocess.run(execute, { sync: true, hideLog: true });
  task.succeed("Completed");
}
export function gitAutomate(remote: string, branch: string) {
  const task = ora("Processing...").start();
  const value = config.read();
  let execute = `cd ${config.getFullPathApp(
    value,
  )} && git add . && git commit -m "automate push" && git push ${remote} ${branch}`;

  if (value.mode === 0) execute = "echo 1";
  subprocess.run(execute, { sync: true, hideLog: true });
  task.succeed("Completed");
}

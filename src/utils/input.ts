import chalk from "chalk";
import * as readlinePromise from "node:readline/promises";

const rl = readlinePromise.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const input = {
  rl,
  prompt,
  ask,
  select,
  close,
};
// tty
if (process.stdin.isTTY) process.stdin.setRawMode(true);

async function prompt(fisrtMessage?: string) {
  return await rl.question((fisrtMessage || "") + chalk.cyan("$ "));
}
async function ask(question: string) {
  console.log(chalk.cyan("#", question));
  return await rl.question(chalk.cyan("> "));
}
async function select(message: string, options: any[]) {
  let choice = -1;

  const callback = (c: any, k: any, resolve: any) => {
    console.clear();
    process.stdout.write(chalk.cyan("# " + message + "\n"));

    if (k.name === "up") {
      choice = choice === -1 || choice === 0 ? options.length - 1 : choice - 1;
    } else if (k.name === "down") {
      choice = choice === options.length - 1 ? 0 : choice + 1;
    } else if (k.name === "return") {
      resolve();
    }

    for (let index = 0; index < options.length; index++) {
      let option = options[index];
      if (index === choice) {
        console.log(">", option.label);
      } else {
        console.log(" ", option.label);
      }
    }
  };
  await new Promise((resolve) => {
    function done() {
      process.stdin.off("keypress", call);
      resolve(true);
    }
    function call(c: any, k: any) {
      callback(c, k, done);
    }
    process.stdin.on("keypress", call);
    process.stdin.emit("keypress", {}, {});
  });
  return options[choice].value;
}
function close() {
  rl.close();
}

export default input;

import { input, chalk } from "./lib.js";
import config from "./utils/config.js";
import main from "../main.js";

const args = process.argv.slice(2);
if (!args.length) multiCommand();
else {
  await main(args, () => {});
  process.exit()
}

function multiCommand() {
  process.title = "Tools Web";

  welcome();
  action();
}

function welcome() {
  let conf = config.value;
  let message = `
	Welcome to Tools Web
	${chalk.magentaBright("Namespace")}\t: ${conf.app_path}
	${chalk.magentaBright("App")}\t\t: ${conf.app_active}
	${chalk.magentaBright("Library")}\t\t: ${
    !conf.library.length
      ? "None"
      : conf.library
      .filter((v) => v.active === true)
          .map((v) => v.name)
          .join(", ")
  }
	${chalk.magentaBright("Mode")}\t\t: ${
    conf.mode === 1 ? "Production" : "Development"
  }
	`;
  console.log(message);
}

async function action(argv: string | any = ""): Promise<any> {
  let value = config.value;
  let argument =
    argv || (await input.prompt(chalk.green(`/${value.app_active} `)));
  let split: string[] = argument.split(" ");

  if (argument === "") {
    split = ["help"];
  }
  if (argument === ".") {
    welcome();
    return action();
  }
  if (argument.startsWith("reload")) {
    return action();
  }
  return main(split, action);
}
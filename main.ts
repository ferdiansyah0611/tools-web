import { input, program } from "./src/lib.js";
import config from "./src/utils/config.js";
// @ts-ignore
import minimist from "minimist";
import "./src/cli/express.js";
import "./src/cli/firebase.js";
import "./src/cli/react.js";
import "./src/cli/tailwind.js";
import "./src/cli/vite.js";
import "./src/cli/tools.js";
import "./src/cli/sys.js";
import "./src/cli/vue.js";

program
  .name("tools-web")
  .description("Tools to speed up developing a website using the cli").version("1.2.00");

// type [ or ] to auto write cli
let current = 0;
let command: any[] = await program.getAllCommands();
command = command.map((v: any) => v.name);
process.stdin.on("keypress", (c: any, k: any) => {
  if(k.sequence === "]") {
    input.rl.write(null, {
      ctrl: true,
      name: "u"
    });
    input.rl.write(command[current])
    current += 1;
    if(current + 1 > command.length) current = 0;
  }
  else if(k.sequence === "[") {
    input.rl.write(null, {
      ctrl: true,
      name: "u"
    });
    input.rl.write(command[current])
    current -= 1;
    if(current - 1 < 0) current = command.length;
  }
});
// load library
const conf = config.read();
await new Promise((resolve) => {
  if (!conf.library.length) return resolve(true);

  conf.library.forEach(async (library, index, arr) => {
    if (!library.active) return;
    await import(library.path);
    if (index === arr.length - 1) {
      resolve(true);
    }
  });
});


export default async function main(arg: string|string[], callback: any, isTest: boolean = false) {
  try {
    let v = minimist(arg);
    let options = v;
    let args: string[] = Array.from(v._);

    delete v._;
    await program.exec(args, options);
  } catch (e: any) {
    let message: string = e.message;
    let indexSynopsis = message.indexOf("Synopsis: ");
    if (indexSynopsis !== -1) message = message.slice(0, indexSynopsis - 2);
    if (!isTest) {
      process.stdout.write(message);
      if(Array.isArray(arg)) input.rl.write(arg.join(" "));
    }
  } finally {
    if(!isTest) setTimeout(callback, 1000);
  }
}
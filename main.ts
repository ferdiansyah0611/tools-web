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

// initialize
program
  .name("tools-web")
  .description("Tools to speed up developing a website using the cli").version("1.2.00");

const configValue = config.read();
await new Promise((resolve) => {
  if (!configValue.library.length) return resolve(true);

  configValue.library.forEach(async (library, index, arr) => {
    if (!library.active) return;
    await import(library.path);
    if (index === arr.length - 1) {
      resolve(true);
    }
  });
});
await completion();

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

/**
 * 2 optional to autcompletion
 * type [ or ]
 * type char on the first word -> tabs and then type [ or ]
 */
async function completion() {

  type DataCompletion = {
    lastChar: string;
    current: number;
    inPotential: boolean;
    potential: any[];
    cli: any[];
    nextCurrent(): any;
    previousCurrent(): any;
    writeCurrent(): any;
  }

  let command: any[] = await program.getAllCommands();
  let data: DataCompletion = {
    lastChar: "",
    current: 0,
    cli: [],
    nextCurrent() {
      this.current += 1;
      if(!this.cli[this.current + 1]) this.current = 0;
    },
    previousCurrent() {
      this.current -= 1;
      if(!this.cli[this.current - 1]) this.current = this.cli.length - 1;
    },
    writeCurrent() {
      input.rl.write(null, {
        ctrl: true,
        name: "u"
      });
      input.rl.write(this.cli[this.current])
    },

    potential: [],
    inPotential: false
  }

  command = command.map((v: any) => v.name);
  data.cli = command;

  process.stdin.on("keypress", (char: string, e: any) => {
    if(e.sequence === "]") {
      data.writeCurrent()
      data.nextCurrent()
    }
    else if(e.sequence === "[") {
      data.writeCurrent()
      data.previousCurrent()
    }
    else if(e.name === "tab") {
      data.cli = command.filter((v) => v.startsWith(data.lastChar) === true);
      data.inPotential = true;
      input.rl.write(null, {
        ctrl: true,
        name: "u"
      });
    }
    else if(e.name === "backspace") {
      data.cli = command;
      data.inPotential = false;
    }
    else {
      data.lastChar = char;
    }
  });
}
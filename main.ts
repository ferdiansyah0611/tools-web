import { program } from "./src/lib.js"
import config from "./src/utils/config.js"
import "./src/cli/express.js"
import "./src/cli/firebase.js"
import "./src/cli/react.js"
import "./src/cli/tailwind.js"
import "./src/cli/vite.js"
import "./src/cli/tools.js"
import "./src/cli/sys.js"
import "./src/cli/vue.js"

// load library
const conf = config.read();
await new Promise((resolve) => {
  if(!conf.library.length) return resolve(true);
  
  conf.library.forEach(async (library, index, arr) => {
    if(!library.active) return;
    await import(library.path);
    if(index === arr.length - 1) {
      resolve(true);
    }
  })
})

program
  .name('tools-web')
  .description('Tools to speed up developing a website using the cli')
  .version('1.2.00');

program.parse();
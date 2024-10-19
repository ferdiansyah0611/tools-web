import { program } from "../../lib.js";
import { execute } from "../../utils/execute.js";
import config from "../../utils/config.js";

program
  .command("starter next", "Create NextJS Project (@ixartz)")
  .argument("name", "name of project")
  .action(starterNextJs)

  .command("starter react", "Create ReactJS Project (@RicardoValdovinos)")
  .argument("name", "name of project")
  .action(starterReactJs)

  .command("starter vue", "Create VueJS Project (@richardevcom)")
  .argument("name", "name of project")
  .action(starterVueJs)

  .command("starter express", "Create ExpressJS Project (@hagopj13)")
  .argument("name", "name of project")
  .action(starterVueJs)

export function starterNextJs({ args }: any) {
  const name = args.name || config.value.app_active;
  const sub = execute(
   `cd ${config.value.app_path} && git clone --depth=1 https://github.com/ixartz/Next-js-Boilerplate.git ${name} && cd ${name} && npm i`,
   {
     background: true,
   },
  );
  sub.doRun();
}

export function starterReactJs({ args }: any) {
  const name = args.name || config.value.app_active;
  const sub = execute(
   `cd ${config.value.app_path} && git clone --depth=1 https://github.com/RicardoValdovinos/vite-react-boilerplate.git ${name} && cd ${name} && npm i`,
   {
     background: true,
   },
  );
  sub.doRun();
}

export function starterVueJs({ args }: any) {
  const name = args.name || config.value.app_active;
  const sub = execute(
   `cd ${config.value.app_path} && git clone --depth=1 https://github.com/richardevcom/vue3-boilerplate.git ${name} && cd ${name} && npm i`,
   {
     background: true,
   },
  );
  sub.doRun();
}

export function starterExpressJs({ args }: any) {
  const name = args.name || config.value.app_active;
  const sub = execute(
   `cd ${config.value.app_path} && git clone --depth=1 https://github.com/hagopj13/node-express-boilerplate.git ${name} && cd ${name} && npm i && cp .env.example .env`,
   {
     background: true,
   },
  );
  sub.doRun();
}
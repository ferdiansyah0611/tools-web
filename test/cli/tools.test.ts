import test, { afterEach } from "node:test";
import config from "../../src/utils/config.js";
import { prettierAll, gitAutomate } from "../../src/cli/tools.js";
import { makeProject } from "../../src/cli/vite.js";
import { file } from "../../src/utils/file.js";
import { input } from "../../src/lib.js";

test("tools cli test", async (t) => {
  afterEach(() => {
    input.close();
  });

  const value = config.value;
  const dir = config.pathApp[0];

  test.before(async () => {
    file.rm(dir);
    await makeProject({
      args: { name: value.app_active },
      options: {
        template: "vue",
      },
    });
  });

  await t.test("do change app active", async () => {
    prettierAll();
  });
  await t.test("do change app root", async () => {
    gitAutomate({ args: { remote: "origin", branch: "main" } });
  });
});

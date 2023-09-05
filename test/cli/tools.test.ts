import test from "node:test";
import { prettierAll, gitAutomate } from "../../src/cli/tools.js";
import { makeProject } from "../../src/cli/vite.js";
import config from "../../src/utils/config.js";
import file from "../../src/utils/file.js";

test("tools cli test", async (t) => {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  test.before(async () => {
    file.rm(dir);
    await makeProject(value.app_active, {
      template: "vue",
    });
  });

  await t.test("do change app active", async (t) => {
    prettierAll();
  });
  await t.test("do change app root", async (t) => {
    gitAutomate("origin", "main");
  });
});

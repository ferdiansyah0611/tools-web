import assert from "node:assert";
import test, { afterEach } from "node:test";
import config from "../../src/utils/config.js";
import { makeProject } from "../../src/cli/vite.js";
import { file } from "../../src/utils/file.js";
import { input } from "../../src/lib.js";

test("vite cli test", async (t) => {
  afterEach(() => {
    input.close();
  });

  const value = config.value;
  const dir = config.pathApp[0];

  const folderValidation = () => {
    file.rm(dir);
    assert.strictEqual(file.isExists(dir), false);
  };
  const installValidation = () => {
    assert.strictEqual(file.isExists(dir + "/vite.config.js"), true);
    assert.strictEqual(file.isExists(dir + "/vercel.json"), true);
  };

  await t.test("install vue", async () => {
    folderValidation();
    await makeProject({
      args: { name: value.app_active },
      options: {
        template: "vue",
      },
    });
    installValidation();
  });

  await t.test("install react", async () => {
    folderValidation();
    await makeProject({
      args: { name: value.app_active },
      options: {
        template: "react",
      },
    });
    installValidation();
  });
});

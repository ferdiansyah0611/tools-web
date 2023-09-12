import assert from "node:assert";
import test, { afterEach } from "node:test";
import config from "../../src/utils/config.js";
import {
  addTailwind,
  addDaisyUI,
  addHeadlessUI,
  addFlowbite,
} from "../../src/cli/tailwind.js";
import { makeProject } from "../../src/cli/vite.js";
import { file } from "../../src/utils/file.js";
import { input } from "../../src/lib.js";

test("tailwindcss cli test", async (t) => {
  afterEach(() => {
    input.close();
  });

  const value = config.read();
  const dir = config.getFullPathApp(value);

  await t.test("do make project with vite", async (t) => {
    file.rm(dir);
    await makeProject({
      args: { name: value.app_active },
      options: {
        template: "react",
      },
    });
  });

  await t.test("do add tailwindcss", async (t) => {
    await addTailwind();
  });
  await t.test("do add daisy ui", async (t) => {
    await addDaisyUI();
    await new Promise((resolve) => {
      setTimeout(() => {
        let tailwindConfig = dir + "/tailwind.config.cjs";
        assert.strictEqual(file.isExists(tailwindConfig), true);
        assert.strictEqual(
          file
            .read(tailwindConfig)
            .toString()
            .includes('plugins: [ require("daisyui"), '),
          true,
        );
        resolve(true);
      }, 1000);
    });
  });
  await t.test("do add headless ui", async (t) => {
    await addHeadlessUI();
  });
  await t.test("do add flowbite", async (t) => {
    await addFlowbite();
    await new Promise((resolve) => {
      setTimeout(() => {
        let tailwindConfig = dir + "/tailwind.config.cjs";
        assert.strictEqual(file.isExists(tailwindConfig), true);
        assert.strictEqual(
          file
            .read(tailwindConfig)
            .toString()
            .includes('plugins: [ require("flowbite/plugin"), '),
          true,
        );
        resolve(true);
      }, 1000);
    });
  });
});

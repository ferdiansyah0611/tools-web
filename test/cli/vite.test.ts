import assert from "node:assert";
import test from "node:test";
import config from "../../src/utils/config.js";
import { makeProject, addTailwind } from "../../src/cli/vite.js";
import { file } from "../../src/utils/file.js";
import { paths } from "../../src/constraint.js";

test("vite cli test", async (t) => {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  const folderValidation = () => {
    file.rm(dir);
    assert.strictEqual(file.isExists(dir), false);
  };
  const installValidation = () => {
    assert.strictEqual(file.isExists(dir + "/vite.config.js"), true);
    assert.strictEqual(file.isExists(dir + "/vercel.json"), true);
  };

  await t.test("install vue", async (t) => {
    folderValidation();
    await makeProject(value.app_active, {
      template: "vue",
    });
    installValidation();
  });

  await t.test("install react", async (t) => {
    folderValidation();
    await makeProject(value.app_active, {
      template: "react",
    });
    installValidation();
  });

  await t.test("integrate tailwindcss", async (t) => {
    await addTailwind({ react: true });
    assert.strictEqual(
      file.isExists(paths.directory.src(["tailwind.sass"], dir)),
      true,
    );
    assert.strictEqual(file.isExists(dir + "/tailwind.config.cjs"), true);
  });
});

import assert from "node:assert";
import test, { afterEach } from "node:test";
import config from "../../src/utils/config.js";
import {
  changeAppActive,
  changeAppRoot,
  changeAppMode,
  appUpdate,
  packageOff,
  packageOn,
  packageInstall,
  packageUninstall,
  repositoryInstall,
  repositoryUninstall
} from "../../src/cli/sys.js";
import { input, output } from "../../src/lib.js";

test("system cli test", async (t) => {
  afterEach(() => {
    input.close();
  });

  const value = {...config.value};
  output.isHidden = true;

  await t.test("do change app active", async () => {
    changeAppActive({ args: { path: "./test" } });
    assert.strictEqual(config.read().app_active, "./test");
  });
  await t.test("do change app root", async () => {
    changeAppRoot({ args: { path: "C:/User/ferdi/test" } });
    assert.strictEqual(config.read().app_path, "C:/User/ferdi/test");
  });
  await t.test("do change app mode", async () => {
    changeAppMode({ args: { mode: "p" } });
    assert.strictEqual(config.read().mode, 1);
    changeAppMode({ args: { mode: "d" } });
  });
  await t.test("do update tools-web", async () => {
    appUpdate();
  });
  await t.test("do off package", async () => {
    packageOff({ args: { name: "react" } });
  });
  await t.test("do on package", async () => {
    packageOn({ args: { name: "react" } });
    assert.deepStrictEqual(config.read().library, value.library);
  });
  await t.test("do install package", async () => {
    packageInstall({ args: { name: "maybe-error" } });
    const result = config.read().library.find((v) => v.name == "maybe-error")
    assert.equal(Boolean(result), true)
  });
  await t.test("do uninstall package", async () => {
    packageUninstall({ args: { name: "maybe-error" } });
  });
  await t.test("do install repository", async () => {
    repositoryInstall({ args: { name: "starter" } });
    const result = config.read().repository.find((v) => v.name == "starter")
    assert.equal(Boolean(result), true)
  });
  await t.test("do uninstall repository", async () => {
    repositoryUninstall({ args: { name: "starter" } });
  });

  test.after(() => {
    config.update(value);
    config.endSession();
  });
});

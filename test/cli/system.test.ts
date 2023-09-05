import assert from "node:assert";
import test from "node:test";
import {
  changeAppActive,
  changeAppRoot,
  changeAppMode,
  appUpdate,
  packageOff,
  packageOn,
  packageInstall,
  packageUninstall,
} from "../../src/cli/sys.js";
import config from "../../src/utils/config.js";
import file from "../../src/utils/file.js";

test("system cli test", async (t) => {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  await t.test("do change app active", async (t) => {
    changeAppActive("./test");
    assert.strictEqual(config.read().app_active, "./test");
  });
  await t.test("do change app root", async (t) => {
    changeAppRoot("C:/User/ferdi/test");
    assert.strictEqual(config.read().app_path, "C:/User/ferdi/test");
  });
  await t.test("do change app mode", async (t) => {
    changeAppMode("1");
    assert.strictEqual(config.read().mode, 1);
    changeAppMode("0");
  });
  await t.test("do update tools-web", async (t) => {
    appUpdate();
  });
  await t.test("do off package", async (t) => {
    packageOff("react");
    assert.notDeepStrictEqual(config.read().library, value.library);
  });
  await t.test("do on package", async (t) => {
    packageOn("react");
    assert.deepStrictEqual(config.read().library, value.library);
  });
  await t.test("do install package", async (t) => {
    packageInstall("maybe-error");
    assert.notDeepStrictEqual(config.read().library, value.library);
  });
  await t.test("do uninstall package", async (t) => {
    packageUninstall("maybe-error");
    assert.deepStrictEqual(config.read().library, value.library);
  });

  test.after(() => {
    config.update(value);
  });
});
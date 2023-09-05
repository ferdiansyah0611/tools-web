import assert from "node:assert";
import test from "node:test";
import { init, makeModel, storage, gcs } from "../../src/cli/firebase.js";
import config from "../../src/utils/config.js";
import file from "../../src/utils/file.js";

test("firebase cli test", async (t) => {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  await t.test("do init", async (t) => {
    init();
    assert.strictEqual(file.isExists(dir + "/src/firebase.js"), true);
    assert.strictEqual(
      file.isExists(dir + "/src/service/validate-auth.js"),
      true,
    );
  });

  await t.test("do make model", (t) => {
    makeModel("user");
  });

  await t.test("do storage", (t) => {
    storage();
    assert.strictEqual(
      file.isExists(dir + "/src/service/firebase-storage.js"),
      true,
    );
  });

  await t.test("do gcs", (t) => {
    gcs();
    assert.strictEqual(file.isExists(dir + "/src/service/storage.js"), true);
  });
});

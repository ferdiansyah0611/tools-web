import assert from "node:assert";
import test, { afterEach } from "node:test";
import config from "../../src/utils/config.js";
import { init, makeModel, storage, gcs } from "../../src/cli/firebase.js";
import { file } from "../../src/utils/file.js";
import { paths } from "../../src/constraint.js";
import { input, output } from "../../src/lib.js";

test("firebase cli test", async (t) => {
  afterEach(() => {
    input.close();
  });

  const dir = config.pathApp[0];
  output.isHidden = true;

  await t.test("do init", async () => {
    init();
    assert.strictEqual(file.isExists(dir + "/src/firebase.js"), true);
    assert.strictEqual(
      file.isExists(dir + "/src/service/validate-auth.js"),
      true,
    );
  });

  await t.test("do make model", async (t) => {
    const samples = {
      data: [
        "api/user",
        "api/repository",
        "api/oauth",
        "template",
        "information",
        "profile",
        "auth",
      ],
    };
    for (let sample of samples.data) makeModel({ args: { name: sample } });
    for (let sample of samples.data) {
      sample += ".js";
      await t.test(`exists ${sample}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.model([sample], dir)),
          true,
        ),
      );
    }
  });

  await t.test("do storage", () => {
    storage();
    assert.strictEqual(
      file.isExists(dir + "/src/service/firebase-storage.js"),
      true,
    );
  });

  await t.test("do gcs", () => {
    gcs();
    assert.strictEqual(file.isExists(dir + "/src/service/storage.js"), true);
  });
});

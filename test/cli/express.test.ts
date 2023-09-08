import assert from "node:assert";
import test from "node:test";
import { makeProject, makeModel, makeAPI } from "../../src/cli/express.js";
import config from "../../src/utils/config.js";
import file from "../../src/utils/file.js";
import { paths } from "../../src/constraint.js";

test("express cli test", async (t) => {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  await t.test("do make project", async (t) => {
    await makeProject({
      template: "hbs",
      db: "mongoose",
    });

    assert.strictEqual(file.isExists(dir + "/.env"), true);
    assert.strictEqual(file.isExists(dir + "/.env.dev"), true);
    assert.strictEqual(file.isExists(dir + "/.env.test"), true);
  });

  await t.test("do make model", async (t) => {
    const samples = {
      data: [
        ["user/Profile", "mongoose"],
        ["user/Post", "mongoose"],
        ["post/Comment", "sequelize"],
        ["authorization", "sequelize"],
      ],
    };
    for (let sample of samples.data)
      makeModel(sample[0], {
        col: "id,user,password",
        db: sample[1],
      });
    for (let sample of samples.data) {
      sample[0] += ".js";
      await t.test(`exists ${sample[0]}`, () =>
        assert.strictEqual(file.isExists(paths.directory.model([sample[0]], dir)), true),
      );
    }
  });

  await t.test("do make api", async (t) => {
    const samples = {
      data: [
        ["user/Profile", "mongoose"],
        ["user/Post", "mongoose"],
        ["post/Comment", "sequelize"],
        ["authorization", "sequelize"],
      ],
    };
    for (let sample of samples.data)
      makeAPI(sample[0], {
        col: "id,user,password",
        db: sample[1],
      });
    for (let sample of samples.data) {
      sample[0] += ".js";
      await t.test(`exists ${sample[0]}`, () =>
        assert.strictEqual(file.isExists(paths.directory.api([sample[0]], dir)), true),
      );
    }
  });
});
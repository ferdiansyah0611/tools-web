import assert from "node:assert";
import test from "node:test";
import { makeProject, makeModel, makeAPI } from "../../src/cli/express.js";
import config from "../../src/utils/config.js";
import file from "../../src/utils/file.js";

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

  await t.test("do make model", (t) => {
    makeModel("user-mongoose", {
      col: "id,user,password",
      db: "mongoose",
    });
    makeModel("user-sequelize", {
      col: "id,user,password",
      db: "sequelize",
    });
  });

  await t.test("do make api", (t) => {
    makeAPI("user-mongoose", {
      col: "id,user,password",
      db: "mongoose",
    });
    makeAPI("user-sequelize", {
      col: "id,user,password",
      db: "sequelize",
    });
  });
});

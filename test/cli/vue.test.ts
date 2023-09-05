import assert from "node:assert";
import test from "node:test";
import config from "../../src/utils/config.js";
import file from "../../src/utils/file.js";
import {
  addQuasar,
  addVuetify,
  addAntd,
  addElementPlus,
  makeComponent,
  makeRoute,
  makeStore,
} from "../../src/cli/vue.js";
import { makeProject } from "../../src/cli/vite.js";
import { paths } from "../../src/constraint.js";

test("vue cli test", async (t) => {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  await t.test("do make project with vite", async (t) => {
    file.rm(dir);
    await makeProject(value.app_active, {
      template: "vue",
    });
  });

  await t.test("do add quasar", async (t) => {
    await addQuasar();
    assert.strictEqual(
      file.isExists(paths.directory.src(["quasar-variables.sass"], dir)),
      true,
    );
  });

  await t.test("do add vuetify", async (t) => {
    await addVuetify({
      icon: "mdi-cdn",
    });
  });
  await t.test("do add ant design", async (t) => {
    await addAntd();
  });

  await t.test("do add element plus", async (t) => {
    await addElementPlus();
  });

  await t.test("do make component", (t) => {
    makeComponent("sidebar", {});
    makeComponent("navbar", {});
    makeComponent("sidebar-3", { hook: false });
  });

  await t.test("do make store", (t) => {
    makeStore("user");
    makeStore("people");
  });

  await t.test("do make route", (t) => {
    makeRoute("notfound", "/404", {});
    makeRoute("home", "/home", {});
    makeRoute("welcome", "/welcome", { hook: false });
  });
});

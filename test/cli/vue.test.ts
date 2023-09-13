import assert from "node:assert";
import test, { afterEach } from "node:test";
import config from "../../src/utils/config.js";
import { file } from "../../src/utils/file.js";
import {
  addQuasar,
  addVuetify,
  addAntd,
  addElementPlus,
  makeComponent,
  makeRoute,
  makeVuex,
  addRoute,
  addVuex,
} from "../../src/cli/vue.js";
import { makeProject } from "../../src/cli/vite.js";
import { paths } from "../../src/constraint.js";
import { input } from "../../src/lib.js";

test("vue cli test", async (t) => {
  afterEach(() => {
    input.close();
  });

  const value = config.value;

  await t.test("do make project with vite", async () => {
    file.rm(config.pathApp[0]);
    await makeProject({
      args: { name: value.app_active },
      options: {
        template: "vue",
      },
    });
  });

  await t.test("do add quasar", async () => {
    await addQuasar();
    assert.strictEqual(
      file.isExists(
        paths.directory.src(["quasar-variables.sass"], config.pathApp[0]),
      ),
      true,
    );
  });

  await t.test("do add vuetify", async () => {
    await addVuetify({
      options: {
        icon: "mdi-cdn",
      },
    });
  });
  await t.test("do add ant design", async () => {
    await addAntd();
  });

  await t.test("do add element plus", async () => {
    await addElementPlus();
  });

  await t.test("do add vue-router", async () => {
    await addRoute();
  });

  await t.test("do add vuex", async () => {
    await addVuex();
  });

  await t.test("do make component", async () => {
    const samples = {
      data: ["layout/navbar", "layout/sidebar", "button", "card", "list"],
    };

    for (let sample of samples.data)
      makeComponent({
        args: { name: sample },
        options: { hook: Math.floor(Math.random() * 1) ? true : false },
      });
    for (let sample of samples.data) {
      sample += ".vue";
      await t.test(`exists ${sample}`, () =>
        assert.strictEqual(
          file.isExists(
            paths.directory.components([sample], config.pathApp[0]),
          ),
          true,
        ),
      );
    }
  });

  await t.test("do make vuex", async (t) => {
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
    for (let sample of samples.data) makeVuex({ args: { name: sample } });
    for (let sample of samples.data) {
      sample += ".js";
      await t.test(`exists ${sample}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.store([sample], config.pathApp[0])),
          true,
        ),
      );
    }
  });

  await t.test("do make route", async (t) => {
    const samples = {
      data: [
        ["world", "/world"],
        ["welcome", "/welcome"],
        ["profile/show", "/profile/show"],
        ["profile/edit", "/profile/edit"],
        ["auth/signin", "/auth/signin"],
      ],
    };
    for (let sample of samples.data)
      makeRoute({
        args: { name: sample[0], url: sample[1] },
        options: { hook: Math.floor(Math.random() * 1) ? true : false },
      });
    for (let sample of samples.data) {
      sample[0] += ".vue";
      await t.test(`exists ${sample[0]}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.route([sample[0]], config.pathApp[0])),
          true,
        ),
      );
    }
  });
});

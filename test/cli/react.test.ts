import assert from "node:assert";
import test from "node:test";
import config from "../../src/utils/config.js";
import file from "../../src/utils/file.js";
import {
  addMUI,
  addAntd,
  makeComponent,
  makeRoute,
  makeStore,
} from "../../src/cli/react.js";
import { makeProject } from "../../src/cli/vite.js";
import { paths } from "../../src/constraint.js";

test("react cli test", async (t) => {
  const value = config.read();
  const dir = config.getFullPathApp(value);

  file.rm(dir);

  await t.test("do make project with vite", async (t) => {
    await makeProject(value.app_active, {
      template: "react",
    });
  });

  await t.test("do add mui", async (t) => {
    await addMUI();
    assert.strictEqual(
      file.isExists(paths.directory.store(["theme.js"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(paths.directory.src(["mui.jsx"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(paths.directory.service(["color.js"], dir)),
      true,
    );
  });

  await t.test("do add antd", async (t) => {
    await addAntd();
  });

  await t.test("do make component", (t) => {
    makeComponent("sidebar-1", { style: "css" });
    makeComponent("sidebar-2", { style: "sass" });
    makeComponent("sidebar-3", { style: "scss" });
    assert.strictEqual(
      file.isExists(paths.directory.component(["Sidebar_1.jsx"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(paths.directory.component(["Sidebar_2.jsx"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(paths.directory.component(["Sidebar_3.jsx"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(
        paths.directory.style(["component", "Sidebar_1.module.css"], dir),
      ),
      true,
    );
    assert.strictEqual(
      file.isExists(
        paths.directory.style(["component", "Sidebar_2.module.sass"], dir),
      ),
      true,
    );
    assert.strictEqual(
      file.isExists(
        paths.directory.style(["component", "Sidebar_3.module.scss"], dir),
      ),
      true,
    );
  });

  await t.test("do make store", (t) => {
    makeStore("userAsync", { type: "async" });
    makeStore("userReducer", { type: "reducer" });
    makeStore("user", {});
    makeStore("data-user", {});
  });

  t.test("do make route", (t) => {
    makeRoute("notfound-1", "/404", { style: "css" });
    makeRoute("notfound-2", "/405", { style: "sass" });
    makeRoute("notfound-3", "/406", { style: "scss" });
    assert.strictEqual(
      file.isExists(paths.directory.route(["Notfound_1.jsx"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(paths.directory.route(["Notfound_2.jsx"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(paths.directory.route(["Notfound_3.jsx"], dir)),
      true,
    );
    assert.strictEqual(
      file.isExists(
        paths.directory.style(["route", "Notfound_1.module.css"], dir),
      ),
      true,
    );
    assert.strictEqual(
      file.isExists(
        paths.directory.style(["route", "Notfound_2.module.sass"], dir),
      ),
      true,
    );
    assert.strictEqual(
      file.isExists(
        paths.directory.style(["route", "Notfound_3.module.scss"], dir),
      ),
      true,
    );
  });
});

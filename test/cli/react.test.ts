import assert from "node:assert";
import test, { afterEach } from "node:test";
import config from "../../src/utils/config.js";
import { file } from "../../src/utils/file.js";
import {
  addMUI,
  addAntd,
  makeComponent,
  makeRoute,
  makeReduxToolkit,
  addRecoil,
  addReduxToolkit,
  addReactRouter,
} from "../../src/cli/react.js";
import { makeProject } from "../../src/cli/vite.js";
import { paths } from "../../src/constraint.js";
import { input } from "../../src/lib.js";

test("react cli test", async (t) => {
  afterEach(() => {
    input.close();
  });

  const value = config.read();
  const dir = config.getFullPathApp(value);

  file.rm(dir);

  await t.test("do make project with vite", async (t) => {
    await makeProject({
      args: { name: value.app_active },
      options: {
        template: "react",
      },
    });
  });

  await t.test("do add mui", async (t) => {
    await addMUI();
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

  await t.test("do add recoil", async (t) => {
    await addRecoil();
  });

  await t.test("do add redux-toolkit", async (t) => {
    await addReduxToolkit();
  });

  await t.test("do add react-router", async (t) => {
    await addReactRouter();
  });

  await t.test("do make component", async (t) => {
    const samples = {
      data: [
        ["layout/navbar", "sass"],
        ["layout/sidebar", "sass"],
        ["button", "css"],
        ["card", "css"],
        ["list", "scss"],
      ],
      component: [
        "layout/Navbar.jsx",
        "layout/Sidebar.jsx",
        "Button.jsx",
        "Card.jsx",
      ],
      style: [
        ["component/layout", "Navbar.module.sass"],
        ["component/layout", "Sidebar.module.sass"],
        ["component", "Button.module.css"],
        ["component", "Card.module.css"],
        ["component", "List.module.scss"],
      ],
    };
    for (let sample of samples.data)
      makeComponent({
        args: { name: sample[0] },
        options: { style: sample[1] },
      });
    for (let sample of samples.component) {
      await t.test(`exists ${sample}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.component([sample], dir)),
          true,
        ),
      );
    }
    for (let sample of samples.style) {
      await t.test(`exists ${sample[1]}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.style([...sample], dir)),
          true,
        ),
      );
    }
  });

  await t.test("do make redux-toolkit", async (t) => {
    const samples = {
      data: [
        ["api/user", "async"],
        ["api/repository", "async"],
        ["api/oauth", "async"],
        ["template", "reducer"],
        ["information", "reducer"],
        ["profile", "reducer"],
        ["auth", ""],
      ],
    };

    for (let sample of samples.data) {
      if (sample[1])
        makeReduxToolkit({
          args: { name: sample[0] },
          options: { type: sample[1] },
        });
      else makeReduxToolkit({ args: { name: sample[0] }, options: {} });
    }
    for (let sample of samples.data) {
      sample[0] += ".js";
      await t.test(`exists ${sample[0]}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.store([sample[0]], dir)),
          true,
        ),
      );
    }
  });

  await t.test("do make route", async (t) => {
    const samples = {
      data: [
        ["world", "/world", "css"],
        ["welcome", "/welcome", "css"],
        ["profile/show", "/profile/show", "scss"],
        ["profile/edit", "/profile/edit", "scss"],
        ["auth/signin", "/auth/signin", "sass"],
      ],
      route: [
        ["World.jsx"],
        ["Welcome.jsx"],
        ["profile/Show.jsx"],
        ["profile/Edit.jsx"],
        ["auth/Signin.jsx"],
      ],
      style: [
        ["World.module.css"],
        ["Welcome.module.css"],
        ["profile/Show.module.scss"],
        ["profile/Edit.module.scss"],
        ["auth/Signin.module.sass"],
      ],
    };

    for (let sample of samples.data)
      makeRoute({
        args: {
          name: sample[0],
          url: sample[1],
        },
        options: { style: sample[2] },
      });
    for (let sample of samples.route) {
      await t.test(`exists ${sample[0]}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.route([sample[0]], dir)),
          true,
        ),
      );
    }
    for (let sample of samples.style) {
      await t.test(`exists ${sample[0]}`, () =>
        assert.strictEqual(
          file.isExists(paths.directory.style(["route", sample[0]], dir)),
          true,
        ),
      );
    }
  });
});

import axiod from "https://deno.land/x/axiod/mod.ts";

const headers = {
  "Content-Type": "application/json",
};

// headers['x-access-token'] = 'token'

// method
const get = (url) =>
  axiod.get(url, {
    headers: headers,
  });
const add = (url, data) =>
  axiod.post(url, data, {
    headers: headers,
  });
const update = (url, data) =>
  axiod.patch(url, data, {
    headers: headers,
  });
const remove = (url) =>
  axiod.delete(url, {
    headers: headers,
  });

// CRUD API
const crud = (path, baseURL) => {
  return [
    {
      path: path + ".get",
      action: () => {
        return get(baseURL);
      },
    },
    {
      path: path + ".add",
      action: (arg) => {
        return add(baseURL, arg[0]);
      },
    },
    {
      path: path + ".update",
      action: (arg) => {
        return update(baseURL + "/" + arg[0], arg[1]);
      },
    },
    {
      path: path + ".remove",
      action: (arg) => {
        return remove(baseURL + "/" + arg[0]);
      },
    },
    {
      path: path + ".id",
      action: (arg) => {
        return get(baseURL + "/" + arg[0]);
      },
    },
  ];
};

const Api = function () {
  this.arg = [];
  this.add = (data) => {
    this.arg.push(data);
    return this;
  };
  this.run = (action) => {
    Promise.all(
      this.arg.map(async (value) => {
        var find = action.find((v) => v.path === value[0]);
        if (find) {
          var response = await find.action(value.slice(1));
          return {
            data: response.data,
            arg: value,
          };
        }
      })
    )
      .then((val) => {
        val.forEach((v) => {
          console.log("_".repeat(40));
          console.log(">", v.arg[0]);
          console.log(v.data);
        });
      })
      .catch((err) => {
        if (err?.response?.status) {
          console.log("STATUS", "\t".repeat(2), " :", err.response.statusText);
          console.log("CODE", "\t".repeat(2), " :", err.response.status);
          console.log("RESPONSE", "\t".repeat(1), " :", err.response.data);
          console.log("URL", "\t".repeat(2), " :", err.config.url);
        } else {
          console.log("ERROR", "\t".repeat(2), " :", err.message);
        }
        console.log("_".repeat(40));
      });
    return this;
  };
};

/*
	Example:
	deno run --allow-net test/api.js
*/

// register api in here
const api = new Api()
  .add(["user.get"])
  .add([
    "user.post",
    {
      username: "ferdiansyah",
      password: "helloworld",
    },
  ])
  .add([
    "user.update",
    1,
    {
      username: "ferdiansyah",
      password: "helloworld2",
    },
  ])
  .add(["user.id", 1])
  .add(["user.remove", 1])
  .run([...crud("user", "http://localhost:3000/api/users")]);

---
title: Basic CLI
---

# Basic CLI :robot:

This section will explain about the basic commands in using tools-web

Stop the command.

```bash
exit
```

You can run more command on system. Example

```bash
dir
```

Change default root app.

```bash
app myapp
```

Change mode env.

```bash
mode 1
```

Get version of tools-web.

```bash
-v
```

Show value of variable in the class.

```bash
show env
```

Run prettier in the current project

```bash
prettier all
```

## Edit file

```bash
edit
# example result:
# please run: cd C:\Users\ferdi\project\tools-web && vim index
```

## Install the plugin

You can install another plugin or uninstall it.

```bash
install tools-web.codeigniter4
```

```bash
uninstall tools-web.codeigniter4
```

Update the package

```bash
update
```

## Multiple Command

You can run multiple command with bash use option '--cli'

```bash
#!/usr/bin/env bash
twb --cli react make:gcs
twb --cli react make:firebase
```

## Testing API

Creating testing api using deno with CRUD method and can customize.

```bash
test:api user.js
```

After generate code, you can run like this

```bash
deno run --allow-net test/user.js
```

Customize your input data or add API and anything.

```javascript {13-25,29-40}
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
  .add([
    "auth.login",
    {
      email: "example@mail.com",
      password: "helloworld",
    },
  ])

  .add([
    "blog.post",
    {
      title: "hello world",
      description: "hi, I am ferdiansyah",
    },
  ])
  .add([
    "user.update",
    1,
    {
      title: "hello world",
      description: "hi, I am safina sahda",
    },
  ])

  .run([
    ...crud("user", "http://localhost:3000/api/users"),
    ...crud("blog", "http://localhost:3000/api/blog"),
    ...[
      {
        path: "auth.login",
        action: (arg) => {
          return add("http://localhost:3000/api/auth/signin", arg[0]).then(
            (res) => {
              console.log(res.data.token);
              return res;
            }
          );
        },
      },
    ],
  ]);
```

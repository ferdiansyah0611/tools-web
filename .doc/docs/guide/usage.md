---
title: Usage
---

# Usage

Here are some uses of the cli on tools-web.

## React

Basic command:

- **Start command**
  ```bash
  react -h
  ```
- **Create new component**
  ```bash
  react make:component Button
  react make:component Button --ts # typescript format
  react make:component Button --style style # with generate style (css,sass,scss)
  ```
- **Create new route**
  ```bash
  react make:route World /world
  react make:route World /world --ts # typescript format
  react make:route World /world --style style # with generate style (css,sass,scss)
  ```
- **Generate store redux toolkit**
  ```bash
  react make:toolkit users --type reducer
  react make:toolkit users --type async --url http://localhost:8000/api/users
  ```

Integration framework/library command:

```bash
react add:mui
react add:antd
```

## Vue

Basic command:

- **Start command**
  ```bash
  vue -h
  ```
- **Create new component**
  ```bash
  vue make:component Button
  ```
- **Create new route**
  ```bash
  vue make:route World /world
  ```
- **Create new store**
  ```bash
  vue make:store user
  ```

Integration framework/library command:

```bash
vue add:quasar
vue add:vuetify
vue add:antd
vue add:element-plus
```

## TailwindCSS

Basic command:

- **Start command**
  ```bash
  react -h
  ```
- **Add tailwindcss to project**
  ```bash
  tailwind create
  ```

Integration framework/library command:

```bash
tailwind add:daisyui
tailwind add:headlessui
tailwind add:flowbite
```

## Express

Basic command:

- **Start command**
  ```bash
  express -h
  ```
- **Create new project (include unit test)**
  ```bash
  # template choice is "dust", "ejs", "hbs", "hjs", "jade", "pug", "twig"
  # db choice is "mongoose", "sequelize"
  express make:project --template ejs --db mongoose
  ```
- **Create new api**
  ```bash
  express make:api user --db mongoose --col name,email,phone
  ```
- **Create new model**
  ```bash
  express make:model User --db mongoose --col name,email,phone
  ```
- **Run the server on the background**
  ```bash
  express dev
  ```

  ::: warning
  don't be remove on this line at app.js

  ```javascript {1}
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });
  ```

  :::

## Firebase

Basic command:

- **Start command**
  ```bash
  firebase -h
  ```
- **Generate service google cloud storage for backend**
  ```bash
  firebase gcs
  ```
- **Generate initialize firebase, storage & authenticate (v9)**
  ```bash
  firebase init
  ```
- **Generate model firestore**
  ```bash
  firebase make:model user
  ```
- **Generate service storage**
  ```bash
  firebase storage
  ```

## Tools

Basic command:

- **Start command**
  ```bash
  tools -h
  ```
- **Run prettier in the current project**
  ```bash
  tools prettier:all
  ```
- **Commit any files & push to repository**
  ```bash
  tools git:automate origin main
  ```
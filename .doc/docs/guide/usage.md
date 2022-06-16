---
title: Usage
---

# Usage

Here are some uses of the cli on tools-web.
::: tip
Did you know that tools-web can integrate other tools made by developers?
:::

## React

- **Start command**
  ```bash
  react -h
  ```
- **Create new project**
  ```bash
  react make:project
  ```
- **Create new component**
  ```bash
  react make:component Button.jsx sass
  ```
- **Create new route**
  ```bash
  react make:route About.jsx sass about
  ```
- **Installation & configuration for tailwindcss**
  ```bash
  react add:tailwindcss
  ```
- **Install antd library**
  ```bash
  react add:antd
  ```
- **Generate store redux toolkit**
  ```bash
  react make:store users.js async http://localhost:8000/api/users
  react make:store users.js reducer
  ```
- **Generate route crud for store**
  ```bash
  react make:route:crud users
  ```
- **Generate simple crud using redux, include table and form**
  ```bash
  react make:crud:simple User.jsx user sass name,email,password,phone,place,company text,email,password,number,text,text name,email,company,place
  ```
- **Run the server on the background**
  ```bash
  react dev
  ```

## Vue

- **Start command**
  ```bash
  vue -h
  ```
- **Create new project**
  ```bash
  vue make:project
  ```
- **Create new component**
  ```bash
  vue make:component Button.vue
  ```
- **Create new route**
  ```bash
  vue make:route About.vue /about
  ```
- **Installation & configuration for tailwindcss**
  ```bash
  vue add:tailwindcss
  ```
- **Installation & configuration for quasar**
  ```bash
  vue add:quasar
  ```
- **Run the server on the background**
  ```bash
  react run:server
  ```

## Express

- **Start command**
  ```bash
  express -h
  ```
- **Create new project (include unit test)**
  ```bash
  express make:project ejs mongoose
  ```
- **Create new api**
  ```bash
  express make:api user.js mongoose name,email,phone
  ```
- **Create new model**
  ```bash
  express make:model User.js mongoose name,email,phone
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
  firebase make:model user.js
  ```
- **Generate service storage**
  ```bash
  firebase storage
  ```

## Tool

- **Start command**
  ```bash
  tool -h
  ```
- **Run prettier in the current project**
  ```bash
  tool prettier all
  ```
- **Create testing API http using deno**
  ```bash
  tool test:api user.js
  ```
- **Commit any files & push to repository**
  ```bash
  tool git:automate origin main
  ```
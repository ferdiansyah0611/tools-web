---
title: Usage
---

# Usage

Here are some uses of the cli on tools-web.

## Express

Basic command:

- **Start command**
  ```bash
  express -h
  ```
- **Create new project**
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

## Cheatsheet

| Command         | Description                                   | Arguments | Options |
| --------------- | --------------------------------------------- | --------- | ------- |
| make:project    | Create new project                            |           |         |
| server:dev      | Run the server application on the background  |           |         |
| make:model      | Generate model                                | `<name>`  |         |
| make:api        | Generate api                                  | `<name>`  |         |
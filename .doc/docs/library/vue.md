---
title: Usage
---

# Usage

Here are some uses of the cli on tools-web.

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

## Cheatsheet

| Command          | Description                            | Arguments          | Options           |
|------------------|----------------------------------------|--------------------|-------------------|
| add:quasar       | Project integration with Quasar        |                    |                   |
| add:vuetify      | Project integration with Vuetify 3     |                    | --icon `<name>`   |
| add:antd         | Project integration with Ant Design    |                    |                   |
| add:element-plus | Project integration with Element Plus  |                    |                   |
| make:component   | Generate component                     | `<name>`           | --no-hook         |
| make:route       | Generate route pages                   | `<name>` `<url>`   | --no-hook         |
| make:store       | Generate store                         | `<name>`           |                   |
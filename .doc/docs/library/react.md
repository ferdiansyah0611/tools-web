---
title: React
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
  react make:component Button --style sass # with generate style (css,sass,scss)
  ```
- **Create new route**
  ```bash
  react make:route World /world
  react make:route World /world --ts # typescript format
  react make:route World /world --style sass # with generate style (css,sass,scss)
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
react add:styled
react add:recoil
react add:toolkit
react add:route
```

## Cheatsheet

| Command        | Description                                  | Arguments                                    | Options                                                          |
|----------------|----------------------------------------------|----------------------------------------------|------------------------------------------------------------------|
| add:mui        | Project integration with Material UI         |                                              |                                                                  |
| add:antd       | Project integration with Ant Design          |                                              |                                                                  |
| add:styled     | Project integration with Styled Components   |                                              |                                                                  |
| add:recoil     | Project integration with Recoil              |                                              |                                                                  |
| add:toolkit    | Project integration with Redux-Toolkit       |                                              |                                                                  |
| add:route      | Project integration with React Router        |                                              |                                                                  |
| make:component | Generate component                           | `<name>`                                     | --style `(css, sass, scss)`                      |
| make:route     | Generate route pages                         | `<name>` `<url>`                             | --style `(css, sass, scss)`                      |
| make:toolkit   | Generate store redux toolkit                 | `<name>`<br/>--type `(async, reducer)`<br/>--url `<url>` for [async] |                      |
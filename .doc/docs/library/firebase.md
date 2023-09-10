---
title: Usage
---

# Usage

Here are some uses of the cli on tools-web.

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

## Cheatsheet

| Command            | Description                                               | Arguments | Options |
| ------------------ | --------------------------------------------------------- | --------- | ------- |
| gcs                | Generate service google cloud storage for backend         |           |         |
| init               | Generate initialize firebase, storage & authenticate (v9) |           |         |
| make:model         | Generate model firestore                                  | `<name>`  |         |
| storage            | Generate service storage                                  |           |         |
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
	react make:route About.jsx sass
	```
- **Installation & configuration for tailwindcss**
	```bash
	react install:tailwindcss
	```
- **Generate service firebase-storage for upload & remove (v8)**
	```bash
	react make:gcs
	```
- **Generate config firebase (v9)**
	```bash
	react make:firebase
	```
- **Generate model firestore (v9)**
	```bash
	react make:model:firestore user.js
	```
- **Generate route crud for store**
	```bash
	react make:route:crud users
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
	vue make:route About.vue
	```
- **Installation & configuration for tailwindcss**
	```bash
	vue install:tailwindcss
	```
- **Generate service firebase-storage for upload & remove (v8)**
	```bash
	vue make:gcs
	```
- **Generate config firebase (v9)**
	```bash
	vue make:firebase
	```
- **Generate model firestore (v9)**
	```bash
	vue make:model:firestore user.js
	```

## Express
- **Start command**
	```bash
	express -h
	```
- **Create new project**
	```bash
	express make:project ejs
	```
- **Create new api**
	```bash
	express make:api user.js
	```
- **Create new model**
	```bash
	express make:model User.js mongoose
	```
- **Generate google-cloud-storage & storage route API**
	```bash
	express make:gcp
	```
::: warning
don't be remove on this line at app.js
```javascript {1}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
```
:::
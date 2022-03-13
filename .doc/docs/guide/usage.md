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
	node index.js react -h
	```
- **Create new project**
	```bash
	node index.js react --project
	```
- **Create new component**
	```bash
	node index.js react --component=NameComponent.jsx
	```
- **Create new route**
	```bash
	node index.js react --route=About.jsx
	```
- **Installation & configuration for tailwindcss**
	```bash
	node index.js react --tailwindcss
	```
- **Generate service firebase-storage for upload & remove (v8)**
	```bash
	node index.js react --firebase-storage
	```
- **Generate config firebase (v9)**
	```bash
	node index.js react --init-firebase
	```
- **Generate model firestore (v9)**
	```bash
	node index.js react --model-firestore=user.js
	```
- **Generate route crud for store**
	```bash
	node index.js react --route-crud-store
	```
## Vue
- **Start command**
	```bash
	node index.js vue -h
	```
- **Create new project**
	```bash
	node index.js vue --project
	```
- **Create new component**
	```bash
	node index.js vue --component=NameComponent.jsx
	```
- **Create new route**
	```bash
	node index.js vue --route=About.jsx
	```
- **Installation & configuration for tailwindcss**
	```bash
	node index.js vue --tailwindcss
	```
- **Generate service firebase-storage for upload & remove (v8)**
	```bash
	node index.js vue --firebase-storage
	```
- **Generate config firebase (v9)**
	```bash
	node index.js vue --init-firebase
	```
- **Generate model firestore (v9)**
	```bash
	node index.js vue --model-firestore=user.js
	```

## Express
- **Start command**
	```bash
	node index.js express -h
	```
- **Create new project**
	```bash
	node index.js express --project
	```
- **Create new api**
	```bash
	node index.js express --api=user.js
	```
- **Create new model**
	```bash
	node index.js express --model=User.js;mongoose
	```
- **Generate google-cloud-storage & storage route API**
	```bash
	node index.js express --google-cloud-storage
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
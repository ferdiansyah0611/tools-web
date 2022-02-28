---
title: Usage
---
# Usage
Here are some uses of the cli on web-tools.
::: tip
Did you know that web-tools can integrate other tools made by developers?
:::
## React
- **Start command**
	```bash
	node index.js react -h
	```
- **Create new project**
	```bash
	node index.js react myapp --project
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
	node index.js vue myapp --project
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

## Express
- **Start command**
	```bash
	node index.js express -h
	```
- **Create new project**
	```bash
	node index.js express myapp --project
	```
- **Create new component**
	```bash
	node index.js express --component=NameComponent.jsx
	```
- **Create new model**
	```bash
	node index.js express --model=User.js;mongoose
	```
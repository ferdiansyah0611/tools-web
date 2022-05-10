---
title: What is tools-web
---
# What is tools-web
tools-web is a tool to speed up developing a website using the cli. Such as making new project, components, state management, routes, model, and others.
Not only to speed things up but also to meet the deadline for a website project because you don't have to type from scratch again.
# Why use tools-web?
Have you ever created a project with the same library or framework and it made you bored to type it over and over again? I'm give you example code
```jsx
import './index.css'
import React from 'react'
import {
	BrowserRouter, Routes, Route
} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import Template from '@component/template'
import Home from './Home'
import About from './About'
import store from './store'

function App(){
	React.useEffect(() => {
		console.log('mounted')
	}, [])
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Template/>}>
					<Route index element={<Home/>}/>
					<Route path="about" element={<About/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

```
The analogy is that if you are a frontend developer, you are familiar with the code above. working on several projects and you get tired of writing them again or setup them so the idea came up to make web-tools. Can be used for frontend and backend development. You could say a starter or boilerplate but there are more features than that.
# Feature :tada:
- Installation project
- Component
- Configuration tailwindcss
- Store (Redux Toolkit, Vuex)
- Models (Mongoose, Sequelize)
- Routes
- API
- Middleware
- Authentication
- Firebase Storage
- Firebase Firestore
# Contributor
![gaa](https://avatars.githubusercontent.com/u/47508140?v=4)
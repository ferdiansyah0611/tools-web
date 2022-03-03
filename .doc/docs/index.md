---
title: What is tools-web
---
# What is tools-web
tools-web is a tool to speed up developing a website using the cli. Such as making new project, components, state management, routes, model, and others.
Not only to speed things up but also to meet the deadline for a website project because you don't have to type from scratch again.
# Why use tools-web?
Have you ever created a project with the same library or framework and it made you bored to type it over and over again? I'm give you example code
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const User = new Schema({
	name: String,
	password: String,
	createdAt: { type: Date, default: Date.now }
})

const models = mongoose.model('User', User)
module.exports = models
```
The analogy is that if you are a backend developer, you are familiar with the code above. working on several projects and you get tired of writing them again so the idea arises to make tools-web. Can be used for both frontend and backend development
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
---
title: Create Plugin
---
# Create Plugin
Step by step to create the plugin to integrate tools-web.
- **Step 1:** create function
	```javascript
	const App = function(sh){
		this.name = "app"
		// action command
		this.action = [
			{
				name: 'test',
				action: () => {
					sh.log('test done.')
				}
			},
			{
				name: 'create',
				action: () => {
					sh.log('exec create')
					// if you want get arg value "App.jsx" at --create=App.jsx
					sh.log('argument value:', sh.options.name)
				}
			}
		]
		// options on help command
		this.help = (log) => {
			log('--project', ':= Create new project app using vite')
		}
	}
	```
- **Step 2:** call function use
	```javascript
	sh.use(App)
	```
- **Step 3:** run command
	```bash
	node index.js app -h
	node index.js app --test
	```
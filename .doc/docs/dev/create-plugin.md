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
					console.log('done.')
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
- **Step 3** run command
	```bash
	node index.js app -h
	node index.js app --test
	```
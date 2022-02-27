## react-router-toolkit-starter
Starter for react, react-router-dom, and @reduxjs/toolkit. With shell to generate create component, route, style, library, and store with CRUD createAsyncThunk.
### Installation
```bash
git clone https://github.com/ferdiansyah0611/react-router-toolkit-starter.git
```
```bash
cd react-router-toolkit-starter && npm i
```
### Shell
Start shell
```bash
node shell.js
# output
# [0] create component
# [1] create route pages
# [2] create store
# [3] setup for tailwindcss with sass
# [4] generate firebase storage upload & remove (v8)
# [5] generate route crud for store
# Choose one : 
# Name file : (yourfile.{jsx,js,tsx})
```
### Path resolve
```javascript
// ./src directory
import '@/index.css'
// component
import YourComponent from '@c/YourComponent'
// route
import YourRoute from '@r/YourRoute'
// store
import YourStore from '@s/YourStore'
// style
import YourStyle from '@style/YourStyle'

```
### Customize
You can customize for generate in folder '__shell' like a route, style, and more.
### Add shell in the existing project? Yes you can
NOT CD IN YOUR PROJECT!
- Clone
```bash
git clone https://github.com/ferdiansyah0611/react-router-toolkit-starter.git
```
- cd root clone
```bash
cd react-router-toolkit-starter
```
 - Remove all folder except shell.js and folder _shell
- Copy and paste to your existing project
### Start server in all ip
```bash
npm run dev:all
```
### Build and deploy to firebase
```bash
npm run build:firebase
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

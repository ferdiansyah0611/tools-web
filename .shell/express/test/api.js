const fs = require('fs')
const fetch = (...args) => import('node-fetch')
	.then(({default: fetch}) => fetch(...args)
	.then(res => {
		if(res.ok){
			return res.json()
		}
		return{
			error: res.statusText
		}
	}))

const base = 'http://localhost:8000/api/'
const string = (data) => JSON.stringify(data)

const arg = process.argv.slice(2)
const headers = {
	'Content-Type': 'application/json',
}

const get = (url) => fetch(url, {
	headers,
})
const add = (url, data) => fetch(url, {
	headers,
	method: 'post',
	body: string(data)
})
const update = (url, data) => fetch(url, {
	headers,
	method: 'patch',
	body: string(data)
})
const remove = (url) => fetch(url, {
	headers,
	method: 'delete',
})

const crud = (path, baseURL, option) => {
	return[
		{
			path: path + '.get',
			action: () => {
				return get(baseURL)
			}
		},
		{
			path: path + '.add',
			action: () => {
				return add(baseURL, option.add)
			}
		},
		{
			path: path + '.update',
			action: () => {
				return update(baseURL + '/' + arg[1], option.update)
			}
		},
		{
			path: path + '.remove',
			action: () => {
				return remove(baseURL + '/' + arg[1])
			}
		},
		{
			path: path + '.id',
			action: () => {
				return get(baseURL + '/' + arg[1])
			}
		}
	]
}


const run = (action) => {
	var response
	arg.map(async(value) => {
		var find = action.find((v) => v.path === value)
		if(find){
			console.log('path: ', value)
			response = await find.action(value)
			console.log('response: ', response)
		}
	})
}
/*
	Example:
	node test/api.js user.get
	node test/api.js user.add
	node test/api.js user.update yourid
	node test/api.js user.remove yourid
	node test/api.js user.id yourid
*/
// register api in here
run([
	...crud('user', base + 'user', {
		// data on add
		add: {

		},
		// data on update
		update: {

		}
	}),
])
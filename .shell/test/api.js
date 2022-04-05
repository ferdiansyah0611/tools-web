import axiod from "https://deno.land/x/axiod/mod.ts";

const arg = Deno.args
const headers = {
	'Content-Type': 'application/json',
}

// method
const get = (url) => axiod.get(url, {
	headers,
})
const add = (url, data) => axiod.post(url, {
	headers,
	data: string(data)
})
const update = (url, data) => axiod.patch(url, {
	headers,
	data: string(data)
})
const remove = (url) => axiod.delete(url, {
	headers,
})

// CRUD API
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
		try{
			var find = action.find((v) => v.path === value)
			if(find){
				console.log('PATH :', value)
				response = await find.action(value)
				console.log('RESPONSE :')
				console.log(response.data)
			}
		} catch(err) {
			console.log("ERROR :", err.message)
		}
	})
}

/*
	Example:
	deno run --allow-net test/api.js user.get
	deno run --allow-net test/api.js user.add
	deno run --allow-net test/api.js user.update yourid
	deno run --allow-net test/api.js user.remove yourid
	deno run --allow-net test/api.js user.id yourid
*/

// register api in here
run([
	...crud('user','http://localhost:3000/api/users', {
		// data on add
		add: {

		},
		// data on update
		update: {

		}
	})
])
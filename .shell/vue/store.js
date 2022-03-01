const ID = 'id'

export default {
	namespaced: true,
	state(){
		return{
			name: "store",
			data: [],
			find: {}
		}
	},
	action: {},
	mutations: {
		example(state){
			state.name = "caseName"
		},
		reset(state, payload){
			state.data = payload || []
		},
		create(state, payload){
			state.data.push(payload)
		},
		findOne(state, payload){
			state.find = state.data.find((e) => e[ID] === payload) || {}
		},
		update(state, payload){
			state.data = state.data.map(e => {
    			if(e[ID] === payload[ID]){
    				e = Object.assign(e, payload)
    			}
    			return e
    		})
		},
		remove(){
			state.data = state.data.filter(e => e[ID] !== payload)
		}
	},
	getters: {}
}
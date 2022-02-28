export default {
	namespaced: true,
	state(){
		return{
			name: "store"
		}
	},
	action: {},
	mutations: {
		example(state){
			state.name = "caseName"
		}
	},
	getters: {}
}
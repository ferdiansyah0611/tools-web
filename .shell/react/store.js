import { createSlice } from '@reduxjs/toolkit'

var initialState = {
	name: 'namestore'
}

export const appSlice = createSlice({
	name: 'namestore',
	initialState,
	reducers: {
		handle(state, action){
			state[action.payload.name] = action.payload.value
		}
	},
	extraReducers: {},
})
export const {handle} = appSlice.actions

export default appSlice.reducer
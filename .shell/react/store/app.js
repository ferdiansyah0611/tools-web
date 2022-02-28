import { createSlice } from '@reduxjs/toolkit'

var initialState = {
	name: 'react-router-toolkit-starter'
}

export const appSlice = createSlice({
	name: 'app',
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
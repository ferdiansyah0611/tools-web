import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import http from '@service/http'
// CONFIG
const BASE = 'BASEURL'
const ID = 'id'

var initialState = {
	name: 'caseName',
	data: []
}

export const caseNameGet = createAsyncThunk('caseName/get', async() => {
	var response = await http(BASE)
	return response.data
})
export const caseNameGetId = createAsyncThunk('caseName/get/id', async() => {
	var response = await http(BASE)
	return response.data
})
export const caseNameAdd = createAsyncThunk('caseName/add', async(body) => {
	var response = await http(BASE, {
		method: 'POST',
		data: body,
	})
	return response.data
})
export const caseNameUpdate = createAsyncThunk('caseName/update', async(body) => {
	var response = await http(BASE + '/' + body[ID], {
		data: body,
	})
	return Object.assign(response.data, {id: body[ID]})
})
export const caseNameDelete = createAsyncThunk('caseName/delete', async(body) => {
	var response = await http(BASE + '/' + body[ID], {
		method: 'DELETE',
	})
	return Object.assign(response.data, {id: body[ID]})
})

export const caseNameSlice = createSlice({
	name: 'caseName',
	initialState,
	reducers: {
		handle(state, action){
			state[action.payload.name] = action.payload.value
		}
	},
	extraReducers: {
    	[caseNameGet.fulfilled]: (state, action) => {
    		state.data = action.payload
    	},
    	[caseNameGetId.fulfilled]: (state, action) => {
    		// state.show = action.payload
    	},
    	[caseNameAdd.fulfilled]: (state, action) => {
    		state.data.push(action.payload)
    	},
    	[caseNameUpdate.fulfilled]: (state, action) => {
    		state.data = state.data.map(value => {
    			if(value[ID] === action.payload[ID]){
    				value = Object.assign(value, action.payload)
    			}
    			return value
    		})
    	},
    	[caseNameDelete.fulfilled]: (state, action) => {
    		state.data = state.data.filter(value => value[ID] !== action.payload[ID])
    	},
  	},
})
export const {handle} = caseNameSlice.actions

export default caseNameSlice.reducer
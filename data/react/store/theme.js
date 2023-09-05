import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    handle: (state, action) => {
    	if(action.payload){
    		state.theme = action.payload
    	}else{
    		state.theme = state.theme === 'light' ? 'dark': 'light'
    	}
    },
  },
})

export const { handle } = themeSlice.actions

export default themeSlice.reducer
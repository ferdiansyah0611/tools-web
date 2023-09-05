import { createSlice } from "@reduxjs/toolkit";

var initialState = {
  name: "$name",
};

export const $nameSlice = createSlice({
  name: "$name",
  initialState,
  reducers: {
    handle(state, action) {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: {},
});
export const { handle } = $nameSlice.actions;

export default $nameSlice.reducer;

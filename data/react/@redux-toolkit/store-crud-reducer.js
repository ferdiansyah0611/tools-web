import { createSlice } from "@reduxjs/toolkit";

const ID = "id";

var initialState = {
  name: "$name",
  data: [],
  paginate: [],
  find: {},
};

export const $nameSlice = createSlice({
  name: "$name",
  initialState,
  reducers: {
    paginate$reducer(state, action) {
      const { offset, limit, data } = action.payload;
      state.paginate = (data || state.data).slice(
        (offset - 1) * limit,
        offset * limit
      );
    },
    handle$reducer(state, action) {
      state[action.payload.name] = action.payload.value;
    },
    reset$reducer(state, action) {
      state.data = action.payload || [];
    },
    create$reducer(state, action) {
      state.data.push(action.payload);
    },
    findOne$reducer(state, action) {
      state.find = state.data.find((e) => e[ID] === action.payload) || {};
    },
    update$reducer(state, action) {
      state.data = state.data.map((e) => {
        if (e[ID] === action.payload[ID]) {
          e = Object.assign(e, action.payload);
        }
        return e;
      });
    },
    remove$reducer(state, action) {
      state.data = state.data.filter((e) => e[ID] !== action.payload);
    },
  },
  extraReducers: {},
});

// import
export const {
  paginate$reducer,
  handle$reducer,
  reset$reducer,
  create$reducer,
  findOne$reducer,
  update$reducer,
  remove$reducer,
} = $nameSlice.actions;

export default $nameSlice.reducer;

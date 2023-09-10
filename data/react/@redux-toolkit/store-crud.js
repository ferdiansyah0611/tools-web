import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "@service/http";
// CONFIG
const BASE = "$url";
const ID = "id";

var initialState = {
  name: "$name",
  data: [],
};

export const $nameGet = createAsyncThunk("$name/get", async () => {
  var response = await http(BASE);
  return response.data;
});
export const $nameGetId = createAsyncThunk("$name/get/id", async () => {
  var response = await http(BASE);
  return response.data;
});
export const $nameAdd = createAsyncThunk("$name/add", async (body) => {
  var response = await http(BASE, {
    method: "POST",
    data: body,
  });
  return response.data;
});
export const $nameUpdate = createAsyncThunk(
  "$name/update",
  async (body) => {
    var response = await http(BASE + "/" + body[ID], {
      data: body,
    });
    return Object.assign(response.data, { id: body[ID] });
  }
);
export const $nameDelete = createAsyncThunk(
  "$name/delete",
  async (body) => {
    var response = await http(BASE + "/" + body[ID], {
      method: "DELETE",
    });
    return Object.assign(response.data, { id: body[ID] });
  }
);

export const $nameSlice = createSlice({
  name: "$name",
  initialState,
  reducers: {
    handle(state, action) {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: {
    [$nameGet.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [$nameGetId.fulfilled]: (state, action) => {
      // state.show = action.payload
    },
    [$nameAdd.fulfilled]: (state, action) => {
      state.data.push(action.payload);
    },
    [$nameUpdate.fulfilled]: (state, action) => {
      state.data = state.data.map((value) => {
        if (value[ID] === action.payload[ID]) {
          value = Object.assign(value, action.payload);
        }
        return value;
      });
    },
    [$nameDelete.fulfilled]: (state, action) => {
      state.data = state.data.filter(
        (value) => value[ID] !== action.payload[ID]
      );
    },
  },
});
export const { handle } = $nameSlice.actions;

export default $nameSlice.reducer;

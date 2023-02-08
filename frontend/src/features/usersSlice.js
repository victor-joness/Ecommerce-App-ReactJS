import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
  list: [],
  status: null,
  deleteStatus: null,
};

export const usersFetch = createAsyncThunk("users/usersFetch", async () => {
  try {
    const response = await axios.get(`${url}/users`, setHeaders());

    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const usersDelete = createAsyncThunk("users/usersDelete", async (id) => {
  try {
    const response = await axios.delete(`${url}/users/delete/${id}`, setHeaders());
    return response?.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data, {position:"bottom-left"});
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [usersFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [usersFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.list = action.payload;
    },
    [usersFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [usersDelete.pending]: (state, action) => {
      state.deleteStatus = "pending";
    },
    [usersDelete.fulfilled]: (state, action) => {
      const newList = state.list.filter(
        (user) => user._id !== action.payload._id
      );
      state.list = newList;

      state.deleteStatus = "success";
      toast.error("User Deletado", { position: "bottom-left" });
    },
    [usersDelete.rejected]: (state, action) => {
      state.deleteStatus = "rejected";
    },
  },
});

export default usersSlice.reducer;
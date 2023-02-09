import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";

const initialState = {
  list: [],
  status: null,
};

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
  try {
    const response = await axios.get(`${url}/orders`, setHeaders());
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const ordersUpdate = createAsyncThunk(
  "orders/ordersUpdate",
  async (values, { getState }) => {
    const state = getState();

    let currentOrder = state.orders.list.filter(
      (order) => order._id === values.id
    );

    const newOrder = {
      ...currentOrder[0],
      delivery_status: values.delivery_status,
    };

    try {
      const response = await axios.put(
        `${url}/orders/${values.id}`,
        newOrder,
        setHeaders()
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: {
    [ordersFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [ordersFetch.fulfilled]: (state, action) => {
      state.list = action.payload;
      state.status = "success";
    },
    [ordersFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [ordersUpdate.pending]: (state, action) => {
      state.status = "pending";
    },
    [ordersUpdate.fulfilled]: (state, action) => {
      const updateOrders = state.list.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );

      state.list = updateOrders;
      state.status = "success";
    },
    [ordersUpdate.rejected]: (state, action) => {
      state.status = "rejected";
    },
  },
});

export default ordersSlice.reducer;

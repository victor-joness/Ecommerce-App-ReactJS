import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import productReducer, { productsFetch } from "./features/productSlice";
import { productsAPI } from "./features/productsAPI";
import cartReducer, { getTotals } from "./features/cartSlice";
import authReducer, { loadUser } from "./features/authSlice";
import ordersReducer from "./features/ordersSlice";
import usersReducer from "./features/usersSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    orders: ordersReducer,
    users: usersReducer,
    cart: cartReducer,
    auth: authReducer,
    [productsAPI.reducerPath] : productsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(productsAPI.middleware);
  }
});

store.dispatch(productsFetch());
store.dispatch(getTotals());
store.dispatch(loadUser(null))

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
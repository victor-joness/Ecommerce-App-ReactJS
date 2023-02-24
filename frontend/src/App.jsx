import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

//biblioteca de modal
import { ToastContainer } from "react-toastify";

import Cart from "./Components/Cart/Cart";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import NotFound from "./Components/NotFound/NotFound";
import Register from "./Components/auth/register/Register";
import Login from "./Components/auth/login/Login";
import CheckoutSuccess from "./Components/CheckoutSuccess/CheckoutSuccess";
import Dashboard from "./Components/admin/Dashboard/Dashboard";
import Products from "./Components/admin/Products/Products";
import Summary from "./Components/admin/Summary/Summary";
import CreateProduct from "./Components/admin/CreateProduct/CreateProduct";
import ProductList from "./Components/admin/list/ProductList/ProductList";
import Users from "./Components/admin/Users/Users";
import Orders from "./Components/admin/Orders/Orders";
import Product from "./Components/Details/Product/Product";
import UserProfile from "./Components/Details/UserProfile/UserProfile";
import Order from "./Components/Details/Order/Order";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/admin" element={<Dashboard />}>
              <Route path="products" element={<Products />}>
                <Route index element={<ProductList />} />
                <Route path="create-product" element={<CreateProduct />} />
              </Route>
              <Route path="summary" element={<Summary />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

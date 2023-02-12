import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import {
  removeFromCart,
  decreaseCart,
  increaseCart,
  clearCart,
  getTotals,
} from "../../features/cartSlice";

import { Link, useNavigate } from "react-router-dom";

import "./Cart.css";
import authSlice from "../../features/authSlice";
import PayButton from "../PayButton/PayButton";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => {
    return state.cart;
  });

  const auth = useSelector((state) => {
    return state.auth;
  }); 

  //cada vez que o cart mudar, ele vai execultar o dispatch do getTotals fazendo com que o valor seja atualizado.
  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleRemoveToCart = (cartItem) => {
    dispatch(removeFromCart(cartItem));
  };

  const handleDecreaseToCart = (cartItem) => {
    dispatch(decreaseCart(cartItem));
  };

  const handleIncreaseToCart = (cartItem) => {
    dispatch(increaseCart(cartItem));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cart?.cartItems.length === 0 ? (
        <div className="cart-vazio">
          <p>Seu carrinho está vazio</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>

          <div className="cart-items">
            {cart.cartItems.map((cartItem) => (
              <div className="cart-item" key={cartItem._id}>
                <div className="cart-product">
                  <img src={cartItem.img.url} alt={cartItem.name}></img>
                  <div>
                    <h3>{cartItem.name}</h3>
                    <p>{cartItem.desc}</p>
                    <button onClick={() => handleRemoveToCart(cartItem)}>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-product-price">${cartItem.price}</div>
                <div className="cart-product-quantity">
                  <button onClick={() => handleDecreaseToCart(cartItem)}>
                    -
                  </button>
                  <div className="count">{cartItem.cartQuantity}</div>
                  <button onClick={() => handleIncreaseToCart(cartItem)}>
                    +
                  </button>
                </div>
                <div className="cart-product-total-price">
                  ${cartItem.price * cartItem.cartQuantity}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <button className="clear-cart" onClick={() => handleClearCart()}>
              Clear Cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount">${cart.cartTotalAmount}</span>
              </div>
              <p>taxes and shipping calculated at checkout</p>
              {auth._id ? (
                <PayButton cartItems={cart.cartItems}></PayButton>
              ) : (
                <button className="cart-login" onClick={() => navigate("/login")}>Login to Check out</button>
              )}

              <div className="continue-shopping">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

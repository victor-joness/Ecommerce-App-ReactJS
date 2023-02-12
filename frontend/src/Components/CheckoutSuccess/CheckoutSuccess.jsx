import React from 'react';
import "./CheckoutSuccess.css";
import { useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearCart, getTotals} from "../../features/cartSlice";


const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  
  useEffect(() => {
    dispatch(clearCart());
  },[dispatch]);

  useEffect(() => {
    dispatch(getTotals());
  },[dispatch, cart]);


  return (
    <div className='container'>
      <h2>CheckOut Com Sucesso</h2>
      <p>Your order might take some time to process.</p>
      <p>Check your order Status at your profile after about 10mins</p>
      <p><strong>victorjonesmesquits@gmail.com</strong></p>
    </div>
  )
}

export default CheckoutSuccess;
import axios from "axios";
import { useSelector } from "react-redux";
import { url } from "../../features/api";

import React from "react";

const PayButton = ({ cartItems }) => {
  const user = useSelector((state) => state.auth);

  const handleCheckOut = () => {
    // url/stripe é o endpoint, dentro do endpoint tem um sub-endpoint que é a criação de um checkout
    axios.post(`${url}/stripe/create-checkout-session`, {
      cartItems,
      userId: user._id,
    }).then((res) => {
        if(res.data.url){
            window.location.href = res.data.url;
        } 
    }).catch((err) => console.log(err.message));
  };

  return (
    <>
      <button onClick={handleCheckOut}>Check Out</button>
    </>
  );
};

export default PayButton;

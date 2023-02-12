import React, { useEffect, useState } from "react";
import "./Order.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setHeaders, url } from "../../../features/api";

const Order = () => {
  const params = useParams();

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/orders/findOne/${params.id}`,
          setHeaders()
        );
        console.log(res.data);
        setOrder(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrder();
  }, [params.id]);

  return (
    <div className="order">
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="orderContainer">
            <h2>Order Details</h2>
            <p>
              Delivery Status:{" "}
              {order.delivery_status === "pending" ? (
                <button className="pending">Pending</button>
              ) : order.delivery_status === "dispatched" ? (
                <button className="dispatched">Dispatched</button>
              ) : order.delivery_status === "delivered" ? (
                <button className="delivered">Delivered</button>
              ) : (
                "Error"
              )}
            </p>

            <h3>Ordered Product</h3>
            <div className="items">
              <div className="item-navbar">
                <span>Name</span>
                <span>|</span>
                <span>Quantidade</span>
                <span>|</span>
                <span>Preço</span>
              </div>

              {order.products?.map((product, index) => (
                <div className="item" key={index}>
                  <span><li>{product.description}</li></span>
                  <span>|</span>
                  <span>{product.quantity}</span>
                  <span>|</span>
                  <span>{"$" + (product.amount_subtotal / 100).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div>
              <h3>Total price</h3>
              <p>{"$" + (order.total /100).toLocaleString()} (Incluindo taxa de entrega)</p>
            </div>
            <div>
              <h3>Shipping Details</h3>
              <p>Customer: {order.shipping?.name}</p>
              <p>City: {order.shipping?.address.city}</p>
              <p>Email: {order.shipping?.email}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Order;

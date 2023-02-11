import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "./Product.css";
import { setHeaders, url } from "../../../features/api";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/cartSlice";

const Product = () => {
  const params = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  //requisição products pelo id
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get(
          `${url}/products/find/${params.id}`,
          setHeaders()
        );

        setProduct(res.data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <div className="Product">
      <div className="ProductContainer">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <div className="ImageContainer">
              <img src={product.img?.url} alt="Product image" />
            </div>

            <div className="ProductDetails">
              <h3>{product.name}</h3>
              <p><span>Brand:</span> {product.brand}</p>
              <p><span>descrição:</span> {product.desc}</p>
              <div className="price">
                ${product.price?.toLocaleString()}
              </div>
              <button className="product-add-to-cart" onClick={() => handleAddToCart(product)}>Add to cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Product;

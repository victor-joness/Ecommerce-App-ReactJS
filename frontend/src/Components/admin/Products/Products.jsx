import { Outlet, useNavigate } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="admin-header">
        Products
        <button
          className="primary-button"
          onClick={() => navigate("/admin/products/create-product")}
        >
          Create
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default Products;

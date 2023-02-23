import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css";
import { useSelector } from "react-redux";
import { FaUsers, FaStore, FaClipboard, FaTachometerAlt } from "react-icons/fa";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAdmin) return <p>Acesso Negado</p>;

  return (
    <div className="Dashboard">
      <div className="SideNav">
        <h3>Quick Links</h3>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/summary"
        >
          <FaTachometerAlt/> Summary
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/products"
        >
          <FaStore/> Products
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/orders"
        >
          <FaClipboard/> Orders
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/users"
        >
          <FaUsers/> Users
        </NavLink>
        
      </div>

      <div className="Content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

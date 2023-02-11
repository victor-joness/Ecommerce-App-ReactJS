import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import axios from "axios";
import { setHeaders, url } from "../../../features/api";
import { useParams } from "react-router-dom";
import {toast} from "react-toastify";

const UserProfile = () => {
  const params = useParams();

  const [user, setUser] = useState({
    name: "",
    email: "",
    isAdmin: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${url}/users/find/${params.id}`,
          setHeaders()
        );

        setUser({ ...res.data, password: "" });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
    setLoading(false);
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`${url}/users/${params.id}`, {...user}, setHeaders());

      setUser({...res.data, password:""});
      toast.success("Perfil Atualizado", {position: "bottom-left"});
    
    } catch (error) {
      console.log(error);
    }

    setUpdating(false);
  }

  return (
    <div className="profile">
      <div className="profileContainer">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>User Profile</h3>
            {user.isAdmin ? (
              <div className="admin">Admin</div>
            ) : (
              <div className="customer">Customer</div>
            )}
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})}/>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}/>
            <label htmlFor="password">Senha:</label>
            <input type="text" id="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})}/>
            <button>{updating ? "Updating" : "Update Profile"}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

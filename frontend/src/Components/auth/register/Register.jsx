import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../features/authSlice";
import "./register.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  console.log(auth);

  useEffect(() => {
    if(auth._id){
      navigate("/cart")
    }
  }, [auth._id, navigate]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    senha: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser(user));
  };

  return (
    <>
      <form className="form-register" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setUser({ ...user, senha: e.target.value })}
        />
        
        {auth.registerStatus === "pending" ? <button>Carregando</button> : <button>Register</button>}
        {auth.registerStatus === "rejected" ? (
          <p>{auth.registerError}</p>
        ) : null}
      </form>
    </>
  );
}

export default Register;

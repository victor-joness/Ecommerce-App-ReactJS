import React, { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/authSlice";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if(auth._id){
      navigate("/")
    }
  }, [auth._id, navigate]);

  const [user, setUser] = useState({
    email: "",
    senha: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(user));
  };

  return (
    <>
      <form className="form-login" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        
        {auth.loginStatus === "pending" ? <button>Carregando</button> : <button>Login</button>}
        {auth.loginStatus === "rejected" ? (
          <p>{auth.loginError}</p>
        ) : null}
      </form>
    </>
  );
}

export default Login;

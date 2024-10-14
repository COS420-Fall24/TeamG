import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css'; 

const Login = ({ authorized_true }) => {
  const [username, set_username] = useState("");
  const [password, set_pw] = useState("");
  const navigate = useNavigate();

  const handle_login = () => {
    // admin/admin is the only working combo, TODO: update it when database is up
    if (username === "admin" && password === "admin") {
      authorized_true(true);
      navigate("/homepage");
    } else {
      alert("Username or password invalid"); // Give user pop up if authentication fails
    }
  };

  return (
    <div className="login-container">
      <div className="title">MONEY GREMLIN</div>
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => set_username(e.target.value)}
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => set_pw(e.target.value)}
        />
        <button className="login-button" onClick={handle_login}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

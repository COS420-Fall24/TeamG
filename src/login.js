import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ authorized_true }) => {
    const [username, set_username] = useState("");
    const [password, set_pw] = useState("");
    const navigate = useNavigate();

    const handle_login = () => {
        if (username === "user" && password === "password") {
            authorized_true(true);
            navigate("/dashboard");
        } else {
            alert("Username or password invalid");
        }
    };

    return (
        <div>
        <h2>Login</h2>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => set_username(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => set_pw(e.target.value)}
        />
        <button onClick={handle_login}>Login</button>
        </div>
        );
    };

export default Login;
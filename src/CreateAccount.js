import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css'; 

const CreateAccount = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleCreateAccount = () => {
      alert("Account created. Please log in.");
      navigate("/"); // Redirect back to login page
    };
  
    return (
      <div className="login-container">
        <div className="title">Create Account</div>
        <div className="login-box">
          <h2>Sign Up</h2>
          <input
            type="text"
            className="login-input"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="login-input"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            className="login-input"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
           <input
            type="text"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            className="login-input"
            placeholder="New Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleCreateAccount}>
            Create Account
          </button>
        </div>
      </div>
    );
  };
  
  export default CreateAccount;
  
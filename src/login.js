import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { auth } from "./firebase-config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "./firebase-config"; // Import Firestore instance
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

const Login = ({ authorized_true }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle manual login
  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      authorized_true(true);
      navigate('/homepage');
    } else {
      alert('Invalid credentials');
    }
  };

  // Handle successful Google login
  const handleGoogleSuccess = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        createdAt: new Date(),
      });

      console.log('Google login successful:', user);
      authorized_true(true);
      navigate('/homepage');
    } catch (error) {
      handleGoogleFailure(); // Call the failure handler
    }
  };

  // Handle Google login failure
  const handleGoogleFailure = () => {
    console.log('Google login failed');
    alert('Google Login Failed');
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
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <p className="signup-text">
          Don't have an account yet?{' '}
          <button
            className="signup-button"
            onClick={() => navigate('/create-account')}
          >
            Click Here
          </button>
        <div style={{ marginTop: '15px' }}>Or</div>
        </p>
        <button className="google-login-button" onClick={handleGoogleSuccess}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

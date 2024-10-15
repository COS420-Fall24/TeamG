import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Correct import
import './login.css'; 

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
  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login successful:', credentialResponse);
    authorized_true(true);
    navigate('/homepage'); // Navigate to homepage on success
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
        <GoogleLogin
          onSuccess={handleGoogleSuccess} // Reference the correct function
          onError={handleGoogleFailure} // Handle login failure
        />
      </div>
    </div>
  );
};

export default Login;

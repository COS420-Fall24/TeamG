import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase-config"; // Import Firestore instance
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

const Login = ({ authorized_true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();


// Handle manual login
const handleLogin = async () => {
  signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          console.log("Logged in as:", user.email);
          authorized_true(true);
          setEmail("");
          setPassword("");
          navigate('/homepage');
      })
      .catch((error) => {
          if (error.code === 'auth/wrong-password') {
              alert("Incorrect password.");
          } else if (error.code === 'auth/user-not-found') {
              alert("No account associated with this email.");
          } else if (error.code === 'auth/invalid-email') {
              alert("Please enter a valid email address.");
          } else {
              alert("Login failed.");
          }
          console.error('Login error:', error.message);
      });
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        </p>
        <div style={{ marginTop: '15px' }}>Or</div>
        <button className="google-login-button" onClick={handleGoogleSuccess}>
        Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

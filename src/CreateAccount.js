import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  // Handle manual account creation
  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log('Signed up as:', user.email);
      alert("New account created! Welcome to the Gremlin Money Club");

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        tutorial: true
      });

      // Clear inputs
      setEmail("");
      setPassword("");
      navigate("/"); 
    })
    .catch((error) => {
      console.error('Sign up error:', error.message);

      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered");
      } else if (error.code === 'auth/weak-password') {
        alert("Password must be at least 6 characters");
      } else {
        alert("Error creating account. Please try again.");
      }
    });
  };

  return (
    <div className="login-container">
    <div className="title">Create Account</div>
    <div className="login-box">
      <h2>Sign Up</h2>
      <input
      type="text"
      id="email"
      className="login-input"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />
      <input
      type="password"
      id="password"
      className="login-input"
      placeholder="Password (6+ characters)"
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

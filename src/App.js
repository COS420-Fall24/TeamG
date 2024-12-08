// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './login';
import Homepage from './pages/Homepage'; // Updated import path
import CreateAccount from './CreateAccount';
import Logout from './logout';

const GOOGLE_CLIENT_ID = '766737585066-4fqae74ec3k614ja384b2i50uehbr3io.apps.googleusercontent.com';

function App() {
  const [is_authenticated, authorized_true] = useState(false);
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<Login authorized_true={authorized_true} />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/homepage" element={<Homepage />} /> {/* Removed authentication check temporarily */}
        <Route path="/logout" element={<Logout authorized_true={authorized_true} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;


/*
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import Login from './login'; 
import Homepage from './homepage'; 
import CreateAccount from './CreateAccount'; 
import Logout from './logout';



// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '766737585066-4fqae74ec3k614ja384b2i50uehbr3io.apps.googleusercontent.com';

function App() {
  const [is_authenticated, authorized_true] = useState(false); // State to track authentication
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Routes>
          <Route 
            path="/" 
            element={<Login authorized_true={authorized_true} />} 
          />
          <Route 
            path="/create-account" 
            element={<CreateAccount />} 
          />
          <Route 
            path="/homepage" 
            element={is_authenticated ? <Homepage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/logout" 
            element={<Logout authorized_true={authorized_true} />} 
          />
          {/* Fallback Route * /} 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
*/
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import Login from './login'; 
import Homepage from './homepage'; 
import CreateAccount from './CreateAccount'; 

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
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;

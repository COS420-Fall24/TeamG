import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Homepage from './homepage'; 

function App() {
  const [is_authenticated, authorized_true] = useState(false);  // User login state

  return (
    <Routes>
      {/* Login route */}
      <Route path="/" element={<Login authorized_true={authorized_true} />} />
      
      {/* Dashboard route*/}
      <Route 
        path="/dashboard" 
        element={is_authenticated ? <Homepage /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

export default App;

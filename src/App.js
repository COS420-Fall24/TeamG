import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';

function App() {
  const [authorized_true] = useState(false);  // State to track if user is logged in

  return (
    <Routes>
      {/* Login route */}
      <Route path="/" element={<Login authorized_true={authorized_true} />} />
    </Routes>
  );
}

export default App;

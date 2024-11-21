import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Logout = ({ authorized_true }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      authorized_true(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
      alert('Logout failed');
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
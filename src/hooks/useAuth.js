import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error.message);
      alert('Logout failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await deleteUser(user);
        window.location.href = '/';
      } catch (error) {
        console.error('Account deletion error:', error.message);
        alert('Account deletion failed');
      }
    }
  };

  return { user, handleLogout, handleDeleteAccount };
};

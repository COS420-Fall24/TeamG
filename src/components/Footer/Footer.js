import React from 'react';
import './Footer.css';  // Changed from index.css to Footer.css

const Footer = ({ onTutorialClick, onLogoutClick, onDeleteAccountClick, onClearData }) => {
  return (
    <div className="footer">
      <p>
        <a href="#">Account Info</a> | 
        <button onClick={onTutorialClick}>Tutorial</button> | 
        <a href="#">Privacy Policy</a> | 
        <a href="#">Contact</a> | 
        <a href="#">Disclaimer</a> | 
        <a href="#">Downtime Information</a> | 
        <button onClick={onClearData}>Clear Data</button> | 
        <button onClick={onLogoutClick}>Logout</button> | 
        <button onClick={onDeleteAccountClick}>Delete Account</button>
      </p>
    </div>
  );
};

export default Footer;  // Make sure we have the default export
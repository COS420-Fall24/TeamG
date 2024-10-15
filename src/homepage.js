import React from 'react';
import './homepage.css'; // Import the CSS file for styling

const Homepage = () => {
  return (
    <div className="homepage-container">
      {/* Header Section */}
      <div className="header">
        <h1>Money Gremlin</h1>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Budget Dashboard */}
        <div className="dashboard">
          <h2>Budget Dashboard</h2>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <div className="action-button" title="Log a new transaction">
            Log Transaction
          </div>
          <div className="action-button" title="Update an existing category">
            Update Category
          </div>
          <div className="action-button" title="Create a new category">
            New Category
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <p>
          <a href="#">Account Info</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact</a> | 
          <a href="#">Disclaimer</a> | <a href="#">Downtime Information</a>
        </p>
      </div>
    </div>
  );
};

export default Homepage;
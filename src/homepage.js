import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './homepage.css'; // Import the CSS file for styling

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Homepage = () => {
  // Data for the Pie chart (should pull from firebase once available)
  const catLabels = ['Rent', 'Groceries', 'Bills', 'Fun'];
  const catData = [1000, 200, 100, 100];


  const pieData = {
    labels: catLabels,
    datasets: [
      {
        label: 'Dollars Spent: ',
        data: catData,
        backgroundColor: ['#66AA11', '#FF0000', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#66AA11', '#FF0000', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

    // Chart options to make legend text white
    const options = {
      plugins: {
        legend: {
          labels: {
            color: 'white',
          },
        },
      },
    };

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
          <div className="pie-chart-container">
            <Pie data={pieData} options={options}/>
          </div>
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

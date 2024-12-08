import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import './BudgetDashboard.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const BudgetDashboard = ({ catData, catLabels, income }) => {
  const totalCategoryAmount = catData.reduce((a, b) => a + b, 0);
  const remainingAmount = Math.max(0, income - totalCategoryAmount);

  // Define bright colors for categories
  const categoryColors = [
      '#FF6384',  // Bright pink
      '#36A2EB',  // Bright blue
      '#FFCE56',  // Bright yellow
      '#4BC0C0', // Turquoise
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#66AA11', // Green
      '#FF6B6B', // Coral
      '#4ECDC4', // Mint
      '#45B7D1', // Sky blue
    ];
  
    const pieData = {
      labels: [...catLabels, 'Remaining'],
      datasets: [{
        data: [...catData, remainingAmount],
        backgroundColor: [
          ...catLabels.map((_, index) => categoryColors[index % categoryColors.length]),
          '#E0E0E0'  // Light gray for remaining amount
        ],
        hoverBackgroundColor: [
          ...catLabels.map((_, index) => {
            const color = categoryColors[index % categoryColors.length];
            return color.replace('FF', 'DD');  // Slightly darker version for hover
          }),
          '#CCCCCC'  // Slightly darker gray for remaining amount hover
        ],
      }],
    };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    maintainAspectRatio: true,
    responsive: true
  };

  return (
    <div className="dashboard">
      <h2>Budget Overview</h2>
      <div className="budget-summary">
        <div className="summary-item">
          <label>Total Income:</label>
          <span>${income.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <label>Total Budgeted:</label>
          <span>${totalCategoryAmount.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <label>Remaining:</label>
          <span>${remainingAmount.toFixed(2)}</span>
        </div>
      </div>
      <div className="pie-chart-container">
        {catData.length > 0 ? (
          <Pie data={pieData} options={options} />
        ) : (
          <p className="no-data">No categories added yet. Click "New Category" to get started!</p>
        )}
      </div>
    </div>
  );
};

export default BudgetDashboard;
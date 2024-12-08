import React, { useState } from 'react';
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

const BudgetDashboard = ({ catData, catLabels, income, transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
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

  const getMainPieData = () => ({
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
          return color.replace('FF', 'DD');
        }),
        '#CCCCCC'  // Slightly darker gray for remaining amount hover
      ],
    }],
  });

  const getTransactionPieData = () => {
    const categoryTransactions = transactions.filter(t => t.category === selectedCategory);
    const categoryIndex = catLabels.indexOf(selectedCategory);
    const categoryBudget = catData[categoryIndex];
    const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const remainingInCategory = Math.max(0, categoryBudget - totalSpent);

    return {
      labels: [...categoryTransactions.map(t => t.memo || 'No memo'), 'Remaining'],
      datasets: [{
        data: [...categoryTransactions.map(t => t.amount), remainingInCategory],
        backgroundColor: [
          ...categoryTransactions.map((_, index) => 
            categoryColors[index % categoryColors.length]
          ),
          '#E0E0E0'  // Same light gray for remaining amount
        ],
        hoverBackgroundColor: [
          ...categoryTransactions.map((_, index) => {
            const color = categoryColors[index % categoryColors.length];
            return color.replace('FF', 'DD');
          }),
          '#CCCCCC'  // Same hover gray as main chart
        ],
      }],
    };
  };

  const mainOptions = {
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
    responsive: true,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        if (index < catLabels.length) { // Don't select "Remaining" slice
          setSelectedCategory(catLabels[index]);
        }
      }
    }
  };

  const transactionOptions = {
    ...mainOptions,
    onClick: undefined, // Remove click handler for transaction view
    plugins: {
      ...mainOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            if (label === 'Remaining') {
              return `Remaining: $${value.toFixed(2)}`;
            }
            const date = transactions.find(t => t.memo === label)?.date;
            return [
              `${label}`,
              `Amount: $${value.toFixed(2)}`,
              date ? `Date: ${new Date(date).toLocaleDateString()}` : '',
            ].filter(Boolean);
          }
        }
      }
    }
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
        {selectedCategory && (
          <button 
            className="back-button"
            onClick={() => setSelectedCategory(null)}
          >
            ← Back to Overview
          </button>
        )}
        
        {catData.length > 0 ? (
          selectedCategory ? (
            <Pie 
              data={getTransactionPieData()} 
              options={transactionOptions} 
            />
          ) : (
            <Pie 
              data={getMainPieData()} 
              options={mainOptions} 
            />
          )
        ) : (
          <p className="no-data">No categories added yet. Click "New Category" to get started!</p>
        )}
      </div>
    </div>
  );
};

export default BudgetDashboard;
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

  // Helper function to get transactions from last 30 days
  const getRecentTransactions = (category) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.category === category && transactionDate >= thirtyDaysAgo;
    });
  };

  // Calculate category-specific data
  const getCategoryData = (category) => {
    const categoryBudget = catData[catLabels.indexOf(category)];
    const recentTransactions = getRecentTransactions(category);
    const spentAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const remainingAmount = Math.max(0, categoryBudget - spentAmount);

    return {
      budget: categoryBudget,
      spent: spentAmount,
      remaining: remainingAmount,
      transactionCount: recentTransactions.length
    };
  };

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


  const pieData = selectedCategory ? {
    labels: ['Spent', 'Remaining'],
    datasets: [{
      data: [
        getCategoryData(selectedCategory).spent,
        getCategoryData(selectedCategory).remaining
      ],
      backgroundColor: [categoryColors[catLabels.indexOf(selectedCategory)], '#E0E0E0'],
      hoverBackgroundColor: [
        categoryColors[catLabels.indexOf(selectedCategory)].replace('FF', 'DD'),
        '#CCCCCC'
      ]
    }]
  } : {
    labels: [...catLabels, 'Remaining'],
    datasets: [{
      data: [...catData, remainingAmount],
      backgroundColor: [
        ...catLabels.map((_, index) => categoryColors[index % categoryColors.length]),

        '#E0E0E0'

      ],
      hoverBackgroundColor: [
        ...catLabels.map((_, index) => {
          const color = categoryColors[index % categoryColors.length];
          return color.replace('FF', 'DD');
        }),
        
        '#CCCCCC'
      ],
    }]
    
  };

  const mainOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          padding: 20,
          font: { size: 14 }
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
    onClick: (event, elements) => {
      if (elements.length > 0 && !selectedCategory) {
        const index = elements[0].index;
        if (index < catLabels.length) { // Don't select "Remaining" slice
          setSelectedCategory(catLabels[index]);
        }
      }
    },
    maintainAspectRatio: true,
    responsive: true,

    elements: {
      arc: {
        cursor: (ctx) => {
          const index = ctx.dataIndex;
          return (!selectedCategory && index < catLabels.length) ? 'pointer' : 'default';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {selectedCategory && (
          <button 
            className="back-button" 
            onClick={() => setSelectedCategory(null)}
          >
            ←
          </button>
        )}
        <h2>{selectedCategory ? `${selectedCategory} Overview` : 'Budget Overview'}</h2>
      </div>

      <div className="budget-summary">
        <div className="summary-item">
          <label>Total Income:</label>
          <span>${income.toFixed(2)}</span>
        </div>
        {selectedCategory ? (
          <>
            <div className="summary-item">
              <label>Budget for {selectedCategory}:</label>
              <span>${getCategoryData(selectedCategory).budget.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <label>Remaining for {selectedCategory}:</label>
              <span>${getCategoryData(selectedCategory).remaining.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <label>Transactions (30 days):</label>
              <span>{getCategoryData(selectedCategory).transactionCount}</span>
            </div>
          </>
        ) : (
          <>
            <div className="summary-item">
              <label>Total Budgeted:</label>
              <span>${totalCategoryAmount.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <label>Remaining:</label>
              <span>${remainingAmount.toFixed(2)}</span>
            </div>
          </>
        )}
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
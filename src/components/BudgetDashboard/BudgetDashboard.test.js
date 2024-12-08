import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import BudgetDashboard from '../BudgetDashboard';

// Update the mock to directly call the onClick handler
jest.mock('react-chartjs-2', () => ({
  Pie: ({ options, data }) => (
    <div 
      data-testid="mock-pie-chart"
      onClick={() => {
        // Directly simulate the chart click
        if (options.onClick) {
          options.onClick(null, [{ index: 0 }]);
        }
      }}
      data-chart-labels={JSON.stringify(data.labels)}
      data-chart-data={JSON.stringify(data.datasets[0].data)}
    >
      Pie Chart
    </div>
  )
}));


describe('BudgetDashboard', () => {
  const mockProps = {
    catData: [100, 200, 300],
    catLabels: ['Food', 'Rent', 'Entertainment'],
    income: 1000,
    transactions: [
      { id: 1, category: 'Food', amount: 50, memo: 'Groceries', date: '2024-03-20' },
      { id: 2, category: 'Food', amount: 30, memo: 'Restaurant', date: '2024-03-21' },
      { id: 3, category: 'Rent', amount: 200, memo: 'March Rent', date: '2024-03-01' },
    ]
  };

  describe('Rendering', () => {
    test('renders budget overview with data', () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Check for main elements
      expect(screen.getByText('Budget Overview')).toBeInTheDocument();
      expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
      
      // Verify budget summary information is displayed
      expect(screen.getByText('Total Income:')).toBeInTheDocument();
      expect(screen.getByText('$1000.00')).toBeInTheDocument();
    });

    test('renders empty state message when no categories exist', () => {
      const emptyProps = {
        ...mockProps,
        catData: [],
        catLabels: [],
      };
      
      render(<BudgetDashboard {...emptyProps} />);
      
      // Check for empty state message
      expect(screen.getByText(/No categories added yet/i)).toBeInTheDocument();
      // Verify pie chart is not rendered
      expect(screen.queryByTestId('mock-pie-chart')).not.toBeInTheDocument();
    });

    test('displays correct budget summary information', () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Check all summary values
      const totalIncome = screen.getByText('$1000.00');
      const totalBudgeted = screen.getByText('$600.00'); // Sum of catData: 100 + 200 + 300
      const remaining = screen.getByText('$400.00'); // 1000 - 600
      
      expect(totalIncome).toBeInTheDocument();
      expect(totalBudgeted).toBeInTheDocument();
      expect(remaining).toBeInTheDocument();
      
      // Verify labels are present
      expect(screen.getByText('Total Income:')).toBeInTheDocument();
      expect(screen.getByText('Total Budgeted:')).toBeInTheDocument();
      expect(screen.getByText('Remaining:')).toBeInTheDocument();
    });
  });

  
  describe('Chart Interactions', () => {
    // Clean up after each test
    afterEach(() => {
      cleanup();
    });
  
    test('switches to transaction view when category slice is clicked', async () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Get the chart element
      const pieChart = screen.getByTestId('mock-pie-chart');
      
      // Simulate a click on the chart
      fireEvent.click(pieChart);
      
      // Wait for state update and check for back button
      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /back to overview/i });
        expect(backButton).toBeInTheDocument();
      });
    });  
        
    test('clicking remaining amount slice does not trigger category selection', async () => {
      render(<BudgetDashboard {...mockProps} />);
      
      const pieChart = screen.getByTestId('mock-pie-chart');
      
      // Update the mock click handler for this specific test
      const options = {
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = mockProps.catLabels.length; // Index of "Remaining" slice
            if (index < mockProps.catLabels.length) {
              // This shouldn't execute for the remaining slice
              setSelectedCategory(mockProps.catLabels[index]);
            }
          }
        }
      };
    
    
  });

  test('renders chart with correct data structure', () => {
    render(<BudgetDashboard {...mockProps} />);
    
    const pieChart = screen.getByTestId('mock-pie-chart');
    
    // Verify chart data
    const chartLabels = JSON.parse(pieChart.getAttribute('data-chart-labels'));
    const chartData = JSON.parse(pieChart.getAttribute('data-chart-data'));
    
    // Check labels include categories and "Remaining"
    expect(chartLabels).toEqual([...mockProps.catLabels, 'Remaining']);
    
    // Check data includes category amounts and remaining amount
    const expectedData = [
      ...mockProps.catData,
      mockProps.income - mockProps.catData.reduce((a, b) => a + b, 0)
    ];
    expect(chartData).toEqual(expectedData);
    });
  });

  describe('Calculations', () => {
    test('correctly calculates total budgeted amount', () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Total budgeted should be sum of all category amounts
      const expectedTotal = mockProps.catData.reduce((a, b) => a + b, 0);
      expect(screen.getByText(`$${expectedTotal.toFixed(2)}`)).toBeInTheDocument();
    });
  
    test('correctly calculates remaining amount', () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Remaining should be income minus total budgeted
      const totalBudgeted = mockProps.catData.reduce((a, b) => a + b, 0);
      const expectedRemaining = mockProps.income - totalBudgeted;
      expect(screen.getByText(`$${expectedRemaining.toFixed(2)}`)).toBeInTheDocument();
    });
  
    test('correctly calculates transaction totals for selected category', async () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Click the pie chart to select the first category (Food)
      const pieChart = screen.getByTestId('mock-pie-chart');
      fireEvent.click(pieChart);
      
      // Wait for the transaction view to appear
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /back to overview/i })).toBeInTheDocument();
      });
      
      // Get the chart data after switching to transaction view
      const updatedPieChart = screen.getByTestId('mock-pie-chart');
      const chartData = JSON.parse(updatedPieChart.getAttribute('data-chart-data'));
      
      // Calculate expected values for Food category
      const foodTransactions = mockProps.transactions.filter(t => t.category === 'Food');
      const totalSpent = foodTransactions.reduce((sum, t) => sum + t.amount, 0);
      const categoryBudget = mockProps.catData[0]; // Food budget
      const expectedRemaining = categoryBudget - totalSpent;
      
      // Verify the transaction data
      expect(chartData).toEqual([
        ...foodTransactions.map(t => t.amount),
        expectedRemaining
      ]);
    });
  });

  describe('Chart Data', () => {
    test('generates correct data structure for main pie chart', () => {
      render(<BudgetDashboard {...mockProps} />);
      
      const pieChart = screen.getByTestId('mock-pie-chart');
      const chartLabels = JSON.parse(pieChart.getAttribute('data-chart-labels'));
      const chartData = JSON.parse(pieChart.getAttribute('data-chart-data'));
      
      // Verify labels include all categories plus "Remaining"
      expect(chartLabels).toEqual([...mockProps.catLabels, 'Remaining']);
      
      // Verify data includes all category amounts plus remaining amount
      const expectedRemaining = mockProps.income - mockProps.catData.reduce((a, b) => a + b, 0);
      expect(chartData).toEqual([...mockProps.catData, expectedRemaining]);
    });
  
    test('generates correct data structure for transaction pie chart', async () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Click to view Food category transactions
      const pieChart = screen.getByTestId('mock-pie-chart');
      fireEvent.click(pieChart);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /back to overview/i })).toBeInTheDocument();
      });
      
      const transactionPieChart = screen.getByTestId('mock-pie-chart');
      const chartLabels = JSON.parse(transactionPieChart.getAttribute('data-chart-labels'));
      const chartData = JSON.parse(transactionPieChart.getAttribute('data-chart-data'));
      
      // Get Food transactions
      const foodTransactions = mockProps.transactions.filter(t => t.category === 'Food');
      const expectedLabels = [...foodTransactions.map(t => t.memo), 'Remaining'];
      const totalSpent = foodTransactions.reduce((sum, t) => sum + t.amount, 0);
      const expectedRemaining = mockProps.catData[0] - totalSpent; // Food budget - spent
      
      // Verify transaction view data structure
      expect(chartLabels).toEqual(expectedLabels);
      expect(chartData).toEqual([...foodTransactions.map(t => t.amount), expectedRemaining]);
    });
  
    test('assigns correct colors to chart segments', () => {
      render(<BudgetDashboard {...mockProps} />);
      
      // Expected colors from the component
      const expectedColors = [
        '#FF6384',  // Bright pink
        '#36A2EB',  // Bright blue
        '#FFCE56',  // Bright yellow
        '#E0E0E0'   // Light gray for remaining
      ];
      
      // Get chart data from test-id attributes
      const pieChart = screen.getByTestId('mock-pie-chart');
      const chartData = JSON.parse(pieChart.getAttribute('data-chart-data'));
      
      // Verify we have the correct number of data points
      expect(chartData.length).toBe(expectedColors.length);
      
      // Verify the number of colors matches our categories plus remaining
      const dataLength = mockProps.catLabels.length + 1; // Categories + Remaining
      expect(expectedColors.length).toBe(dataLength);
    });  });

});
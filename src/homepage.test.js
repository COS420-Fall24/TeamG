import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Homepage from './homepage';
import { MemoryRouter } from 'react-router-dom';

describe('Homepage Tests', () => {
    test('Confirm homepage components', () => {
        render(
            <MemoryRouter>
              <Homepage authorized_true={() => {}} />
            </MemoryRouter>
          );

        // Check if budget dashboard is rendered
        const budgetDashboard = screen.getByText('Budget Dashboard');
        expect(budgetDashboard).toBeInTheDocument();

        // Check if log transaction is rendered
        const logTransaction = screen.getByText('Log Transaction');
        expect(logTransaction).toBeInTheDocument();

        // Check if update category is rendered
        const updateCategory = screen.getByText('Update Category');
        expect(updateCategory).toBeInTheDocument();

        // Check if new category is rendered
        const newCategory = screen.getByText('New Category');
        expect(newCategory).toBeInTheDocument();

        // Check if change income is rendered
        const changeIncome = screen.getByText('Change Income');
        expect(changeIncome).toBeInTheDocument();
    });

    test('Test new category', async() => {
        // TODO: Flesh test out more by clicking "Create" button and ensuring inputs are on pie chart
        render(
            <MemoryRouter>
              <Homepage authorized_true={() => {}} />
            </MemoryRouter>
          );
        
          // Before testing, ensure element is on the screen
          const newCategoryButton = screen.getByText('New Category');
          expect(newCategoryButton).toBeInTheDocument();

          fireEvent.click(newCategoryButton);

          // Check that the right window popped up and text boxes are displayed
          const catName = screen.getByPlaceholderText('Enter category name');
          const catAmt = screen.getByPlaceholderText('Enter category amount');
          expect(catName).toBeInTheDocument();
          expect(catAmt).toBeInTheDocument();

          // Enter test category info
          fireEvent.change(catName, { target: { value: 'Bills' } });
          fireEvent.change(catAmt, { target: { value: '1000' } });
          expect(catName.value).toBe('Bills');
          expect(catAmt.value).toBe('1000');
    });

    test('Test log transaction', () => {
        render(
            <MemoryRouter>
              <Homepage authorized_true={() => {}} />
            </MemoryRouter>
          );
        
          // Before testing, ensure element is on the screen
          const logTransaction = screen.getByText('Log Transaction');
          expect(logTransaction).toBeInTheDocument();

          fireEvent.click(logTransaction);

          // Check that the right window popped up and text boxes are displayed
          const catName = screen.getByText('Select category');
          const memo = screen.getByPlaceholderText('Enter memo');
          const amount = screen.getByPlaceholderText('Enter amount');
          expect(catName).toBeInTheDocument();
          expect(memo).toBeInTheDocument();
          expect(amount).toBeInTheDocument();

          // Try entering values into the text boxes
          fireEvent.change(memo, { target: { value: 'Hello there' } });
          fireEvent.change(amount, { target: { value: '1000' } });
          expect(memo.value).toBe('Hello there');
          expect(amount.value).toBe('1000');
    });

});
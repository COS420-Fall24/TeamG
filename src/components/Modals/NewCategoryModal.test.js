import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewCategoryModal } from './NewCategoryModal';

describe('NewCategoryModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    show: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when show is true', () => {
    render(<NewCategoryModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'New Category' })).toBeInTheDocument();
    expect(screen.getByText('Category Name:')).toBeInTheDocument();
    expect(screen.getByText('Budget Amount:')).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    render(<NewCategoryModal {...defaultProps} show={false} />);
    
    expect(screen.queryByRole('heading', { name: 'New Category' })).not.toBeInTheDocument();
  });
  test('submits form with correct data', () => {
    render(<NewCategoryModal {...defaultProps} />);
    
    // Fill out the form
    const categoryInput = screen.getByLabelText('Category Name:');
    const amountInput = screen.getByLabelText('Budget Amount:');
    
    fireEvent.change(categoryInput, { target: { value: 'Food' } });
    fireEvent.change(amountInput, { target: { value: '100.50' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create category/i });
    fireEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Food',
      amount: 100.50
    }, 'new');
    
    // Verify modal was closed
    expect(mockOnClose).toHaveBeenCalled();
  });
});
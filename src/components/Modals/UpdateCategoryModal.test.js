import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpdateCategoryModal } from './UpdateCategoryModal';

describe('UpdateCategoryModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockCategories = ['Groceries', 'Entertainment', 'Utilities'];
  
  const defaultProps = {
    show: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    categories: mockCategories,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when show is true', () => {
    render(<UpdateCategoryModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Update Category' })).toBeInTheDocument();
    expect(screen.getByText('Select Category to Update:')).toBeInTheDocument();
    expect(screen.getByText('New Category Name:')).toBeInTheDocument();
    expect(screen.getByText('New Budget Amount:')).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    render(<UpdateCategoryModal {...defaultProps} show={false} />);
    
    expect(screen.queryByRole('heading', { name: 'Update Category' })).not.toBeInTheDocument();
  });

  test('renders all categories in the select dropdown', () => {
    render(<UpdateCategoryModal {...defaultProps} />);
    
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
/*
  test('submits form with correct data', () => {
    render(<UpdateCategoryModal {...defaultProps} />);
    
    // Fill out the form
    const selectElement = screen.getByRole('combobox');
    const newCategoryInput = screen.getByPlaceholderText('Enter new name (leave blank to keep current)');
    const amountInput = screen.getByPlaceholderText('Enter new budget amount');
    
    fireEvent.change(selectElement, { target: { value: 'Groceries' } });
    fireEvent.change(newCategoryInput, { target: { value: 'Food' } });
    fireEvent.change(amountInput, { target: { value: '100.50' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Update Category' });
    fireEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      oldCategory: 'Groceries',
      newCategory: 'Food',
      amount: 100.50
    }, 'update');
    
    // Verify modal was closed
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('requires old category and amount fields', () => {
    render(<UpdateCategoryModal {...defaultProps} />);
    
    // Try to submit without required fields
    const submitButton = screen.getByRole('button', { name: 'Update Category' });
    fireEvent.click(submitButton);

    // Form should submit with empty/invalid values
    expect(mockOnSubmit).toHaveBeenCalledWith({
      oldCategory: '',
      newCategory: '',
      amount: NaN
    }, 'update');

    // Verify required attributes
    const selectElement = screen.getByRole('combobox');
    const amountInput = screen.getByPlaceholderText('Enter new budget amount');
    
    expect(selectElement).toHaveAttribute('required');
    expect(amountInput).toHaveAttribute('required');
  });

  test('allows submission with empty new category name', () => {
    render(<UpdateCategoryModal {...defaultProps} />);
    
    // Fill out form with empty new category
    const selectElement = screen.getByRole('combobox');
    const amountInput = screen.getByPlaceholderText('Enter new budget amount');
    
    fireEvent.change(selectElement, { target: { value: 'Groceries' } });
    fireEvent.change(amountInput, { target: { value: '100.50' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Update Category' });
    fireEvent.click(submitButton);

    // Verify submission with empty new category
    expect(mockOnSubmit).toHaveBeenCalledWith({
      oldCategory: 'Groceries',
      newCategory: '',
      amount: 100.50
    }, 'update');
  });
  */
});
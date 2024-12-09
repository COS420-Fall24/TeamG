import React from 'react';
import { render, screen } from '@testing-library/react';
import { TransactionHistoryModal } from './TransactionHistoryModal';

describe('TransactionHistoryModal', () => {
    const mockTransactions = [
        {
            date: '1/1/2024',
            time: '12:00 PM',
            category: 'Food',
            memo: 'Lunch',
            amount: 15.99
        },
        {
            date: '1/2/2024', 
            time: '3:30 PM',
            category: 'Entertainment',
            memo: 'Movies',
            amount: 24.50
        }
    ];

    const defaultProps = {
        show: true,
        onClose: jest.fn(),
        transactions: mockTransactions
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders modal when show is true', () => {
        render(<TransactionHistoryModal {...defaultProps} />);
        expect(screen.getByText('Transaction History')).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('does not render when show is false', () => {
        render(<TransactionHistoryModal {...defaultProps} show={false} />);
        expect(screen.queryByText('Transaction History')).not.toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('displays correct table headers', () => {
        render(<TransactionHistoryModal {...defaultProps} />);
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Time')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByText('Memo')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    test('displays transaction data correctly', () => {
        render(<TransactionHistoryModal {...defaultProps} />);
        
        mockTransactions.forEach(transaction => {
            expect(screen.getByText(transaction.date)).toBeInTheDocument();
            expect(screen.getByText(transaction.time)).toBeInTheDocument();
            expect(screen.getByText(transaction.category)).toBeInTheDocument();
            expect(screen.getByText(transaction.memo)).toBeInTheDocument();
            expect(screen.getByText(`$${transaction.amount.toFixed(2)}`)).toBeInTheDocument();
        });
    });

    test('displays no transactions message when transactions array is empty', () => {
        render(<TransactionHistoryModal {...defaultProps} transactions={[]} />);
        expect(screen.getByText('No transactions to display')).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('displays no transactions message when transactions is null', () => {
        render(<TransactionHistoryModal {...defaultProps} transactions={null} />);
        expect(screen.getByText('No transactions to display')).toBeInTheDocument();
    });

    test('handles undefined transaction properties gracefully', () => {
        const incompleteTransaction = [
            {
                date: '1/1/2024',
                category: 'Food',
                amount: 15.99
            }
        ];

        render(<TransactionHistoryModal {...defaultProps} transactions={incompleteTransaction} />);
        expect(screen.getByText('1/1/2024')).toBeInTheDocument();
        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('$15.99')).toBeInTheDocument();
    });

    test('renders scrollable container for many transactions', () => {
        const manyTransactions = Array(20).fill(mockTransactions[0]);
        const { container } = render(
            <TransactionHistoryModal {...defaultProps} transactions={manyTransactions} />
        );
        
        const tableContainer = screen.getByTestId('transaction-table-container');
        
        // Test computed styles
        const computedStyle = window.getComputedStyle(tableContainer);
        expect(computedStyle.maxHeight).toBe('400px');
        expect(computedStyle.overflowY).toBe('auto');
        
        // Alternative approach: test style attributes directly
        expect(tableContainer).toHaveAttribute(
            'style',
            expect.stringContaining('max-height: 400px')
        );
        expect(tableContainer).toHaveAttribute(
            'style',
            expect.stringContaining('overflow-y: auto')
        );
    });

    test('formats transaction amounts with 2 decimal places', () => {
        const transactionsWithVariedAmounts = [
            { ...mockTransactions[0], amount: 15.9 },
            { ...mockTransactions[0], amount: 15.99 },
            { ...mockTransactions[0], amount: 15 }
        ];

        render(<TransactionHistoryModal {...defaultProps} transactions={transactionsWithVariedAmounts} />);
        
        expect(screen.getByText('$15.90')).toBeInTheDocument();
        expect(screen.getByText('$15.99')).toBeInTheDocument();
        expect(screen.getByText('$15.00')).toBeInTheDocument();
    });
});
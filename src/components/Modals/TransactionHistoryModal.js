import React from 'react';
import Modal from './Modal';
import './Modal.css';

export const TransactionHistoryModal = ({ show, onClose, transactions }) => {
  return (
    <Modal show={show} onClose={onClose}>
      <h2>Transaction History</h2>
      <div className="transaction-table-container">
        {transactions && transactions.length > 0 ? (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Category</th>
                <th>Memo</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.time}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.memo}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-transactions">No transactions to display</div>
        )}
      </div>
    </Modal>
  );
};
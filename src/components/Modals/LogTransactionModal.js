import React from 'react';
import Modal from './Modal';

export const LogTransactionModal = ({ show, onClose, onSubmit, categories }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      category: formData.get('category'),
      memo: formData.get('memo'),
      amount: parseFloat(formData.get('amount'))
    }, 'log');
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2>Log Transaction</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <div>
          <label>Category:</label>
          <select name="category" required>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Memo:</label>
          <input type="text" name="memo" required />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" name="amount" step="0.01" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
};
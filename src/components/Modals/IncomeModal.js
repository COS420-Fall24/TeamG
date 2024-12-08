import React from 'react';
import Modal from './Modal';

export const IncomeModal = ({ show, onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      amount: parseFloat(formData.get('amount'))
    }, 'income');
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2>Update Income</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <div>
          <label>Monthly Income:</label>
          <input type="number" name="amount" step="0.01" required />
        </div>
        <button type="submit">Update Income</button>
      </form>
    </Modal>
  );
};
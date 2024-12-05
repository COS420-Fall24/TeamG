import React from 'react';
import Modal from './Modal';

export const NewCategoryModal = ({ show, onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      category: formData.get('category'),
      amount: parseFloat(formData.get('amount'))
    }, 'new');
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2>New Category</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <div>
          <label>Category Name:</label>
          <input type="text" name="category" required />
        </div>
        <div>
          <label>Budget Amount:</label>
          <input type="number" name="amount" step="0.01" required />
        </div>
        <button type="submit">Create Category</button>
      </form>
    </Modal>
  );
};
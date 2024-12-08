import React from 'react';
import Modal from './Modal';

export const UpdateCategoryModal = ({ show, onClose, onSubmit, categories }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      oldCategory: formData.get('oldCategory'),
      newCategory: formData.get('newCategory'),
      amount: parseFloat(formData.get('amount'))
    }, 'update');
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2>Update Category</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <div>
          <label>Select Category to Update:</label>
          <select name="oldCategory" required>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label>New Category Name:</label>
          <input 
            type="text" 
            name="newCategory" 
            placeholder="Enter new name (leave blank to keep current)"
          />
        </div>
        <div>
          <label>New Budget Amount:</label>
          <input 
            type="number" 
            name="amount" 
            step="0.01" 
            required 
            placeholder="Enter new budget amount"
          />
        </div>
        <button type="submit">Update Category</button>
      </form>
    </Modal>
  );
};
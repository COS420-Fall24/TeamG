import React from 'react';
import Modal from './Modal';

export const DeleteAccountModal = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="modal-content">
        <h2>Delete Account</h2>
        <p className="warning-text">
          Are you sure you want to delete your account? This action cannot be undone.
          All your data will be permanently deleted.
        </p>
        <div className="modal-actions">
          <button 
            className="delete-button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes, Delete My Account
          </button>
          <button 
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
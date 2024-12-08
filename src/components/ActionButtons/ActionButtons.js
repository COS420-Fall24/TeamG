import React from 'react';
import './ActionButtons.css';  // Changed from index.css to ActionButtons.css

const ActionButtons = ({ onActionClick }) => {
  return (
    <div className="actions">
      <div className="action-button" onClick={() => onActionClick('log')}>
        Log Transaction
      </div>
      <div className="action-button" onClick={() => onActionClick('update')}>
        Update Category
      </div>
      <div className="action-button" onClick={() => onActionClick('new')}>
        New Category
      </div>
      <div className="action-button" onClick={() => onActionClick('income')}>
        Change Income
      </div>
    </div>
  );
};

export default ActionButtons;
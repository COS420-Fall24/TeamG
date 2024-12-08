// src/components/Tutorial/TutorialOverlay.js
import React from 'react';
import './TutorialOverlay.css';

const tutorialSteps = [
  {
    title: 'Step 1: Set Up Income',
    content: 'To set up your income, go to the income section and enter your monthly income.',
  },
  {
    title: 'Step 2: Create a Category',
    content: 'To create a new category, click on the "New Category" button and fill in the details.',
  },
  {
    title: 'Step 3: Log a Transaction',
    content: 'To log a transaction, click on the "Log Transaction" button and enter the transaction details.',
  },
];

const TutorialOverlay = ({ currentStep, onAction }) => {
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-box">
        <h2>{tutorialSteps[currentStep].title}</h2>
        <p>{tutorialSteps[currentStep].content}</p>
        <div className="tutorial-navigation">
          <button 
            onClick={onAction.prev} 
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button 
            onClick={onAction.next} 
            disabled={currentStep === tutorialSteps.length - 1}
          >
            Next
          </button>
          <button onClick={onAction.exit}>Exit Tutorial</button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
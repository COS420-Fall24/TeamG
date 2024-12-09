import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export const useTutorial = (userId) => {
  const [tutorial, setTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleTutorialActions = {
    start: async () => {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        try {
          await updateDoc(userDocRef, { tutorial: true });
          setTutorial(true);
        } catch (error) {
          console.error('Error updating tutorial status:', error);
        }
      }
    },
    next: () => setCurrentStep(prev => prev + 1),
    prev: () => setCurrentStep(prev => prev - 1),
    exit: async () => {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        try {
          await updateDoc(userDocRef, { tutorial: false });
          setTutorial(false);
        } catch (error) {
          console.error('Error updating tutorial status:', error);
        }
      }
    }
  };

  return { tutorial, currentStep, handleTutorialActions };
};

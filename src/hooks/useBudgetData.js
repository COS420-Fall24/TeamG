import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export const useBudgetData = (userId) => {
  const [catData, setCatData] = useState([]);
  const [catLabels, setCatLabels] = useState([]);
  const [income, setIncome] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const budgetData = userData.budgetData || [];
        const transactions = userData.transactions || [];
        
        // Set income
        const incomeEntry = budgetData.find(entry => entry.category === 'Income');
        setIncome(incomeEntry ? incomeEntry.amount : 0);

        // Set categories and amounts
        const categories = budgetData.filter(entry => entry.type === 'category');
        setCatData(categories.map(entry => entry.amount));
        setCatLabels(categories.map(entry => entry.category));

        // Set transactions
        setTransactions(transactions);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleFormSubmit = async (formData, type) => {
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    let budgetData = userDoc.exists() ? userDoc.data().budgetData || [] : [];
    let transactions = userDoc.exists() ? userDoc.data().transactions || [] : [];

    try {
      switch (type) {
        case 'new':
          // Add new category
          budgetData.push({
            category: formData.category,
            amount: formData.amount,
            type: 'category'
          });
          break;

        case 'update':
          // Update existing category
          const categoryIndex = budgetData.findIndex(
            item => item.category === formData.oldCategory
          );
          if (categoryIndex !== -1) {
            budgetData[categoryIndex] = {
              category: formData.newCategory || formData.oldCategory,
              amount: formData.amount,
              type: 'category'
            };
            // Update category name in transactions if it changed
            if (formData.newCategory && formData.newCategory !== formData.oldCategory) {
              transactions = transactions.map(t => ({
                ...t,
                category: t.category === formData.oldCategory ? formData.newCategory : t.category
              }));
            }
          }
          break;

        case 'income':
          // Update income
          const incomeIndex = budgetData.findIndex(
            item => item.category === 'Income'
          );
          if (incomeIndex !== -1) {
            budgetData[incomeIndex].amount = formData.amount;
          } else {
            budgetData.push({
              category: 'Income',
              amount: formData.amount,
              type: 'income'
            });
          }
          break;

        case 'log':
          // Log a transaction without changing category amount
          transactions.push({
            category: formData.category,
            amount: formData.amount,
            memo: formData.memo,
            date: new Date().toISOString()
          });
          break;
      }

      // Update Firestore
      await updateDoc(userDocRef, { 
        budgetData,
        transactions 
      });

      // Refresh the local state
      await fetchData();

    } catch (error) {
      console.error('Error updating budget data:', error);
      alert('Failed to update budget data');
    }
  };

  const handleClearData = async () => {
    if (userId) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          budgetData: [{ category: 'Income', amount: 0, type: 'income' }],
          transactions: []
        });
        // Reset local state
        setCatData([]);
        setCatLabels([]);
        setIncome(0);
        setTransactions([]);
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data');
      }
    }
  };

  return { catData, catLabels, income, transactions, handleFormSubmit, handleClearData };
};
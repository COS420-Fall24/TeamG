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
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const budgetData = userData.budgetData || [];

          // Set income
          const incomeEntry = budgetData.find(entry => entry.category === 'Income');
          setIncome(incomeEntry ? incomeEntry.amount : 0);

          // Set categories and amounts
          const categories = budgetData
            .filter(entry => entry.type === 'category')
            .map(entry => entry.category);
          const amounts = budgetData
            .filter(entry => entry.type === 'category')
            .map(entry => entry.amount);

          setCatData(amounts);
          setCatLabels(categories);

          // Set transactions
          const allTransactions = budgetData
            .filter(entry => entry.type === 'category')
            .flatMap(entry => entry.transactions || [])
            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
          
          setTransactions(allTransactions);
        }
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleFormSubmit = async (formData, type) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      const currentData = userDoc.exists() ? userDoc.data().budgetData || [] : [];
      let updatedData;

      switch (type) {
        case 'log':
          const newTransaction = {
            category: formData.category,
            memo: formData.memo,
            amount: parseFloat(formData.amount),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            type: 'transaction'
          };

          updatedData = currentData.map(entry => {
            if (entry.category === formData.category && entry.type === 'category') {
              return {
                ...entry,
                transactions: [newTransaction, ...(entry.transactions || [])]
              };
            }
            return entry;
          });

          await updateDoc(userDocRef, { budgetData: updatedData });
          setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
          break;

        case 'new':
          const newCategory = {
            category: formData.name,
            amount: formData.amount,
            type: 'category',
            transactions: []
          };
          updatedData = [...currentData, newCategory];
          await updateDoc(userDocRef, { budgetData: updatedData });
          await fetchData();
          break;

        case 'update':
          updatedData = currentData.map(entry =>
            entry.category === formData.oldCategory
              ? { ...entry, category: formData.name, amount: formData.amount }
              : entry
          );
          await updateDoc(userDocRef, { budgetData: updatedData });
          await fetchData();
          break;

        case 'income':
          const incomeEntry = {
            category: 'Income',
            amount: formData.amount,
            type: 'income'
          };
          updatedData = currentData.filter(entry => entry.category !== 'Income');
          updatedData.push(incomeEntry);
          await updateDoc(userDocRef, { budgetData: updatedData });
          setIncome(formData.amount);
          break;

        default:
          return;
      }

    } catch (error) {
      console.error('Error updating budget data:', error);
      throw error;
    }
  };

  const handleClearData = async () => {
    if (userId) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          budgetData: [{ category: 'Income', amount: 0, type: 'income' }]
        });
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
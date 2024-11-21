import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db } from './firebase-config';
import './homepage.css';
import Modal from './Modal.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Homepage = () => {
  const [catData, setCatData] = useState([]);
  const [catLabels, setCatLabels] = useState([]);
  const [showModal, setShowModal] = useState({ log: false, update: false, new: false, income: false, deleteAccount: false });
  const [formData, setFormData] = useState({ amount: '', category: '', memo: '', oldCategory: '', newCategory: { name: '', amount: 0 }, income: '' });
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [tutorial, setTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [income, setIncome] = useState(0);
  const [password, setPassword] = useState(''); // Add state for password

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

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);

        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(
              userDocRef,
              {
                email: user.email,
                name: user.displayName,
                createdAt: new Date(),
                budgetData: [],
                tutorial: false,
              },
              { merge: true }
            );
            console.log('User document created with initial data');
          } else {
            console.log('User document already exists. Data fetched successfully.');
          }

          const userData = userDoc.data();
          const budgetData = userData.budgetData || [];
          const incomeEntry = budgetData.find(entry => entry.category === 'Income');
          const incomeAmount = incomeEntry ? incomeEntry.amount : 0;
          setIncome(incomeAmount);

          const categories = budgetData.filter(entry => entry.type === 'category').map((entry) => entry.category);
          const amounts = budgetData.filter(entry => entry.type === 'category').map((entry) => entry.amount);

          setCatData(amounts);
          setCatLabels(categories);
          setTutorial(userData.tutorial || false);
        } catch (error) {
          console.error('Error checking or creating user document:', error);
        }
      } else {
        console.log('No user is currently logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (type) => {
    setShowModal({ ...showModal, [type]: true });
  };

  const handleCloseModal = () => {
    setShowModal({ log: false, update: false, new: false, income: false, deleteAccount: false });
    setFormData({ amount: '', category: '', memo: '', oldCategory: '', newCategory: { name: '', amount: 0 }, income: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setFormData((prevState) => {
      let newState = { ...prevState };
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleFormSubmit = async (event, type) => {
    event.preventDefault();

    if (user && userId) {
      const userDocRef = doc(db, 'users', userId);

      try {
        const userDoc = await getDoc(userDocRef);
        let updatedData;

        if (userDoc.exists()) {
          const currentData = userDoc.data().budgetData || [];

          if (type === 'log') {
            const newTransaction = { amount: parseInt(formData.amount), memo: formData.memo, type: 'transaction' };
            updatedData = currentData.map((entry) => {
              if (entry.category === formData.category && entry.type === 'category') {
                return { ...entry, transactions: [...(entry.transactions || []), newTransaction] };
              }
              return entry;
            });
            await updateDoc(userDocRef, { budgetData: updatedData });
          } else if (type === 'update') {
            updatedData = currentData.map((entry) =>
              entry.category === formData.oldCategory ? { ...entry, category: formData.newCategory.name, amount: parseInt(formData.newCategory.amount), type: 'category' } : entry
            );
            updatedData = updatedData.filter((entry, index, self) =>
              index === self.findIndex((e) => e.category === entry.category)
            );
            await updateDoc(userDocRef, { budgetData: updatedData });
          } else if (type === 'new') {
            const newEntry = { category: formData.newCategory.name, amount: parseInt(formData.newCategory.amount), type: 'category', transactions: [] };
            updatedData = [...currentData, newEntry];
            await updateDoc(userDocRef, { budgetData: updatedData });
          } else if (type === 'income') {
            const incomeEntry = { category: 'Income', amount: parseInt(formData.income), type: 'income' };
            updatedData = currentData.filter(entry => entry.category !== 'Income');
            updatedData.push(incomeEntry);
            await updateDoc(userDocRef, { budgetData: updatedData });
            setIncome(incomeEntry.amount);
            console.log('Income updated successfully');
          }

          setCatData(updatedData.filter(entry => entry.type === 'category').map((entry) => entry.amount));
          setCatLabels(updatedData.filter(entry => entry.type === 'category').map((entry) => entry.category));
          console.log('Data updated successfully');
        } else {
          const newEntry = {
            category: formData.category,
            memo: formData.memo,
            amount: parseInt(formData.amount),
            type: 'transaction',
          };
          updatedData = [newEntry];

          await setDoc(
            userDocRef,
            {
              email: user.email,
              name: user.displayName,
              createdAt: new Date(),
              budgetData: updatedData,
            },
            { merge: true }
          );
          setCatData(updatedData.filter(entry => entry.type === 'category').map((entry) => entry.amount));
          setCatLabels(updatedData.filter(entry => entry.type === 'category').map((entry) => entry.category));
          console.log('Document created/updated successfully');
        }

        handleCloseModal();
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    } else {
      console.error('No user is currently authenticated');
    }
  };

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTutorialClick = async () => {
    if (user && userId) {
      const userDocRef = doc(db, 'users', userId);
      try {
        await updateDoc(userDocRef, { tutorial: true });
        setTutorial(true);
        console.log('Tutorial status updated successfully');
      } catch (error) {
        console.error('Error updating tutorial status:', error);
      }
    } else {
      console.error('No user is currently authenticated');
    }
  };

  const handleExitTutorial = async () => {
    if (user && userId) {
      const userDocRef = doc(db, 'users', userId);
      try {
        await updateDoc(userDocRef, { tutorial: false });
        setTutorial(false);
        console.log('Tutorial status updated successfully');
      } catch (error) {
        console.error('Error updating tutorial status:', error);
      }
    } else {
      console.error('No user is currently authenticated');
    }
  };

  const handleClearData = async () => {
    if (user && userId) {
      const userDocRef = doc(db, 'users', userId);
      try {
        await updateDoc(userDocRef, { budgetData: [] });
        setCatData([]);
        setCatLabels([]);
        console.log('Data cleared successfully');
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    } else {
      console.error('No user is currently authenticated');
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error.message);
      alert('Logout failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (user && userId) {
      const userDocRef = doc(db, 'users', userId);
      try {
        await deleteDoc(userDocRef);
        await deleteUser(user);
        console.log('Account and data deleted successfully');
        window.location.href = '/';
      } catch (error) {
        console.error('Account deletion error:', error.message);
        alert('Account deletion failed');
      }
    } else {
      console.error('No user is currently authenticated');
    }
  };

  const totalCategoryAmount = catData.reduce((a, b) => a + b, 0);
  const remainingAmount = Math.max(0, income - totalCategoryAmount);

  const pieData = {
    labels: [...catLabels, 'Remaining'],
    datasets: [
      {
        label: 'Dollars Spent',
        data: [...catData, remainingAmount],
        backgroundColor: [...catLabels.map(() => '#66AA11'), '#CCCCCC'],
        hoverBackgroundColor: [...catLabels.map(() => '#66AA11'), '#CCCCCC'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  const tutorialBoxStyle = {
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -20%)',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  };

  return (
    <div className="homepage-container">
      {tutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-box" style={tutorialBoxStyle}>
            <h2>{tutorialSteps[currentStep].title}</h2>
            <p>{tutorialSteps[currentStep].content}</p>
            <div className="tutorial-navigation">
              <button onClick={handlePrevStep} disabled={currentStep === 0}>Previous</button>
              <button onClick={handleNextStep} disabled={currentStep === tutorialSteps.length - 1}>Next</button>
              <button onClick={handleExitTutorial}>Exit Tutorial</button>
            </div>
          </div>
        </div>
      )}
      <div className="header">
        <h1>Money Gremlin</h1>
      </div>

      <div className="content">
        <div className="dashboard">
          <h2>Budget Dashboard</h2>
          <div className="pie-chart-container">
            {catData.length > 0 ? (
              <Pie data={pieData} options={options} />
            ) : (
              <p>No data available to display</p>
            )}
          </div>
        </div>

        <div className="actions">
          <div className="action-button" title="Log a new transaction" onClick={() => handleOpenModal('log')}>
            Log Transaction
          </div>
          <div className="action-button" title="Update an existing category" onClick={() => handleOpenModal('update')}>
            Update Category
          </div>
          <div className="action-button" title="Create a new category" onClick={() => handleOpenModal('new')}>
            New Category
          </div>
          <div className="action-button" title="Change Income" onClick={() => handleOpenModal('income')}>
            Change Income
          </div>
        </div>
      </div>

      <Modal show={showModal.log} onClose={handleCloseModal}>
        <h2>Log Transaction</h2>
        <form onSubmit={(e) => handleFormSubmit(e, 'log')}>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleInputChange} required>
            <option value="">Select category</option>
            {catLabels.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
          <label>Memo:</label>
          <input type="text" name="memo" value={formData.memo} onChange={handleInputChange} placeholder="Enter memo" required />
          <label>Amount:</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Enter amount" required />
          <button type="submit">Submit</button>
        </form>
      </Modal>

      <Modal show={showModal.update} onClose={handleCloseModal}>
        <h2>Update Category</h2>
        <form onSubmit={(e) => handleFormSubmit(e, 'update')}>
          <label>Old Category Name:</label>
          <select name="oldCategory" value={formData.oldCategory} onChange={handleInputChange} required>
            <option value="">Select category</option>
            {catLabels.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
          <label>New Category Name:</label>
          <input type="text" name="newCategory.name" value={formData.newCategory.name} onChange={handleInputChange} placeholder="Enter new category name" required />
          <label>New Category Amount:</label>
          <input type="number" name="newCategory.amount" value={formData.newCategory.amount} onChange={handleInputChange} placeholder="Enter new category amount" required />
          <button type="submit">Update</button>
        </form>
      </Modal>

      <Modal show={showModal.new} onClose={handleCloseModal}>
        <h2>New Category</h2>
        <form onSubmit={(e) => handleFormSubmit(e, 'new')}>
          <label>Category Name:</label>
          <input type="text" name="newCategory.name" value={formData.newCategory.name} onChange={handleInputChange} placeholder="Enter category name" required />
          <label>Category Amount:</label>
          <input type="number" name="newCategory.amount" value={formData.newCategory.amount} onChange={handleInputChange} placeholder="Enter category amount" required />
          <button type="submit">Create</button>
        </form>
      </Modal>

      <Modal show={showModal.income} onClose={handleCloseModal}>
        <h2>Change Income</h2>
        <form onSubmit={(e) => handleFormSubmit(e, 'income')}>
          <label>Income Amount:</label>
          <input type="number" name="income" value={formData.income} onChange={handleInputChange} placeholder="Enter income amount" required />
          <button type="submit">Submit</button>
        </form>
      </Modal>

      <Modal show={showModal.deleteAccount} onClose={handleCloseModal}>
        <h2>Delete Account</h2>
        <p>Are you sure you want to delete your account? This will erase all data associated with the account and is irreversible.</p>
        <button onClick={handleDeleteAccount}>Yes, I'm sure</button>
        <button onClick={handleCloseModal}>Go back</button>
      </Modal>

      <div className="footer">
        <p>
          <a href="#">Account Info</a> | <button onClick={handleTutorialClick}>Tutorial</button> | <a href="#">Privacy Policy</a> | <a href="#">Contact</a> | 
          <a href="#">Disclaimer</a> | <a href="#">Downtime Information</a> | <button onClick={handleClearData}>Clear Data</button> | <button onClick={handleLogout}>Logout</button> | <button onClick={() => handleOpenModal('deleteAccount')}>Delete Account</button>
        </p>
      </div>
    </div>
  );
};

export default Homepage;
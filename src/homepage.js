import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase-config.js';
import './homepage.css';
import Modal from './Modal.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Homepage = () => {
  const [catData, setCatData] = useState([]);
  const [catLabels, setCatLabels] = useState([]);
  const [showModal, setShowModal] = useState({ log: false, update: false, new: false });
  const [formData, setFormData] = useState({ amount: '', category: '', oldCategory: '', newCategory: '' });
  const [userId, setUserId] = useState(null); // Add this
  const [user, setUser] = useState(null);     // And this

  useEffect(() => {
    const auth = getAuth();

    // Listen for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);               // Store user in state
        setUserId(user.uid);         // Store userId in state
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);

        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            // Create a new document with all necessary fields
            await setDoc(
              userDocRef,
              {
                email: user.email,
                name: user.displayName,
                createdAt: new Date(),
                budgetData: [], // Initialize budgetData as an empty array
              },
              { merge: true }
            );
            console.log('User document created with initial data');
          } else {
            console.log('User document already exists. Data fetched successfully.');
          }

          // Fetch budget data for display
          const userData = userDoc.data();
          const budgetData = userData.budgetData || [];

          // Extract categories and amounts for the chart
          const categories = budgetData.map((entry) => entry.category);
          const amounts = budgetData.map((entry) => entry.amount);

          setCatData(amounts);
          setCatLabels(categories);
        } catch (error) {
          console.error('Error checking or creating user document:', error);
        }
      } else {
        console.log('No user is currently logged in');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (type) => {
    setShowModal({ ...showModal, [type]: true });
  };

  const handleCloseModal = () => {
    setShowModal({ log: false, update: false, new: false });
    setFormData({ amount: '', category: '', oldCategory: '', newCategory: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event, type) => {
    event.preventDefault();

    if (user && userId) { // Use user and userId from state
      const userDocRef = doc(db, 'users', userId);

      try {
        // Fetch the current document data
        const userDoc = await getDoc(userDocRef);
        let updatedData;

        if (userDoc.exists()) {
          // Only modify the budgetData field
          const currentData = userDoc.data().budgetData || [];

          if (type === 'log') {
            const newEntry = { category: formData.category, amount: parseInt(formData.amount) };
            updatedData = [...currentData, newEntry];
            await updateDoc(userDocRef, { budgetData: updatedData });
          } else if (type === 'update') {
            updatedData = currentData.map((entry) =>
              entry.category === formData.oldCategory ? { ...entry, category: formData.newCategory } : entry
            );
            await updateDoc(userDocRef, { budgetData: updatedData });
          } else if (type === 'new') {
            const newEntry = { category: formData.newCategory, amount: 0 };
            updatedData = [...currentData, newEntry];
            await updateDoc(userDocRef, { budgetData: updatedData });
          }

          // Update state with new data
          setCatData(updatedData.map((entry) => entry.amount));
          setCatLabels(updatedData.map((entry) => entry.category));
          console.log('Data updated successfully');
        } else {
          // Create a new document with all necessary fields
          const newEntry = {
            category: formData.category,
            amount: parseInt(formData.amount),
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
          setCatData(updatedData.map((entry) => entry.amount));
          setCatLabels(updatedData.map((entry) => entry.category));
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
  
  const pieData = {
    labels: catLabels,
    datasets: [
      {
        label: 'Dollars Spent',
        data: catData,
        backgroundColor: ['#66AA11', '#FF0000', '#FFCE56', '#4BC0C0', '#36A2EB'],
        hoverBackgroundColor: ['#66AA11', '#FF0000', '#FFCE56', '#4BC0C0', '#36A2EB'],
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

  return (
    <div className="homepage-container">
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
        </div>
      </div>

      <Modal show={showModal.log} onClose={handleCloseModal}>
        <h2>Log Transaction</h2>
        <form onSubmit={(e) => handleFormSubmit(e, 'log')}>
          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Enter category" required />
          <label>Amount:</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Enter amount" required />
          <button type="submit">Submit</button>
        </form>
      </Modal>

      <Modal show={showModal.update} onClose={handleCloseModal}>
        <h2>Update Category</h2>
        <form onSubmit={(e) => handleFormSubmit(e, 'update')}>
          <label>Old Category:</label>
          <input type="text" name="oldCategory" value={formData.oldCategory} onChange={handleInputChange} placeholder="Enter old category" required />
          <label>New Category:</label>
          <input type="text" name="newCategory" value={formData.newCategory} onChange={handleInputChange} placeholder="Enter new category" required />
          <button type="submit">Update</button>
        </form>
      </Modal>

      <Modal show={showModal.new} onClose={handleCloseModal}>
        <h2>New Category</h2>
        <form onSubmit={(e) => handleFormSubmit(e, 'new')}>
          <label>Category Name:</label>
          <input type="text" name="newCategory" value={formData.newCategory} onChange={handleInputChange} placeholder="Enter category name" required />
          <button type="submit">Create</button>
        </form>
      </Modal>

      <div className="footer">
        <p>
          <a href="#">Account Info</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact</a> | 
          <a href="#">Disclaimer</a> | <a href="#">Downtime Information</a>
        </p>
      </div>
    </div>
  );
};

export default Homepage;

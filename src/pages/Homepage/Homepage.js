import React, { useState } from 'react';
import Header from '../../components/Header';
import BudgetDashboard from '../../components/BudgetDashboard';
import ActionButtons from '../../components/ActionButtons';
import Footer from '../../components/Footer';
import TutorialOverlay from '../../components/Tutorial';
import { 
  LogTransactionModal, 
  UpdateCategoryModal, 
  NewCategoryModal, 
  IncomeModal, 
  DeleteAccountModal,
  TransactionHistoryModal
} from '../../components/Modals';
import { useAuth } from '../../hooks/useAuth';
import { useBudgetData } from '../../hooks/useBudgetData';
import { useTutorial } from '../../hooks/useTutorial';
import './Homepage.css';

const Homepage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { user, handleLogout, handleDeleteAccount } = useAuth();
  const { 
    catData, 
    catLabels, 
    income, 
    transactions,
    handleFormSubmit, 
    handleClearData 
  } = useBudgetData(user?.uid);
  const { tutorial, currentStep, handleTutorialActions } = useTutorial(user?.uid);

  return (
    <div className="homepage-container">
      <Header />

      {tutorial && (
        <TutorialOverlay 
          currentStep={currentStep}
          onAction={handleTutorialActions}
        />
      )}
      
      <div className="content">
        <BudgetDashboard 
          catData={catData}
          catLabels={catLabels}
          income={income}
        />
        <ActionButtons onActionClick={setActiveModal} />
      </div>

      <LogTransactionModal 
        show={activeModal === 'log'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleFormSubmit}
        categories={catLabels}
      />

      <UpdateCategoryModal 
        show={activeModal === 'update'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleFormSubmit}
        categories={catLabels}
      />

      <NewCategoryModal 
        show={activeModal === 'new'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleFormSubmit}
      />

      <IncomeModal 
        show={activeModal === 'income'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleFormSubmit}
      />

      <DeleteAccountModal 
        show={activeModal === 'deleteAccount'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleDeleteAccount}
      />

      <TransactionHistoryModal
        show={activeModal === 'transactionHistory'}
        onClose={() => setActiveModal(null)}
        transactions={transactions}
      />

      <Footer 
        onTutorialClick={handleTutorialActions.start}
        onLogoutClick={handleLogout}
        onDeleteAccountClick={() => setActiveModal('deleteAccount')}
        onClearData={handleClearData}
      />
    </div>
  );
};

export default Homepage;
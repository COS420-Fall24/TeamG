import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Mock Firebase modules
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreateAccount Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>
    );
  };

  test('renders create account form', () => {
    renderComponent();
    
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password (6+ characters)')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('handles user input correctly', () => {
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password (6+ characters)');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('handles successful account creation', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockAuth = {};
    const mockDb = {};
    const mockDocRef = {};
    
    getAuth.mockReturnValue(mockAuth);
    getFirestore.mockReturnValue(mockDb);
    doc.mockReturnValue(mockDocRef);
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    setDoc.mockResolvedValueOnce();
    global.console.log = jest.fn();
    global.alert = jest.fn();

    renderComponent();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password (6+ characters)');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
      expect(doc).toHaveBeenCalledWith(mockDb, "users", mockUser.uid);
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          email: 'test@example.com',
          tutorial: true
        }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(global.alert).toHaveBeenCalledWith('New account created! Welcome to the Gremlin Money Club');
    });
  });

  test('handles email already in use error', async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/email-already-in-use',
      message: 'Email already in use'
    });
    global.alert = jest.fn();

    renderComponent();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password (6+ characters)');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'This email is already registered. If you have deleted this account, please try again.'
      );
    });
  });

  test('handles weak password error', async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/weak-password',
      message: 'Weak password'
    });
    global.alert = jest.fn();

    renderComponent();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password (6+ characters)');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Password must be at least 6 characters');
    });
  });
}); 

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { setDoc, getDoc } from 'firebase/firestore';

jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');
  return {
    ...originalModule,
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    setDoc: jest.fn(),
    getDoc: jest.fn(),
  };
});

import Login from './login';

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('Confirm input fields are rendered', () => {
    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();

    const loginGoogle = screen.getByText('Login with Google');
    expect(loginGoogle).toBeInTheDocument();
  });

  test('Test email/password input', () => {
    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('Test login failed with incorrect password', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });

    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButtons = screen.getAllByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(loginButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Incorrect password.');
    });
  });

  test('Test login failed with user not found', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/user-not-found' });

    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButtons = screen.getAllByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'nonexistent@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('No account associated with this email.');
    });
  });

  test('Test login failed with invalid email', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-email' });

    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButtons = screen.getAllByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please enter a valid email address.');
    });
  });

  test('Test login failed with unknown error', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Login failed'));

    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButtons = screen.getAllByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login failed.');
    });
  });

  test('Test login success', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { email: 'admin@gmail.com' } });
    const authorized_true = jest.fn();

    render(
      <MemoryRouter>
        <Login authorized_true={authorized_true} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButtons = screen.getAllByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButtons[0]);

    await waitFor(() => {
      expect(authorized_true).toHaveBeenCalled();
    });
  });

  test('Test Google login success with existing user', async () => {
    signInWithPopup.mockResolvedValue({
      user: { uid: '123', email: 'admin@gmail.com', displayName: 'Admin' },
    });
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ createdAt: new Date() }),
    });
    const authorized_true = jest.fn();

    render(
      <MemoryRouter>
        <Login authorized_true={authorized_true} />
      </MemoryRouter>
    );

    const googleLoginButtons = screen.getAllByRole('button', { name: /login with google/i });

    fireEvent.click(googleLoginButtons[0]);

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'admin@gmail.com',
          name: 'Admin',
          createdAt: expect.any(Date),
        }),
        { merge: true }
      );
      expect(authorized_true).toHaveBeenCalled();
    });
  });

  test('Test Google login success with new user', async () => {
    signInWithPopup.mockResolvedValue({
      user: { uid: '123', email: 'admin@gmail.com', displayName: 'Admin' },
    });
    getDoc.mockResolvedValue({
      exists: () => false,
    });
    const authorized_true = jest.fn();

    render(
      <MemoryRouter>
        <Login authorized_true={authorized_true} />
      </MemoryRouter>
    );

    const googleLoginButtons = screen.getAllByRole('button', { name: /login with google/i });

    fireEvent.click(googleLoginButtons[0]);

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'admin@gmail.com',
          name: 'Admin',
          createdAt: expect.any(Date),
        })
      );
      expect(authorized_true).toHaveBeenCalled();
    });
  });

  test('Test Google login failed', async () => {
    signInWithPopup.mockRejectedValue(new Error('Google login failed'));
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    const googleLoginButtons = screen.getAllByRole('button', { name: /login with google/i });

    fireEvent.click(googleLoginButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Google Login Failed');
    });
  });
  
});

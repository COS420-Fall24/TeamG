import { render, screen, fireEvent } from '@testing-library/react';
import Login from './login';
import { MemoryRouter } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

describe('Login Component', () => {
  test('Confirm input fields are rendered', () => {
    render(
      <MemoryRouter>
        <Login authorized_true={() => {}} />
      </MemoryRouter>
    );

    // Check if the email input is in the document
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();

    // Check if the password input is in the document
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();

    // Check that login with Google is rendered
    const loginGoogle = screen.getByText('Login with Google')
    expect(loginGoogle).toBeInTheDocument();
  })},

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
  }));

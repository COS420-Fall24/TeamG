import { render, screen, fireEvent } from '@testing-library/react';
import Login from './login';
import { MemoryRouter } from 'react-router-dom';

describe('Login Component', () => {
  test('renders email and password inputs', () => {
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
  })});

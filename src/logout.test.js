import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Homepage from './homepage';
import { MemoryRouter } from 'react-router-dom';

describe('Logout Tests', () => {
    test('Check if logout button is rendered', () => {
        render(
            <MemoryRouter>
              <Homepage authorized_true={() => {}} />
            </MemoryRouter>
          );

        // Check if logout button is rendered
        const logoutButton = screen.getByText('Logout');
        expect(logoutButton).toBeInTheDocument();
    });

    test('Test logout button', async() => {
        render(
            <MemoryRouter>
              <Homepage authorized_true={() => {}} />
            </MemoryRouter>
          );

        // Check if logout button is rendered
        const logoutButton = screen.getByText('Logout');
        expect(logoutButton).toBeInTheDocument();

        // Logout of account, ensure you land at login page
        fireEvent.click(logoutButton);
        // TODO: make sure this lands at login page
    });

});
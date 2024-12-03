import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act }  from 'react';
import Homepage from './homepage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('Homepage Component', () => {
  const mockUserDoc = {
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      budgetData: [{ category: 'Food', amount: 100, type: 'category' }],
      tutorial: false,
    }),
  };

  beforeEach(() => {
    getAuth.mockReturnValue({
      currentUser: { uid: 'testUserId', email: 'test@example.com', displayName: 'Test User' },
    });
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback({ uid: 'testUserId', email: 'test@example.com', displayName: 'Test User' });
    });

    getDoc.mockResolvedValue(mockUserDoc);
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        budgetData: [],
        tutorial: false,
      }),
    });
    jest.clearAllMocks();
  });

  test('renders the homepage component', async () => {
    render(<Homepage />);
    await waitFor(() => {
      expect(screen.getByText('Money Gremlin')).toBeInTheDocument();
    });
  });

  test('opens and closes the log transaction modal', async () => {
    render(<Homepage />);
    fireEvent.click(screen.getAllByTitle('Log a new transaction')[0]);
    expect(screen.getAllByText('Log Transaction')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Submit')[0]);
    await waitFor(() => expect(screen.queryByText('Enter memo')).not.toBeInTheDocument());
  });

  test('opens and closes the update category modal', async () => {
    render(<Homepage />);
    fireEvent.click(screen.getByTitle('Update an existing category'));
    expect(screen.getAllByText('Update Category')[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => expect(screen.queryByText('Enter new category name')).not.toBeInTheDocument());
  });

  test('opens and closes the new category modal', async () => {
    render(<Homepage />);
    fireEvent.click(screen.getByTitle('Create a new category'));
    expect(screen.getAllByText('New Category')[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('Create'));
    await waitFor(() => expect(screen.queryByText('Enter category name')).not.toBeInTheDocument());
  });

  test('opens and closes the change income modal', async () => {
    render(<Homepage />);
    fireEvent.click(screen.getByTitle('Change Income'));
    expect(screen.getAllByText('Change Income')[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(screen.queryByText('Enter income amount')).not.toBeInTheDocument());
  });

  test('fetches and sets user data on authentication', async () => {
    render(<Homepage />);
    await waitFor(() => {
      expect(screen.getByText('Money Gremlin')).toBeInTheDocument();
      expect(screen.getAllByText('Budget Dashboard')[0]).toBeInTheDocument();
    });
  });

  test('fetches and sets user data on authentication', async () => {
    render(<Homepage />);
    await waitFor(() => {
      expect(screen.getByText('Money Gremlin')).toBeInTheDocument();
      expect(screen.getAllByText('Budget Dashboard')[0]).toBeInTheDocument();
    });
  });

  test('handles tutorial navigation', async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        email: 'eric.jestel@maine.edu',
        name: 'Test User',
        createdAt: new Date(),
        budgetData: [],
        tutorial: true,
      }),
    });


    await React.act( async () => {
      render(<Homepage />);
    });

    //Confirm that tutorial isn't open
    expect(screen.queryByText('Next')).not.toBeInTheDocument();


    expect(screen.getByText('Tutorial')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Tutorial'));
    

    expect(screen.queryByText('Next')).not.toBeInTheDocument();

    await waitFor( () => {expect(screen.getByText('Next')).toBeInTheDocument()
    });
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('Next')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Previous')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('Exit Tutorial')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Exit Tutorial'));
    await waitFor(() => expect(screen.queryByText('Exit Tutorial')).not.toBeInTheDocument());
  }); 

  test('clears data successfully', async () => {
    render(<Homepage />);
    fireEvent.click(screen.getByText('Clear Data'));
    await waitFor(() => expect(screen.queryByText('No data available to display')).toBeInTheDocument());
  });

  test('displays no data message when there is no budget data', async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        budgetData: [],
        tutorial: false,
      }),
    });

    render(<Homepage />);
    await waitFor(() => expect(screen.getByText('No data available to display')).toBeInTheDocument());
  });

  test('displays remaining amount correctly', async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        budgetData: [{ category: 'Food', amount: 100, type: 'category' }, { category: 'Income', amount: 1000, type: 'income' }],
        tutorial: false,
      }),
    });

    render(<Homepage />);
    waitFor(async () => {
      expect(await screen.findByText((content) => content.includes('Remaining'), { exact: false })).toBeInTheDocument();
      expect(screen.getByText('900')).toBeInTheDocument();
    });
  });
});
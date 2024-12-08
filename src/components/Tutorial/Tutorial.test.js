import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import Homepage from '../../pages/Homepage';
import TutorialOverlay from './TutorialOverlay';

describe('Tutorial', () => {
    const mockOnAction = {
        prev: jest.fn(),
        next: jest.fn(),
        exit: jest.fn()
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
  
    describe('Test Components', () => {
      test('Render tutorial on homepage', () => {
        render(<Homepage />);
        expect(screen.getByText('Tutorial')).toBeInTheDocument();
      });

      test('Test first step appears', () => {
        render(<TutorialOverlay onAction={mockOnAction} />);
        expect(screen.getByText('Step 1: Set Up Income')).toBeInTheDocument();
      });
  
      test('Test next button', async() => {
        render(<TutorialOverlay onAction={mockOnAction} />);
        expect(screen.getByText('Step 1: Set Up Income')).toBeInTheDocument();

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        await waitFor(() => {
          expect(screen.getByText('Step 2: Create a Category')).toBeInTheDocument();
        });
      });

      test('Test Previous button', async() => {
        render(<TutorialOverlay onAction={mockOnAction} />);
        expect(screen.getByText('Step 1: Set Up Income')).toBeInTheDocument();

        const nextButton = screen.getByText('Next');
        const prevButton = screen.getByText('Previous');
        
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByText('Step 2: Create a Category')).toBeInTheDocument();
        });

        fireEvent.click(prevButton);
        await waitFor(() => {
            expect(screen.getByText('Step 1: Set Up Income')).toBeInTheDocument();
        });
      });
    });
  });
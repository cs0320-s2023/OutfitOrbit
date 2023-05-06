import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import App from '../frontend/App.js';

describe('App component', () => {
  it('renders the navbar', () => {
    render(<App />);
    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();
  });

  it('displays personalized recommendations when the user is signed in and GPTresponse is available', () => {
    const mockWardrobe = [
      {
        id: '1',
        name: 'Shirt',
        type: 'top',
        color: 'blue',
        material: 'cotton',
        brand: 'Levi\'s',
        occasion: 'casual'
      },
      {
        id: '2',
        name: 'Jeans',
        type: 'bottom',
        color: 'black',
        material: 'denim',
        brand: 'Wrangler',
        occasion: 'formal'
      }
    ];
    const mockGPTResponse = JSON.stringify(mockWardrobe);

    render(<App isSignedIn={true} GPTresponse={mockGPTResponse} />);

    const wardrobeTitleElement = screen.getByText('Your Outfit Selection');
    expect(wardrobeTitleElement).toBeInTheDocument();

    const wardrobeElements = screen.getAllByRole('img');
    expect(wardrobeElements).toHaveLength(mockWardrobe.length);
  });

  it('displays a message to prompt the user to log in when not signed in', () => {
    render(<App isSignedIn={false} />);

    const loginMessageElement = screen.getByText('Please log in to see your wardrobe!');
    expect(loginMessageElement).toBeInTheDocument();
  });

  it('displays a message to prompt the user to enter a prompt when GPTresponse is empty', () => {
    render(<App isSignedIn={true} GPTresponse="" />);

    const promptMessageElement = screen.getByText('Enter a prompt for a personalized recommendation');
    expect(promptMessageElement).toBeInTheDocument();
  });

  it('displays a form to add clothing items to the wardrobe when "Add Clothing to your Closet!" button is clicked', () => {
    render(<App isSignedIn={true} />);

    const addButtonElement = screen.getByText('Add Clothing to your Closet!');
    userEvent.click(addButtonElement);

    const addFormElement = screen.getByLabelText('Name');
    expect(addFormElement).toBeInTheDocument();
  });
});
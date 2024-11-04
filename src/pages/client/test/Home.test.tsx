// Home.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home'; // Adjust the import path as necessary

describe('Home Component', () => {
  beforeAll(() => {
    // Mocking document.fonts to avoid TypeError during tests
    (document.fonts as any) = {
      ready: Promise.resolve(),
    };
  });

  test('renders welcome message and button', async () => {
    // Render the component
    render(<Home />);

    // Wait for the font to load and then check if the welcome message is visible
    const welcomeMessage = await screen.findByText(/Welcome To the/i);
    expect(welcomeMessage).toBeVisible();

    // Check if the "About us" button is in the document
    const aboutUsButton = screen.getByRole('button', { name: /About us/i });
    expect(aboutUsButton).toBeInTheDocument();
  });

  test('displays the Banner when the button is clicked', async () => {
    render(<Home />);

    // Click the "About us" button
    const aboutUsButton = await screen.findByRole('button', {
      name: /About us/i,
    });
    fireEvent.click(aboutUsButton);

    // Check if the Banner component is displayed
    const bannerContent = await screen.findByText(/A feast of Hearty/i); // Adjust this to match content in your Banner component
    expect(bannerContent).toBeVisible();
  });
});

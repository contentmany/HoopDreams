import { render, screen } from '@testing-library/react';
import React from 'react';

function Dummy() { return <div>Hoop Dreams</div>; }

test('renders placeholder text', () => {
  render(<Dummy />);
  expect(screen.getByText(/Hoop Dreams/i)).toBeTruthy();
});

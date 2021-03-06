import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders but doesn\'t exist', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn bupkis/i);
  expect(linkElement).toBeInTheDocument();
});

describe('we are testing this thing but it\'s nested', () => {
  test('nested renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
  
  test('nested renders but doesn\'t exist', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn bupkis/i);
    expect(linkElement).toBeInTheDocument();
  });
});

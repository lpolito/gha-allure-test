import { render, screen } from '@testing-library/react';
import { describe } from 'jest-circus';
import App from './App';

test('2 renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('2 renders but doesn\'t exist', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn bupkis/i);
  expect(linkElement).toBeInTheDocument();
});

describe('2 we are testing this thing but it\'s nested', () => {
  test('2 nested renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
  
  test('2 nested renders but doesn\'t exist', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn bupkis/i);
    expect(linkElement).toBeInTheDocument();
  });
});

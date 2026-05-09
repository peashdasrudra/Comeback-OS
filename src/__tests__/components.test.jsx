import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders with variant styles', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('bg-primary/20');
  });

  it('renders different sizes', () => {
    const { container } = render(<Badge size="md">Medium</Badge>);
    expect(container.firstChild).toHaveClass('px-3 py-1 text-xs');
  });
});

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole('button').click();
    expect(clicked).toBe(true);
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    expect(container.firstChild).toHaveClass('bg-secondary');
  });
});

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies glass variant', () => {
    const { container } = render(<Card variant="glass">Glass Card</Card>);
    expect(container.firstChild).toHaveClass('bg-white/5');
  });

  it('applies hover effect', () => {
    const { container } = render(<Card hover={true}>Hover Card</Card>);
    expect(container.firstChild).toHaveAttribute('whileHover');
  });
});

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const { container } = render(<Input error />);
    expect(container.querySelector('input')).toHaveClass('border-red');
  });
});
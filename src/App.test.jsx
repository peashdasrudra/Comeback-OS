import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardOverview from './components/features/DashboardOverview';

describe('DashboardOverview Component', () => {
  const defaultProps = {
    T: {
      green: '#00ff88',
      blue: '#00aaff',
      pink: '#ff0088',
      orange: '#ff8800',
      gold: '#ffd700',
      red: '#ff4444',
      bg2: '#111',
      border: '#333',
      muted: '#888',
      bright: '#fff',
      text: '#ccc',
      cyan: '#00ffff'
    },
    C: (style) => style,
    mono: { fontFamily: 'monospace' },
    orb: { fontFamily: 'Orbitron' },
    raj: { fontFamily: 'Rajdhani' },
    tab: 'home',
    setTab: vi.fn(),
    xp: 250,
    streak: 5,
    waterCount: 3,
    dailyScore: 85,
    tasksDone: { task1: true, task2: false },
    weightLog: [{ weight: 62 }, { weight: 65 }],
    mood: '😎',
    levelTitle: 'Elite',
    level: 4
  };

  it('renders user details correctly', () => {
    render(<DashboardOverview {...defaultProps} />);
    expect(screen.getByText('PEASH RUDRA')).toBeInTheDocument();
    expect(screen.getByText(/MSc CSE Candidate/i)).toBeInTheDocument();
    expect(screen.getByText(/Md. Riaz Mahmud/i)).toBeInTheDocument();
  });

  it('renders the core metrics based on props', () => {
    render(<DashboardOverview {...defaultProps} />);
    // Check level
    expect(screen.getByText('LV 4')).toBeInTheDocument();
    expect(screen.getByText('Elite')).toBeInTheDocument();
    // Check stats strip
    expect(screen.getByText('5d')).toBeInTheDocument(); // Streak
    expect(screen.getByText('85')).toBeInTheDocument(); // Score
    expect(screen.getByText('3/8')).toBeInTheDocument(); // Water
    expect(screen.getByText('65kg')).toBeInTheDocument(); // Weight
  });

  it('allows clicking quick actions and calls setTab', () => {
    render(<DashboardOverview {...defaultProps} />);
    const tasksBtn = screen.getByText('Tasks');
    fireEvent.click(tasksBtn);
    expect(defaultProps.setTab).toHaveBeenCalledWith('tasks');
  });

  it('handles empty props gracefully without crashing', () => {
    // Override some with nulls to test resilience
    const emptyProps = {
      ...defaultProps,
      xp: null,
      streak: null,
      waterCount: null,
      dailyScore: null,
      tasksDone: null,
      weightLog: null,
      mood: null,
      level: null,
      levelTitle: null
    };
    render(<DashboardOverview {...emptyProps} />);
    expect(screen.getByText('PEASH RUDRA')).toBeInTheDocument();
  });
});

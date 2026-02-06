import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard role-based rendering', () => {
  test('viewer sees basic only', () => {
    render(<Dashboard role="viewer" />);
    expect(screen.getByTestId('basic-kpis')).toBeInTheDocument();
    expect(screen.queryByTestId('advanced-analytics')).not.toBeInTheDocument();
    expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('viewer-message')).toBeInTheDocument();
  });

  test('analyst sees advanced + upload', () => {
    render(<Dashboard role="analyst" />);
    expect(screen.getByTestId('advanced-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-section')).not.toBeInTheDocument();
  });

  test('admin sees full + admin section', () => {
    render(<Dashboard role="admin" />);
    expect(screen.getByTestId('advanced-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    expect(screen.getByTestId('admin-section')).toBeInTheDocument();
  });
});
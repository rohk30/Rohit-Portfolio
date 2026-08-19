import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShotNavigation from './ShotNavigation';
import { SHOT_TARGETS } from '../../config/shotNavigation';

describe('ShotNavigation', () => {
  const mockOnShotSelect = vi.fn();

  const defaultProps = {
    visible: true,
    shots: SHOT_TARGETS,
    onShotSelect: mockOnShotSelect,
    compact: false,
  };

  beforeEach(() => {
    mockOnShotSelect.mockClear();
  });

  describe('rendering', () => {
    it('renders all shot targets when visible', () => {
      render(<ShotNavigation {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(SHOT_TARGETS.length);
    });

    it('renders no buttons when not visible', () => {
      render(<ShotNavigation {...defaultProps} visible={false} />);
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('renders shot labels', () => {
      render(<ShotNavigation {...defaultProps} />);
      expect(screen.getByText('Cover Drive')).toBeInTheDocument();
      expect(screen.getByText('Pull Shot')).toBeInTheDocument();
      expect(screen.getByText('Straight Drive')).toBeInTheDocument();
      expect(screen.getByText('Flick')).toBeInTheDocument();
      expect(screen.getByText('Caught at Slip')).toBeInTheDocument();
    });

    it('displays "Caught your attention?" sublabel for Contact shot', () => {
      render(<ShotNavigation {...defaultProps} />);
      expect(screen.getByText('Caught your attention?')).toBeInTheDocument();
    });

    it('renders navigation landmark', () => {
      render(<ShotNavigation {...defaultProps} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('aria-labels', () => {
    it('includes both destination and shot name in aria-labels', () => {
      render(<ShotNavigation {...defaultProps} />);
      expect(screen.getByLabelText('Navigate to Experience section via Cover drive')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Projects section via Pull shot')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Research section via Straight drive')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to About section via Flick')).toBeInTheDocument();
      expect(screen.getByLabelText('Navigate to Contact section via Caught at slip')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onShotSelect when a target is clicked', () => {
      render(<ShotNavigation {...defaultProps} />);
      fireEvent.click(screen.getByText('Cover Drive'));
      expect(mockOnShotSelect).toHaveBeenCalledWith(SHOT_TARGETS[0]);
    });

    it('calls onShotSelect when Enter key is pressed', () => {
      render(<ShotNavigation {...defaultProps} />);
      const button = screen.getByLabelText('Navigate to Experience section via Cover drive');
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockOnShotSelect).toHaveBeenCalledWith(SHOT_TARGETS[0]);
    });

    it('calls onShotSelect when Space key is pressed', () => {
      render(<ShotNavigation {...defaultProps} />);
      const button = screen.getByLabelText('Navigate to Projects section via Pull shot');
      fireEvent.keyDown(button, { key: ' ' });
      expect(mockOnShotSelect).toHaveBeenCalledWith(SHOT_TARGETS[1]);
    });

    it('does not call onShotSelect for other keys', () => {
      render(<ShotNavigation {...defaultProps} />);
      const button = screen.getByLabelText('Navigate to Experience section via Cover drive');
      fireEvent.keyDown(button, { key: 'a' });
      expect(mockOnShotSelect).not.toHaveBeenCalled();
    });
  });

  describe('touch targets', () => {
    it('ensures buttons have minimum 44x44px dimensions via inline styles', () => {
      render(<ShotNavigation {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.style.minWidth).toBe('44px');
        expect(button.style.minHeight).toBe('44px');
      });
    });
  });

  describe('positioning', () => {
    it('positions targets at their configured field positions', () => {
      render(<ShotNavigation {...defaultProps} />);
      const coverDrive = screen.getByLabelText('Navigate to Experience section via Cover drive');
      expect(coverDrive.style.left).toBe('72%');
      expect(coverDrive.style.top).toBe('28%');
    });
  });

  describe('compact mode', () => {
    it('renders with smaller padding in compact mode', () => {
      render(<ShotNavigation {...defaultProps} compact={true} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons[0].style.padding).toBe('6px 10px');
    });
  });
});

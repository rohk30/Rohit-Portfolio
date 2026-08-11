import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../../components/ui/Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders the text content', () => {
      render(<Badge text="Python" />);
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    it('renders as a span element', () => {
      render(<Badge text="React" />);
      const badge = screen.getByText('React');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('variants', () => {
    it('applies default variant styling by default', () => {
      render(<Badge text="Default" />);
      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('bg-slate-800/60');
      expect(badge).toHaveClass('text-gray-300');
      expect(badge).toHaveClass('border-white/10');
    });

    it('applies accent variant styling when specified', () => {
      render(<Badge text="Accent" variant="accent" />);
      const badge = screen.getByText('Accent');
      expect(badge).toHaveClass('bg-blue-500/20');
      expect(badge).toHaveClass('text-blue-400');
      expect(badge).toHaveClass('border-blue-400/30');
    });

    it('falls back to default variant for invalid variant', () => {
      render(<Badge text="Fallback" variant="invalid" />);
      const badge = screen.getByText('Fallback');
      expect(badge).toHaveClass('bg-slate-800/60');
    });
  });

  describe('sizes', () => {
    it('applies small size styling by default', () => {
      render(<Badge text="Small" />);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('text-xs');
    });

    it('applies small size styling when specified', () => {
      render(<Badge text="Small" size="sm" />);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('text-xs');
    });

    it('applies medium size styling when specified', () => {
      render(<Badge text="Medium" size="md" />);
      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-3');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('text-sm');
    });

    it('falls back to small size for invalid size', () => {
      render(<Badge text="Fallback" size="invalid" />);
      const badge = screen.getByText('Fallback');
      expect(badge).toHaveClass('px-2.5');
    });
  });

  describe('custom className', () => {
    it('applies additional className when provided', () => {
      render(<Badge text="Custom" className="custom-class" />);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-class');
    });

    it('merges custom className with base classes', () => {
      render(<Badge text="Merged" className="my-custom-class" />);
      const badge = screen.getByText('Merged');
      expect(badge).toHaveClass('my-custom-class');
      expect(badge).toHaveClass('rounded-full');
    });
  });

  describe('base styling', () => {
    it('applies rounded-full for pill shape', () => {
      render(<Badge text="Pill" />);
      const badge = screen.getByText('Pill');
      expect(badge).toHaveClass('rounded-full');
    });

    it('applies inline-flex for layout', () => {
      render(<Badge text="Flex" />);
      const badge = screen.getByText('Flex');
      expect(badge).toHaveClass('inline-flex');
    });

    it('applies transition for smooth hover effects', () => {
      render(<Badge text="Transition" />);
      const badge = screen.getByText('Transition');
      expect(badge).toHaveClass('transition-colors');
      expect(badge).toHaveClass('duration-200');
    });
  });
});

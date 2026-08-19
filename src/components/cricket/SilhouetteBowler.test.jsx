import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SilhouetteBowler from './SilhouetteBowler';

describe('SilhouetteBowler', () => {
  const renderInSvg = (props = {}) => {
    const { container } = render(
      <svg>
        <SilhouetteBowler {...props} />
      </svg>
    );
    return container.querySelector('svg');
  };

  it('renders a <g> element with aria-hidden="true"', () => {
    const svg = renderInSvg();
    const group = svg.querySelector('g');
    expect(group).not.toBeNull();
    expect(group.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses cubic bezier path elements with no circle, rect, or polygon elements', () => {
    const svg = renderInSvg();
    const group = svg.querySelector('g');

    // No geometric primitives
    expect(group.querySelectorAll('circle').length).toBe(0);
    expect(group.querySelectorAll('rect').length).toBe(0);
    expect(group.querySelectorAll('polygon').length).toBe(0);

    // All figure contours are <path> elements with cubic bezier commands (C or c)
    const paths = group.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(5);
    expect(paths.length).toBeLessThanOrEqual(8);

    paths.forEach((path) => {
      const d = path.getAttribute('d');
      expect(d).toBeTruthy();
      // Each path should contain at least one cubic bezier command (C or c)
      expect(d).toMatch(/[Cc]\s*[-\d]/);
    });
  });

  it('applies custom fill color to all path elements', () => {
    const customFill = '#ff0000';
    const svg = renderInSvg({ fill: customFill });
    const group = svg.querySelector('g');

    const paths = group.querySelectorAll('path');
    paths.forEach((el) => expect(el.getAttribute('fill')).toBe(customFill));
  });

  it('uses dark silhouette fill by default', () => {
    const svg = renderInSvg();
    const group = svg.querySelector('g');
    const paths = group.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
    paths.forEach((path) => {
      expect(path.getAttribute('fill')).toBe('#1a1a2e');
    });
  });

  it('accepts className prop', () => {
    const svg = renderInSvg({ className: 'test-bowler' });
    const group = svg.querySelector('g');
    expect(group.classList.contains('test-bowler')).toBe(true);
  });

  it('has a bounding box within 40x60 units (path coordinates check)', () => {
    const svg = renderInSvg();
    const group = svg.querySelector('g');
    const paths = group.querySelectorAll('path');

    // Extract all numeric coordinates from path data
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    paths.forEach((path) => {
      const d = path.getAttribute('d');
      // Match all number pairs (x,y coordinates) in path data
      const numbers = d.match(/-?\d+\.?\d*/g);
      if (numbers) {
        for (let i = 0; i < numbers.length; i += 2) {
          if (i + 1 < numbers.length) {
            const xVal = parseFloat(numbers[i]);
            const yVal = parseFloat(numbers[i + 1]);
            minX = Math.min(minX, xVal);
            maxX = Math.max(maxX, xVal);
            minY = Math.min(minY, yVal);
            maxY = Math.max(maxY, yVal);
          }
        }
      }
    });

    const width = maxX - minX;
    const height = maxY - minY;

    expect(width).toBeLessThanOrEqual(40);
    expect(height).toBeLessThanOrEqual(60);
  });
});

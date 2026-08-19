import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CricketGroundSVG from '../../components/cricket/CricketGroundSVG';

describe('CricketGroundSVG', () => {
  it('renders with role="img" and aria-label', () => {
    const { container } = render(<CricketGroundSVG />);
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBeTruthy();
    expect(svg.getAttribute('aria-label')).toContain('cricket field');
  });

  it('renders outfield ellipse', () => {
    const { container } = render(<CricketGroundSVG />);
    const outfield = container.querySelector('[data-layer="outfield"]');

    expect(outfield).not.toBeNull();
    expect(outfield.tagName).toBe('ellipse');
  });

  it('renders boundary rope ellipse', () => {
    const { container } = render(<CricketGroundSVG />);
    const boundary = container.querySelector('[data-layer="boundary"]');

    expect(boundary).not.toBeNull();
    expect(boundary.tagName).toBe('ellipse');
    expect(boundary.getAttribute('fill')).toBe('none');
    expect(boundary.getAttribute('stroke')).toBeTruthy();
  });

  it('renders 30-yard circle by default', () => {
    const { container } = render(<CricketGroundSVG />);
    const circle = container.querySelector('[data-layer="30-yard-circle"]');

    expect(circle).not.toBeNull();
    expect(circle.tagName).toBe('circle');
    expect(circle.getAttribute('stroke-dasharray')).toBeTruthy();
  });

  it('hides 30-yard circle when show30YardCircle is false', () => {
    const { container } = render(<CricketGroundSVG show30YardCircle={false} />);
    const circle = container.querySelector('[data-layer="30-yard-circle"]');

    expect(circle).toBeNull();
  });

  it('renders pitch rectangle', () => {
    const { container } = render(<CricketGroundSVG />);
    const pitch = container.querySelector('[data-layer="pitch"]');

    expect(pitch).not.toBeNull();
    expect(pitch.tagName).toBe('rect');
  });

  it('renders crease lines by default', () => {
    const { container } = render(<CricketGroundSVG />);
    const creaseGroup = container.querySelector('[data-layer="crease-lines"]');

    expect(creaseGroup).not.toBeNull();
    // Should have popping, bowling, and return creases for both ends
    const lines = creaseGroup.querySelectorAll('line');
    expect(lines.length).toBe(8);
  });

  it('hides crease lines when showCreaseLines is false', () => {
    const { container } = render(<CricketGroundSVG showCreaseLines={false} />);
    const creaseGroup = container.querySelector('[data-layer="crease-lines"]');

    expect(creaseGroup).toBeNull();
  });

  it('includes decorative marks with aria-hidden', () => {
    const { container } = render(<CricketGroundSVG />);
    const decorative = container.querySelector('[data-layer="decorative"]');

    expect(decorative).not.toBeNull();
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
  });

  it('accepts custom width, height, and className', () => {
    const { container } = render(
      <CricketGroundSVG width="400" height="300" className="my-ground" />
    );
    const svg = container.querySelector('svg');

    expect(svg.getAttribute('width')).toBe('400');
    expect(svg.getAttribute('height')).toBe('300');
    expect(svg.classList.contains('my-ground')).toBe(true);
  });

  it('uses a viewBox for proportional scaling', () => {
    const { container } = render(<CricketGroundSVG />);
    const svg = container.querySelector('svg');

    expect(svg.getAttribute('viewBox')).toBeTruthy();
    expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
  });

  it('renders with compact mode adjustments', () => {
    const { container } = render(<CricketGroundSVG compact />);
    const circle = container.querySelector('[data-layer="30-yard-circle"]');

    // In compact mode, 30-yard circle has a smaller radius
    expect(circle).not.toBeNull();
    const r = parseFloat(circle.getAttribute('r'));
    expect(r).toBe(100); // compact radius is 100 vs 120 for normal
  });

  it('defaults width and height to 100%', () => {
    const { container } = render(<CricketGroundSVG />);
    const svg = container.querySelector('svg');

    expect(svg.getAttribute('width')).toBe('100%');
    expect(svg.getAttribute('height')).toBe('100%');
  });
});

// Feature: cricket-visual-overhaul, Property 3: Sunset Gradient Text Contrast
/**
 * Property-based test for Sunset Gradient Text Contrast
 *
 * **Property 3: Sunset Gradient Text Contrast**
 *
 * For any position along the sunset sky gradient (from 0% to 100%), the
 * interpolated background color at that position SHALL maintain a minimum
 * 4.5:1 contrast ratio with normal-size Cream text (#f5f0e8), and a minimum
 * 3:1 contrast ratio with large Cream text.
 *
 * **Validates: Requirements 2.8**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

// --- Gradient Definition ---
// From CSS: linear-gradient(to top, hsl(40, 75%, 22%) 0%, hsl(25, 70%, 25%) 30%, hsl(335, 45%, 20%) 60%, hsl(255, 50%, 12%) 100%)
const GRADIENT_STOPS = [
  { position: 0, h: 40, s: 75, l: 22 },
  { position: 30, h: 25, s: 70, l: 25 },
  { position: 60, h: 335, s: 45, l: 20 },
  { position: 100, h: 255, s: 50, l: 12 },
];

// Cream text color
const CREAM_HEX = '#f5f0e8';

// WCAG thresholds
const WCAG_AA_NORMAL_TEXT = 4.5;
const WCAG_AA_LARGE_TEXT = 3.0;

// --- Color Conversion Utilities ---

/**
 * Convert HSL to RGB.
 * H: 0-360, S: 0-100, L: 0-100
 * Returns { r, g, b } with values 0-255
 */
function hslToRgb(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r1, g1, b1;

  if (h >= 0 && h < 60) {
    [r1, g1, b1] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r1, g1, b1] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r1, g1, b1] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r1, g1, b1] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r1, g1, b1] = [x, 0, c];
  } else {
    [r1, g1, b1] = [c, 0, x];
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/**
 * Parse a hex color string to RGB components.
 */
function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}

/**
 * Interpolate the gradient color at a given position (0-100).
 * Finds the two surrounding stops and linearly interpolates RGB values.
 */
function interpolateGradientColor(position) {
  // Clamp position
  const pos = Math.max(0, Math.min(100, position));

  // Find the two stops surrounding this position
  let lowerStop = GRADIENT_STOPS[0];
  let upperStop = GRADIENT_STOPS[GRADIENT_STOPS.length - 1];

  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    if (pos >= GRADIENT_STOPS[i].position && pos <= GRADIENT_STOPS[i + 1].position) {
      lowerStop = GRADIENT_STOPS[i];
      upperStop = GRADIENT_STOPS[i + 1];
      break;
    }
  }

  // Calculate interpolation factor (0-1) between the two stops
  const range = upperStop.position - lowerStop.position;
  const t = range === 0 ? 0 : (pos - lowerStop.position) / range;

  // Convert both stops to RGB
  const lowerRgb = hslToRgb(lowerStop.h, lowerStop.s, lowerStop.l);
  const upperRgb = hslToRgb(upperStop.h, upperStop.s, upperStop.l);

  // Linearly interpolate RGB values
  return {
    r: Math.round(lowerRgb.r + (upperRgb.r - lowerRgb.r) * t),
    g: Math.round(lowerRgb.g + (upperRgb.g - lowerRgb.g) * t),
    b: Math.round(lowerRgb.b + (upperRgb.b - lowerRgb.b) * t),
  };
}

/**
 * Calculate WCAG 2.1 relative luminance from RGB values (0-255).
 */
function relativeLuminanceFromRgb(r, g, b) {
  const linearize = (channel) => {
    const srgb = channel / 255;
    return srgb <= 0.04045
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculate WCAG 2.1 contrast ratio between two RGB colors.
 */
function contrastRatioRgb(rgb1, rgb2) {
  const l1 = relativeLuminanceFromRgb(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminanceFromRgb(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// --- Tests ---

describe('Sunset Gradient Text Contrast - Property 3', () => {
  const creamRgb = hexToRgb(CREAM_HEX);

  /**
   * **Validates: Requirements 2.8**
   *
   * For any position along the sunset sky gradient (0% to 100%),
   * the interpolated background color SHALL maintain a minimum 4.5:1
   * contrast ratio with normal-size Cream text (#f5f0e8).
   */
  test('normal-size Cream text meets 4.5:1 contrast at any gradient position', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true }),
        (position) => {
          const bgColor = interpolateGradientColor(position);
          const ratio = contrastRatioRgb(creamRgb, bgColor);

          expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
        }
      ),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 2.8**
   *
   * For any position along the sunset sky gradient (0% to 100%),
   * the interpolated background color SHALL maintain a minimum 3:1
   * contrast ratio with large Cream text (#f5f0e8).
   */
  test('large Cream text meets 3:1 contrast at any gradient position', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true }),
        (position) => {
          const bgColor = interpolateGradientColor(position);
          const ratio = contrastRatioRgb(creamRgb, bgColor);

          expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
        }
      ),
      { numRuns: 200 }
    );
  });

  /**
   * Verify contrast at exact gradient stop positions (boundary checks).
   */
  test('contrast meets 4.5:1 at each defined gradient stop', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...GRADIENT_STOPS.map((s) => s.position)),
        (position) => {
          const bgColor = interpolateGradientColor(position);
          const ratio = contrastRatioRgb(creamRgb, bgColor);

          expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
        }
      ),
      { numRuns: 100 }
    );
  });
});

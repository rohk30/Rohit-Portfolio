// Feature: cricket-visual-overhaul, Property 8: Glass Card Composited Contrast
/**
 * Property-based test for Glass Card Composited Contrast
 *
 * **Property 8: Glass Card Composited Contrast**
 *
 * For any position along the sunset gradient background, the effective glass card
 * surface color (computed as `--glass-card-bg` alpha-composited over the gradient
 * color at that position) SHALL maintain at least a 4.5:1 WCAG contrast ratio
 * with Cream text (#f5f0e8) rendered on the card.
 *
 * **Validates: Requirements 6.6**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

// --- Color Constants ---

// Glass card background: rgba(26, 92, 46, 0.40) (pitch-green derived, 40% opacity)
const GLASS_CARD_BG = { r: 26, g: 92, b: 46, a: 0.40 };

// Cream text color: #f5f0e8
const CREAM_TEXT = { r: 0xf5, g: 0xf0, b: 0xe8 };

// Sunset gradient color stops (HSL converted to RGB)
// linear-gradient(to top, hsl(40, 75%, 22%) 0%, hsl(25, 70%, 25%) 30%, hsl(335, 45%, 20%) 60%, hsl(255, 50%, 12%) 100%)
const GRADIENT_STOPS = [
  { position: 0, hsl: { h: 40, s: 75, l: 22 } },
  { position: 30, hsl: { h: 25, s: 70, l: 25 } },
  { position: 60, hsl: { h: 335, s: 45, l: 20 } },
  { position: 100, hsl: { h: 255, s: 50, l: 12 } },
];

// --- Helper Functions ---

/**
 * Convert HSL to RGB.
 * h: 0-360, s: 0-100, l: 0-100
 * Returns { r, g, b } each 0-255
 */
function hslToRgb(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r1, g1, b1;
  if (h < 60) { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/**
 * Linearly interpolate between two values.
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Get the interpolated RGB color at a given gradient position (0-100).
 * Interpolates between the nearest gradient stops.
 */
function getGradientColorAt(position) {
  // Clamp position
  const pos = Math.max(0, Math.min(100, position));

  // Find the two surrounding stops
  let lowerStop = GRADIENT_STOPS[0];
  let upperStop = GRADIENT_STOPS[GRADIENT_STOPS.length - 1];

  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    if (pos >= GRADIENT_STOPS[i].position && pos <= GRADIENT_STOPS[i + 1].position) {
      lowerStop = GRADIENT_STOPS[i];
      upperStop = GRADIENT_STOPS[i + 1];
      break;
    }
  }

  // Calculate interpolation factor between the two stops
  const range = upperStop.position - lowerStop.position;
  const t = range === 0 ? 0 : (pos - lowerStop.position) / range;

  // Convert both stops to RGB
  const lowerRgb = hslToRgb(lowerStop.hsl.h, lowerStop.hsl.s, lowerStop.hsl.l);
  const upperRgb = hslToRgb(upperStop.hsl.h, upperStop.hsl.s, upperStop.hsl.l);

  // Interpolate RGB channels
  return {
    r: Math.round(lerp(lowerRgb.r, upperRgb.r, t)),
    g: Math.round(lerp(lowerRgb.g, upperRgb.g, t)),
    b: Math.round(lerp(lowerRgb.b, upperRgb.b, t)),
  };
}

/**
 * Alpha composite a foreground RGBA color over an opaque RGB background.
 * Formula: result = fg * alpha + bg * (1 - alpha)
 */
function alphaComposite(fg, bg) {
  const alpha = fg.a;
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
  };
}

/**
 * Calculate relative luminance per WCAG 2.1 specification.
 * Input: { r, g, b } with values 0-255
 */
function relativeLuminance({ r, g, b }) {
  const linearize = (channel) => {
    const srgb = channel / 255;
    return srgb <= 0.04045
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };

  const R = linearize(r);
  const G = linearize(g);
  const B = linearize(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate WCAG contrast ratio between two RGB colors.
 * Returns ratio >= 1.
 */
function contrastRatio(color1, color2) {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// --- WCAG Threshold ---
const WCAG_AA_NORMAL_TEXT = 4.5;

// --- Tests ---

describe('Glass Card Composited Contrast - Property 8', () => {
  /**
   * **Validates: Requirements 6.6**
   *
   * For any position along the sunset gradient (0-100%), the glass card
   * surface color (glass-card-bg composited over the gradient) SHALL
   * maintain at least 4.5:1 WCAG contrast ratio with Cream text.
   */
  test('glass card composited surface maintains 4.5:1 contrast with Cream text at any gradient position', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (position) => {
          // 1. Get the gradient background color at this position
          const gradientColor = getGradientColorAt(position);

          // 2. Alpha-composite glass-card-bg over the gradient color
          const compositedSurface = alphaComposite(GLASS_CARD_BG, gradientColor);

          // 3. Compute WCAG contrast ratio between Cream text and the composited surface
          const ratio = contrastRatio(CREAM_TEXT, compositedSurface);

          // 4. Assert minimum 4.5:1 contrast
          expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.6**
   *
   * Property test with finer granularity: use floating point positions
   * to cover sub-percentage positions along the gradient.
   */
  test('glass card composited surface maintains contrast at fractional gradient positions', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        (position) => {
          const gradientColor = getGradientColorAt(position);
          const compositedSurface = alphaComposite(GLASS_CARD_BG, gradientColor);
          const ratio = contrastRatio(CREAM_TEXT, compositedSurface);

          expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.6**
   *
   * Deterministic check at each gradient stop position to ensure
   * contrast holds at the exact defined color stops.
   */
  test('glass card composited surface maintains contrast at each gradient stop', () => {
    for (const stop of GRADIENT_STOPS) {
      const gradientColor = hslToRgb(stop.hsl.h, stop.hsl.s, stop.hsl.l);
      const compositedSurface = alphaComposite(GLASS_CARD_BG, gradientColor);
      const ratio = contrastRatio(CREAM_TEXT, compositedSurface);

      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    }
  });
});

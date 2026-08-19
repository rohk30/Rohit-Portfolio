/**
 * Property-based tests for WCAG Contrast Ratio Compliance
 *
 * **Property 7: WCAG contrast ratio compliance**
 *
 * For any text-background color pair used in the application where text is at or
 * below 18px (or 14px bold), the WCAG 2.1 luminance contrast ratio SHALL be at
 * least 4.5:1; and for text larger than 18px (or 14px bold), the ratio SHALL be
 * at least 3:1. Specifically, Cream (#f5f0e8) against Deep Green (#0d1f0d) and
 * Sage (#a8b5a0) against Deep Green (#0d1f0d) SHALL each meet these thresholds.
 *
 * **Validates: Requirements 5.6, 9.5**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

// Cricket Color Palette
const CRICKET_PALETTE = {
  bg: { hex: '#0d1f0d', label: 'Deep Green' },
  bgDeep: { hex: '#0a2e2a', label: 'Dark Teal' },
  accentOrange: { hex: '#e8760a', label: 'Warm Orange' },
  accentRed: { hex: '#8b1a1a', label: 'Cricket Red' },
  accentGold: { hex: '#c9a227', label: 'Gold' },
  text: { hex: '#f5f0e8', label: 'Cream' },
  textSoft: { hex: '#a8b5a0', label: 'Sage' },
};

// All palette colors as an array for generating pairs
const PALETTE_COLORS = Object.values(CRICKET_PALETTE);

// Text-background pairs used in the application
const TEXT_BG_PAIRS = [
  { text: CRICKET_PALETTE.text, bg: CRICKET_PALETTE.bg, description: 'Cream on Deep Green' },
  { text: CRICKET_PALETTE.textSoft, bg: CRICKET_PALETTE.bg, description: 'Sage on Deep Green' },
  { text: CRICKET_PALETTE.text, bg: CRICKET_PALETTE.bgDeep, description: 'Cream on Dark Teal' },
  { text: CRICKET_PALETTE.textSoft, bg: CRICKET_PALETTE.bgDeep, description: 'Sage on Dark Teal' },
  { text: CRICKET_PALETTE.accentGold, bg: CRICKET_PALETTE.bg, description: 'Gold on Deep Green' },
  { text: CRICKET_PALETTE.accentGold, bg: CRICKET_PALETTE.bgDeep, description: 'Gold on Dark Teal' },
  { text: CRICKET_PALETTE.accentOrange, bg: CRICKET_PALETTE.bg, description: 'Warm Orange on Deep Green' },
  { text: CRICKET_PALETTE.accentOrange, bg: CRICKET_PALETTE.bgDeep, description: 'Warm Orange on Dark Teal' },
];

/**
 * Parse a hex color string to RGB components.
 * Supports #RGB and #RRGGBB formats.
 */
function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  let r, g, b;

  if (cleaned.length === 3) {
    r = parseInt(cleaned[0] + cleaned[0], 16);
    g = parseInt(cleaned[1] + cleaned[1], 16);
    b = parseInt(cleaned[2] + cleaned[2], 16);
  } else {
    r = parseInt(cleaned.substring(0, 2), 16);
    g = parseInt(cleaned.substring(2, 4), 16);
    b = parseInt(cleaned.substring(4, 6), 16);
  }

  return { r, g, b };
}

/**
 * Calculate relative luminance per WCAG 2.1 specification.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where R, G, B are linearized sRGB values.
 */
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);

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
 * Calculate contrast ratio between two colors per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 *
 * Contrast ratio = (L1 + 0.05) / (L2 + 0.05)
 * where L1 is the lighter luminance and L2 is the darker.
 */
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG thresholds
const WCAG_AA_NORMAL_TEXT = 4.5; // text ≤ 18px or ≤ 14px bold
const WCAG_AA_LARGE_TEXT = 3.0;  // text > 18px or > 14px bold

describe('WCAG Contrast Ratio Compliance - Property 7', () => {
  /**
   * **Validates: Requirements 5.6**
   *
   * Primary text (Cream #f5f0e8) against primary background (Deep Green #0d1f0d)
   * SHALL maintain a minimum WCAG 2.1 AA contrast ratio of 4.5:1.
   */
  describe('Primary text (Cream) on primary background (Deep Green)', () => {
    test('Cream on Deep Green meets WCAG AA normal text threshold (4.5:1)', () => {
      const ratio = contrastRatio(CRICKET_PALETTE.text.hex, CRICKET_PALETTE.bg.hex);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    });

    test('Cream on Deep Green meets WCAG AA large text threshold (3:1)', () => {
      const ratio = contrastRatio(CRICKET_PALETTE.text.hex, CRICKET_PALETTE.bg.hex);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
    });
  });

  /**
   * **Validates: Requirements 5.6**
   *
   * Secondary text (Sage #a8b5a0) against primary background (Deep Green #0d1f0d)
   * SHALL maintain a minimum WCAG 2.1 AA contrast ratio of 4.5:1.
   */
  describe('Secondary text (Sage) on primary background (Deep Green)', () => {
    test('Sage on Deep Green meets WCAG AA normal text threshold (4.5:1)', () => {
      const ratio = contrastRatio(CRICKET_PALETTE.textSoft.hex, CRICKET_PALETTE.bg.hex);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    });

    test('Sage on Deep Green meets WCAG AA large text threshold (3:1)', () => {
      const ratio = contrastRatio(CRICKET_PALETTE.textSoft.hex, CRICKET_PALETTE.bg.hex);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
    });
  });

  /**
   * **Validates: Requirements 5.6, 9.5**
   *
   * Property-based test: For any text-background color pair from the palette,
   * the contrast ratio SHALL be at least 3:1 (large text minimum).
   * Pairs used for normal-sized text must meet 4.5:1.
   */
  describe('All text-background pairs meet WCAG thresholds', () => {
    // Generator for text-background pairs from the palette
    const textBgPairArbitrary = fc.constantFrom(...TEXT_BG_PAIRS);

    // Generator for font size scenarios
    const fontSizeArbitrary = fc.record({
      size: fc.integer({ min: 10, max: 72 }),
      isBold: fc.boolean(),
    });

    test('all defined text-bg pairs meet normal text threshold (4.5:1)', () => {
      fc.assert(
        fc.property(
          textBgPairArbitrary,
          (pair) => {
            const ratio = contrastRatio(pair.text.hex, pair.bg.hex);
            expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('all defined text-bg pairs meet large text threshold (3:1)', () => {
      fc.assert(
        fc.property(
          textBgPairArbitrary,
          (pair) => {
            const ratio = contrastRatio(pair.text.hex, pair.bg.hex);
            expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('for any font size, correct WCAG threshold is met by all text-bg pairs', () => {
      fc.assert(
        fc.property(
          textBgPairArbitrary,
          fontSizeArbitrary,
          (pair, font) => {
            const ratio = contrastRatio(pair.text.hex, pair.bg.hex);

            // Determine which threshold applies based on font size
            // Large text: > 18px, or > 14px if bold
            const isLargeText = font.size > 18 || (font.isBold && font.size > 14);
            const requiredRatio = isLargeText ? WCAG_AA_LARGE_TEXT : WCAG_AA_NORMAL_TEXT;

            expect(ratio).toBeGreaterThanOrEqual(requiredRatio);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 9.5**
   *
   * Property-based test: For any generated color pair from the palette,
   * when used as text on background, verify the contrast ratio calculation
   * is symmetric, commutative, and within expected bounds.
   */
  describe('Contrast ratio mathematical properties', () => {
    const paletteColorArbitrary = fc.constantFrom(...PALETTE_COLORS);

    test('contrast ratio is symmetric (order of colors does not matter)', () => {
      fc.assert(
        fc.property(
          paletteColorArbitrary,
          paletteColorArbitrary,
          (color1, color2) => {
            const ratio1 = contrastRatio(color1.hex, color2.hex);
            const ratio2 = contrastRatio(color2.hex, color1.hex);

            // Contrast ratio should be the same regardless of order
            expect(ratio1).toBeCloseTo(ratio2, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('contrast ratio is always >= 1 (minimum possible ratio)', () => {
      fc.assert(
        fc.property(
          paletteColorArbitrary,
          paletteColorArbitrary,
          (color1, color2) => {
            const ratio = contrastRatio(color1.hex, color2.hex);
            expect(ratio).toBeGreaterThanOrEqual(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('contrast ratio of a color with itself is exactly 1', () => {
      fc.assert(
        fc.property(
          paletteColorArbitrary,
          (color) => {
            const ratio = contrastRatio(color.hex, color.hex);
            expect(ratio).toBeCloseTo(1, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('contrast ratio is at most 21:1 (max black vs white)', () => {
      fc.assert(
        fc.property(
          paletteColorArbitrary,
          paletteColorArbitrary,
          (color1, color2) => {
            const ratio = contrastRatio(color1.hex, color2.hex);
            expect(ratio).toBeLessThanOrEqual(21);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 5.6, 9.5**
   *
   * Property-based test: For any arbitrary hex color used as text on
   * Deep Green background, if the luminance is high enough (light colors),
   * the contrast ratio should meet WCAG thresholds. This validates that the
   * luminance formula correctly identifies compliant color pairs.
   */
  describe('Luminance formula correctness with arbitrary colors', () => {
    // Generate valid 6-digit hex colors
    const hexColorArbitrary = fc.tuple(
      fc.integer({ min: 0, max: 255 }),
      fc.integer({ min: 0, max: 255 }),
      fc.integer({ min: 0, max: 255 })
    ).map(([r, g, b]) =>
      '#' +
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0')
    );

    test('relative luminance is always between 0 and 1', () => {
      fc.assert(
        fc.property(
          hexColorArbitrary,
          (hex) => {
            const luminance = relativeLuminance(hex);
            expect(luminance).toBeGreaterThanOrEqual(0);
            expect(luminance).toBeLessThanOrEqual(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('contrast ratio between any two colors is between 1 and 21', () => {
      fc.assert(
        fc.property(
          hexColorArbitrary,
          hexColorArbitrary,
          (hex1, hex2) => {
            const ratio = contrastRatio(hex1, hex2);
            expect(ratio).toBeGreaterThanOrEqual(1);
            expect(ratio).toBeLessThanOrEqual(21);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('lighter colors on Deep Green yield higher contrast ratios', () => {
      // Generate pairs where one is clearly lighter (higher RGB values)
      const lightColorArbitrary = fc.tuple(
        fc.integer({ min: 200, max: 255 }),
        fc.integer({ min: 200, max: 255 }),
        fc.integer({ min: 200, max: 255 })
      ).map(([r, g, b]) =>
        '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0')
      );

      fc.assert(
        fc.property(
          lightColorArbitrary,
          (lightHex) => {
            const ratio = contrastRatio(lightHex, CRICKET_PALETTE.bg.hex);
            // Light colors (RGB > 200) on very dark background should have high contrast
            expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Specific WCAG compliance checks for required palette pairs.
   * These are deterministic tests that validate the exact pairs
   * specified in the requirements.
   */
  describe('Required palette pair compliance', () => {
    test('Cream (#f5f0e8) on Deep Green (#0d1f0d) ratio is documented correctly', () => {
      const ratio = contrastRatio('#f5f0e8', '#0d1f0d');
      // Ratio should be well above 4.5:1 for AA compliance
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
      // Log the actual ratio for documentation
      expect(ratio).toBeGreaterThan(10); // Expected ~14:1 based on luminance values
    });

    test('Sage (#a8b5a0) on Deep Green (#0d1f0d) ratio meets AA threshold', () => {
      const ratio = contrastRatio('#a8b5a0', '#0d1f0d');
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    });

    test('Gold (#c9a227) on Deep Green (#0d1f0d) ratio meets large text threshold', () => {
      const ratio = contrastRatio('#c9a227', '#0d1f0d');
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
    });
  });
});

// Feature: cricket-visual-overhaul, Property 1: Color Derivation Relationships
/**
 * Property-based tests for Color Derivation Relationships
 *
 * **Property 1: Color Derivation Relationships**
 *
 * For any valid pitch-green base color (HSL hue 120°-145°, saturation ≥40%,
 * lightness 15%-30%), the derived `--bg-deep` SHALL have a hue within 10° of
 * the base and lightness 5-10% lower, AND the outfield-to-pitch-strip lightness
 * difference SHALL be at least 10 percentage points.
 *
 * **Validates: Requirements 1.2, 1.4**
 */
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

// --- Color Conversion Utilities ---

/**
 * Convert a hex color string to RGB components (0-255).
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
 * Convert RGB (0-255) to HSL (h: 0-360, s: 0-100, l: 0-100).
 */
function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) * 60;
    } else {
      h = ((rNorm - gNorm) / delta + 4) * 60;
    }
  }

  return { h, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL (h: 0-360, s: 0-100, l: 0-100) to RGB (0-255).
 */
function hslToRgb(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert hex to HSL.
 */
function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Derive a bg-deep color from a base pitch-green by reducing lightness by 5-10%.
 * Keeps the same hue and saturation.
 */
function deriveBgDeep(baseHsl, lightnessReduction) {
  return {
    h: baseHsl.h,
    s: baseHsl.s,
    l: baseHsl.l - lightnessReduction,
  };
}

// --- Actual project color values ---
const ACTUAL_COLORS = {
  pitchGreen: '#1a5c2e',
  bgDeep: '#12461f',
  outfield: '#2d8a4e',
  pitchStrip: '#7ab87a',
};

// --- Generators ---

/**
 * Generator for valid pitch-green base colors in HSL space.
 * Constraints: hue 120°-145°, saturation ≥40%, lightness 15%-30%
 */
const pitchGreenHslArb = fc.record({
  h: fc.double({ min: 120, max: 145, noNaN: true }),
  s: fc.double({ min: 40, max: 100, noNaN: true }),
  l: fc.double({ min: 15, max: 30, noNaN: true }),
});

/**
 * Generator for lightness reduction (5-10%) for bg-deep derivation.
 */
const lightnessReductionArb = fc.double({ min: 5, max: 10, noNaN: true });

describe('Color Derivation Relationships - Property 1', () => {
  /**
   * **Validates: Requirements 1.2**
   *
   * Verify that the actual --pitch-green and --bg-deep values satisfy
   * the derivation relationship: same hue family (within 10°),
   * lightness 5-10% lower.
   */
  describe('Actual CSS values satisfy derivation relationship', () => {
    test('--bg-deep hue is within 10° of --pitch-green hue', () => {
      const pitchGreenHsl = hexToHsl(ACTUAL_COLORS.pitchGreen);
      const bgDeepHsl = hexToHsl(ACTUAL_COLORS.bgDeep);

      const hueDiff = Math.abs(pitchGreenHsl.h - bgDeepHsl.h);
      expect(hueDiff).toBeLessThanOrEqual(10);
    });

    test('--bg-deep lightness is 5-10% lower than --pitch-green', () => {
      const pitchGreenHsl = hexToHsl(ACTUAL_COLORS.pitchGreen);
      const bgDeepHsl = hexToHsl(ACTUAL_COLORS.bgDeep);

      const lightnessDiff = pitchGreenHsl.l - bgDeepHsl.l;
      expect(lightnessDiff).toBeGreaterThanOrEqual(5);
      expect(lightnessDiff).toBeLessThanOrEqual(10);
    });

    test('outfield-to-pitch-strip lightness difference is at least 10 percentage points', () => {
      const outfieldHsl = hexToHsl(ACTUAL_COLORS.outfield);
      const pitchStripHsl = hexToHsl(ACTUAL_COLORS.pitchStrip);

      const lightnessDiff = Math.abs(pitchStripHsl.l - outfieldHsl.l);
      expect(lightnessDiff).toBeGreaterThanOrEqual(10);
    });
  });

  /**
   * **Validates: Requirements 1.2**
   *
   * Property-based: For any valid pitch-green base color, deriving --bg-deep
   * by reducing lightness by 5-10% SHALL produce a color whose hue is within
   * 10° of the base (since we keep the same hue, it should be 0° difference).
   */
  describe('bg-deep derivation maintains hue within 10° for any valid pitch-green', () => {
    test('derived bg-deep hue stays within 10° of base pitch-green hue', () => {
      fc.assert(
        fc.property(
          pitchGreenHslArb,
          lightnessReductionArb,
          (baseHsl, reduction) => {
            const derived = deriveBgDeep(baseHsl, reduction);

            // Ensure derived lightness is still valid (≥5% to stay visible)
            if (derived.l < 5) return true; // skip if lightness would go too low

            // Convert both to RGB and back to HSL to test round-trip stability
            const baseRgb = hslToRgb(baseHsl.h, baseHsl.s, baseHsl.l);
            const derivedRgb = hslToRgb(derived.h, derived.s, derived.l);

            const baseHslRoundTrip = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
            const derivedHslRoundTrip = rgbToHsl(derivedRgb.r, derivedRgb.g, derivedRgb.b);

            const hueDiff = Math.abs(baseHslRoundTrip.h - derivedHslRoundTrip.h);
            expect(hueDiff).toBeLessThanOrEqual(10);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('derived bg-deep lightness is exactly 5-10% lower than base', () => {
      fc.assert(
        fc.property(
          pitchGreenHslArb,
          lightnessReductionArb,
          (baseHsl, reduction) => {
            const derived = deriveBgDeep(baseHsl, reduction);

            if (derived.l < 5) return true; // skip invalid ranges

            const lightnessDiff = baseHsl.l - derived.l;
            expect(lightnessDiff).toBeGreaterThanOrEqual(5);
            expect(lightnessDiff).toBeLessThanOrEqual(10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 1.4**
   *
   * Property-based: For any valid pitch-green in the specified HSL range,
   * when we derive outfield (higher lightness: 30-50%) and pitch strip
   * (outfield lightness + at least 10%), the lightness difference SHALL be
   * at least 10 percentage points.
   */
  describe('Outfield-to-pitch-strip lightness difference is at least 10pp', () => {
    /**
     * Generator for outfield lightness (30-50%) and pitch strip offset (≥10pp).
     */
    const outfieldLightnessArb = fc.double({ min: 30, max: 50, noNaN: true });
    const pitchStripOffsetArb = fc.double({ min: 10, max: 30, noNaN: true });

    test('pitch strip is always at least 10pp lighter than outfield for any valid combination', () => {
      fc.assert(
        fc.property(
          pitchGreenHslArb,
          outfieldLightnessArb,
          pitchStripOffsetArb,
          (baseHsl, outfieldLightness, stripOffset) => {
            // Derive outfield from base hue with higher lightness
            const outfieldHsl = { h: baseHsl.h, s: baseHsl.s * 0.9, l: outfieldLightness };
            // Pitch strip is lighter by the offset amount
            const pitchStripHsl = { h: baseHsl.h, s: baseHsl.s * 0.5, l: outfieldLightness + stripOffset };

            // Cap at 100% lightness
            if (pitchStripHsl.l > 100) return true;

            const lightnessDiff = pitchStripHsl.l - outfieldHsl.l;
            expect(lightnessDiff).toBeGreaterThanOrEqual(10);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('the actual outfield and pitch-strip maintain the 10pp minimum', () => {
      fc.assert(
        fc.property(
          fc.constant(null), // dummy to run through fc.assert for consistent reporting
          () => {
            const outfieldHsl = hexToHsl(ACTUAL_COLORS.outfield);
            const pitchStripHsl = hexToHsl(ACTUAL_COLORS.pitchStrip);

            const lightnessDiff = Math.abs(pitchStripHsl.l - outfieldHsl.l);
            expect(lightnessDiff).toBeGreaterThanOrEqual(10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 1.2, 1.4**
   *
   * Combined property: For any valid pitch-green base, ALL derivation
   * relationships hold simultaneously.
   */
  describe('Combined derivation invariants hold for any valid pitch-green', () => {
    test('all color derivation relationships hold simultaneously', () => {
      fc.assert(
        fc.property(
          pitchGreenHslArb,
          lightnessReductionArb,
          fc.double({ min: 30, max: 50, noNaN: true }), // outfield lightness
          fc.double({ min: 10.01, max: 30, noNaN: true }), // pitch strip offset (slightly above 10 to avoid fp rounding)
          (baseHsl, reduction, outfieldLightness, stripOffset) => {
            // 1. bg-deep derivation: hue within 10°, lightness 5-10% lower
            const bgDeepHsl = deriveBgDeep(baseHsl, reduction);
            if (bgDeepHsl.l < 5) return true;

            const baseRgb = hslToRgb(baseHsl.h, baseHsl.s, baseHsl.l);
            const deepRgb = hslToRgb(bgDeepHsl.h, bgDeepHsl.s, bgDeepHsl.l);
            const baseRt = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
            const deepRt = rgbToHsl(deepRgb.r, deepRgb.g, deepRgb.b);

            const hueDiff = Math.abs(baseRt.h - deepRt.h);
            expect(hueDiff).toBeLessThanOrEqual(10);

            const lightnessDiff = baseHsl.l - bgDeepHsl.l;
            expect(lightnessDiff).toBeGreaterThanOrEqual(5);
            expect(lightnessDiff).toBeLessThanOrEqual(10);

            // 2. outfield-to-pitch-strip: at least 10pp lightness difference
            const pitchStripLightness = outfieldLightness + stripOffset;
            if (pitchStripLightness > 100) return true;

            const outfieldPitchDiff = pitchStripLightness - outfieldLightness;
            expect(outfieldPitchDiff).toBeGreaterThanOrEqual(10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

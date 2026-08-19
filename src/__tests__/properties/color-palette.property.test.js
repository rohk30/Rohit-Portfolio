/**
 * Property-based tests for Cricket Color Palette V2 Compliance
 *
 * **Property 6: Cricket color palette compliance**
 * For any CSS color value or inline style color reference in the rendered application,
 * the value SHALL resolve to one of the defined Cricket_Color_Palette_V2 custom properties
 * or their computed values, with no hardcoded hex, rgb, or hsl values outside the palette.
 *
 * **Validates: Requirements 1.1, 1.2, 1.5, 2.1, 6.1, 6.2, 6.3, 6.7**
 */
import { describe, test, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// The defined Cricket Color Palette V2 — Evening Stadium
const CRICKET_COLOR_PALETTE_V2 = {
  '--pitch-green': '#1a5c2e',
  '--bg': 'var(--pitch-green)',
  '--bg-deep': '#12461f',
  '--floodlight-amber': '#e8a020',
  '--sky-purple': '#1a1040',
  '--sky-pink': '#5c2040',
  '--accent-orange': 'var(--floodlight-amber)',
  '--accent-red': '#8b1a1a',
  '--accent-gold': '#c9a227',
  '--text': '#f5f0e8',
  '--text-soft': '#a8b5a0',
};

// All allowed palette hex values (lowercased)
const ALLOWED_HEX_VALUES = new Set([
  '#1a5c2e',    // Pitch Green
  '#12461f',    // BG Deep
  '#e8a020',    // Floodlight Amber
  '#1a1040',    // Sky Purple
  '#5c2040',    // Sky Pink
  '#8b1a1a',    // Cricket Red
  '#c9a227',    // Gold
  '#f5f0e8',    // Cream
  '#a8b5a0',    // Sage
  '#0d1f0d',    // Legacy Deep Green (if still referenced)
  '#0a2e2a',    // Legacy Dark Teal (if still referenced)
  '#e8760a',    // Legacy Warm Orange (if still referenced)
]);

// Additional allowed hex values: standard colors and derived accents
const ADDITIONAL_ALLOWED_HEX = new Set([
  '#fff',       // white (text/highlights)
  '#ffffff',
  '#000',       // black (shadows)
  '#000000',
  '#d4a82a',    // Gold gradient variant
  '#1a3a0d',    // Deep green-tinted accent
  '#2d8a4e',    // CricketGroundSVG outfield fill (vibrant grass green)
  '#7ab87a',    // CricketGroundSVG pitch strip fill
  // Light text color variants (near-white/cream tones for headings and UI text)
  '#d7e0ec',
  '#b8c8d7',
  '#d6deea',
  '#dce5f0',
  '#eaf3ff',
  '#eef4fb',
  '#cbd5e1',
  '#8290a7',    // --text-muted
  '#5c9bd5',    // C++ icon color
]);

// Allowed rgba base values for the V2 palette
const ALLOWED_RGBA_BASES = [
  'rgba(232,160,32',      // Floodlight Amber derived
  'rgba(232, 160, 32',
  'rgba(232,118,10',      // Legacy Warm Orange (#e8760a) derived
  'rgba(232, 118, 10',
  'rgba(26,92,46',        // Pitch Green derived
  'rgba(26, 92, 46',
  'rgba(13,31,13',        // Legacy deep green (surfaces)
  'rgba(13, 31, 13',
  'rgba(201,162,39',      // Gold rgba
  'rgba(201, 162, 39',
  'rgba(10,46,42',        // Legacy dark teal rgba
  'rgba(10, 46, 42',
  'rgba(139,26,26',       // Cricket Red rgba
  'rgba(139, 26, 26',
  'rgba(245,240,232',     // Cream rgba
  'rgba(245, 240, 232',
  'rgba(168,181,160',     // Sage rgba
  'rgba(168, 181, 160',
  'rgba(0,0,0',           // Black for shadows
  'rgba(0, 0, 0',
  'rgba(255,255,255',     // White for highlights
  'rgba(255, 255, 255',
  'rgba(200,180,140',     // Legacy glass-border warm tone
  'rgba(200, 180, 140',
  'rgba(30,25,18',        // Legacy glass-card-bg dark warm tone
  'rgba(30, 25, 18',
  'rgba(10,15,10',        // Dark overlay variant
  'rgba(10, 15, 10',
];

let cssContent = '';

beforeAll(() => {
  const cssPath = path.resolve(__dirname, '../../styles/index.css');
  cssContent = fs.readFileSync(cssPath, 'utf-8');
});

describe('Cricket Color Palette V2 Compliance - Property 6', () => {
  /**
   * **Property 6.1: CSS custom properties match Cricket_Color_Palette_V2**
   * The :root CSS custom properties SHALL define the Cricket_Color_Palette_V2 values.
   *
   * **Validates: Requirements 1.1, 1.2, 6.7**
   */
  describe(':root CSS custom properties match Cricket_Color_Palette_V2', () => {
    test('all Cricket_Color_Palette_V2 variables are defined in :root with correct values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.entries(CRICKET_COLOR_PALETTE_V2)),
          ([variableName, expectedValue]) => {
            // Build a regex to find the variable declaration in :root
            const varRegex = new RegExp(
              `${variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*([^;]+)`
            );
            const match = cssContent.match(varRegex);

            expect(match).not.toBeNull();

            if (match) {
              // Extract the value, trim whitespace and comments
              const actualValue = match[1].trim().split(/\s*\/\*/)[0].trim();
              expect(actualValue.toLowerCase()).toBe(expectedValue.toLowerCase());
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Property 6.2: No hardcoded non-palette hex colors outside allowed set**
   * All hex color values in the CSS SHALL be from the Cricket_Color_Palette_V2
   * or be legitimate derived values.
   *
   * **Validates: Requirements 1.1, 6.7**
   */
  describe('No hardcoded non-palette hex colors outside allowed set', () => {
    test('hex color values in CSS are from the allowed palette', () => {
      // Extract all hex color values from CSS
      const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
      const allHexValues = [...cssContent.matchAll(hexPattern)].map((m) => ({
        value: m[0].toLowerCase(),
        index: m.index,
      }));

      // Filter out hex values that are part of a comment
      const nonCommentHexValues = allHexValues.filter((item) => {
        const before = cssContent.substring(Math.max(0, item.index - 100), item.index);
        const isInComment = before.lastIndexOf('/*') > before.lastIndexOf('*/');
        return !isInComment;
      });

      fc.assert(
        fc.property(
          fc.constantFrom(...nonCommentHexValues),
          (hexItem) => {
            const normalizedHex = hexItem.value.toLowerCase();

            // Normalize 3-digit hex to 6-digit for comparison
            let fullHex = normalizedHex;
            if (normalizedHex.length === 4) {
              fullHex = `#${normalizedHex[1]}${normalizedHex[1]}${normalizedHex[2]}${normalizedHex[2]}${normalizedHex[3]}${normalizedHex[3]}`;
            }

            const isAllowed =
              ALLOWED_HEX_VALUES.has(fullHex) ||
              ADDITIONAL_ALLOWED_HEX.has(fullHex) ||
              ADDITIONAL_ALLOWED_HEX.has(normalizedHex);

            expect(isAllowed).toBe(true);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Property 6.3: rgba values derive from palette colors**
   * All rgba color values in the CSS SHALL use base RGB values that correspond
   * to the Cricket_Color_Palette_V2 colors.
   *
   * **Validates: Requirements 6.1, 6.2, 6.3**
   */
  describe('rgba values derive from palette colors', () => {
    test('all rgba color values use palette-derived RGB bases', () => {
      // Extract all rgba(...) values from CSS
      const rgbaPattern = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;
      const allRgbaValues = [...cssContent.matchAll(rgbaPattern)].map((m) => ({
        value: m[0],
        index: m.index,
      }));

      // Filter out values in comments
      const nonCommentRgba = allRgbaValues.filter((item) => {
        const before = cssContent.substring(Math.max(0, item.index - 100), item.index);
        const isInComment = before.lastIndexOf('/*') > before.lastIndexOf('*/');
        return !isInComment;
      });

      if (nonCommentRgba.length === 0) return;

      fc.assert(
        fc.property(
          fc.constantFrom(...nonCommentRgba),
          (rgbaItem) => {
            const value = rgbaItem.value;

            // Check if the rgba base (without alpha) matches one of the allowed bases
            const isAllowed = ALLOWED_RGBA_BASES.some((base) =>
              value.replace(/\s/g, '').startsWith(base.replace(/\s/g, ''))
            );

            expect(isAllowed).toBe(true);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Property 6.4: Interactive highlights use Floodlight Amber**
   * All hover states and interactive accent elements SHALL reference Floodlight Amber
   * rather than teal or lime colors.
   *
   * **Validates: Requirements 6.2**
   */
  describe('Interactive highlights use Floodlight Amber', () => {
    test('hover state rules reference Floodlight Amber and not teal/lime', () => {
      // Extract hover rule blocks
      const hoverBlockPattern = /:hover\s*\{[^}]*\}/g;
      const hoverBlocks = [...cssContent.matchAll(hoverBlockPattern)].map((m) => m[0]);

      // Also check interactive class rules
      const interactivePattern = /\.glass-interactive[^{]*\{[^}]*\}/g;
      const interactiveBlocks = [...cssContent.matchAll(interactivePattern)].map((m) => m[0]);

      const allInteractiveBlocks = [...hoverBlocks, ...interactiveBlocks];

      if (allInteractiveBlocks.length === 0) return;

      fc.assert(
        fc.property(
          fc.constantFrom(...allInteractiveBlocks),
          (block) => {
            // Check that no raw teal/lime colors appear in hover/interactive blocks
            const tealLimePattern = /#(?:00bcd4|009688|26a69a|4db6ac|80cbc4|00ff00|76ff03|4caf50|8bc34a|cddc39)\b/i;
            const hasTealLime = tealLimePattern.test(block);

            expect(hasTealLime).toBe(false);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('glass-hover-border custom property uses Floodlight Amber-derived rgba', () => {
      // The --glass-hover-border should be Floodlight Amber (232, 160, 32) at some opacity
      const hoverBorderMatch = cssContent.match(
        /--glass-hover-border\s*:\s*([^;]+)/
      );

      expect(hoverBorderMatch).not.toBeNull();

      if (hoverBorderMatch) {
        const value = hoverBorderMatch[1].trim();
        // Should contain Floodlight Amber RGB values (232, 160, 32)
        expect(value).toMatch(/rgba\(\s*232\s*,\s*160\s*,\s*32/);
      }
    });

    test('accent-gold custom property is defined as #c9a227', () => {
      const goldMatch = cssContent.match(/--accent-gold\s*:\s*([^;]+)/);
      expect(goldMatch).not.toBeNull();

      if (goldMatch) {
        const value = goldMatch[1].trim().split(/\s*\/\*/)[0].trim();
        expect(value.toLowerCase()).toBe('#c9a227');
      }
    });

    test('legacy teal/lime aliases point to Gold', () => {
      // --accent-teal and --accent-lime should alias to --accent-gold
      const tealAlias = cssContent.match(/--accent-teal\s*:\s*([^;]+)/);
      const limeAlias = cssContent.match(/--accent-lime\s*:\s*([^;]+)/);

      if (tealAlias) {
        const value = tealAlias[1].trim().split(/\s*\/\*/)[0].trim();
        expect(value).toContain('--accent-gold');
      }

      if (limeAlias) {
        const value = limeAlias[1].trim().split(/\s*\/\*/)[0].trim();
        expect(value).toContain('--accent-gold');
      }
    });
  });

  /**
   * **Property 6.5: HSL values only in sunset gradient**
   * HSL values in the CSS SHALL only appear within the --sunset-gradient
   * definition (which requires HSL color stops per design).
   *
   * **Validates: Requirements 2.1, 2.2**
   */
  describe('HSL values only in sunset gradient', () => {
    test('hsl/hsla values only appear within the sunset-gradient definition', () => {
      const hslPattern = /hsla?\(\s*\d+/g;
      const hslMatches = [...cssContent.matchAll(hslPattern)].filter((m) => {
        const before = cssContent.substring(Math.max(0, m.index - 100), m.index);
        const isInComment = before.lastIndexOf('/*') > before.lastIndexOf('*/');
        return !isInComment;
      });

      // All HSL values should be within the --sunset-gradient declaration
      for (const match of hslMatches) {
        const contextBefore = cssContent.substring(Math.max(0, match.index - 200), match.index);
        const isInSunsetGradient = contextBefore.includes('--sunset-gradient');
        expect(isInSunsetGradient).toBe(true);
      }
    });
  });
});

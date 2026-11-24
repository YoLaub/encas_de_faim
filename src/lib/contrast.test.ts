import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

// Reads the real theme tokens so a color change in global.css cannot silently break AA.
const css = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf-8');

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --color-${name} not found in global.css`);
  return match[1];
}

const WHITE = '#ffffff';
const color = (name: string) => (name === 'white' ? WHITE : token(name));

describe('contrastRatio', () => {
  it('is 21 for black on white and symmetric', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
  });

  it('is 1 for identical colors', () => {
    expect(contrastRatio('#336699', '#336699')).toBeCloseTo(1, 5);
  });

  it('matches a known mid-grey value (#767676 on white is about 4.54)', () => {
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 1);
  });
});

// [foreground, background] pairs actually used for text in the UI.
const textPairs: [string, string][] = [
  ['ink-900', 'cream'],
  ['ink-900', 'white'],
  ['ink-900', 'leaf'],
  ['ink-600', 'white'],
  ['ink-600', 'cream'],
  ['white', 'ember-700'],
  ['white', 'ink-900'],
  ['cream', 'ink-900'],
  ['brand-700', 'white'],
  ['brand-700', 'cream'],
  ['ember-700', 'ember-50'],
];

// Borders, focus rings and icons need 3:1 against what surrounds them.
const uiPairs: [string, string][] = [
  ['ink-900', 'cream'],
  ['ink-900', 'white'],
  ['ink-900', 'leaf'],
];

describe('theme contrast (WCAG AA)', () => {
  it.each(textPairs)('text %s on %s is at least 4.5:1', (fg, bg) => {
    expect(contrastRatio(color(fg), color(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(uiPairs)('UI element %s against %s is at least 3:1', (fg, bg) => {
    expect(contrastRatio(color(fg), color(bg))).toBeGreaterThanOrEqual(3);
  });
});

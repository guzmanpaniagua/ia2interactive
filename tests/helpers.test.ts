import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeAttr, shuffleArray, normalizeAnswer } from '../src/core/templates/helpers.js';

describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('handles string with no special chars', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('escapes multiple special chars', () => {
    expect(escapeHtml('<a href="x">')).toBe('&lt;a href=&quot;x&quot;&gt;');
  });
});

describe('escapeAttr', () => {
  it('escapes double quotes', () => {
    expect(escapeAttr('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeAttr("it's")).toBe('it&#39;s');
  });

  it('escapes angle brackets', () => {
    expect(escapeAttr('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes ampersands', () => {
    expect(escapeAttr('a & b')).toBe('a &amp; b');
  });

  it('handles empty string', () => {
    expect(escapeAttr('')).toBe('');
  });
});

describe('shuffleArray', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result).toHaveLength(5);
  });

  it('contains same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not mutate original array', () => {
    const arr = [1, 2, 3];
    shuffleArray(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('handles empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('handles single element', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe('normalizeAnswer', () => {
  it('trims whitespace', () => {
    expect(normalizeAnswer('  hello  ')).toBe('hello');
  });

  it('converts to lowercase', () => {
    expect(normalizeAnswer('HELLO')).toBe('hello');
  });

  it('removes accents', () => {
    expect(normalizeAnswer('mínimo')).toBe('minimo');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeAnswer('hello    world')).toBe('hello world');
  });

  it('normalizes complex string', () => {
    expect(normalizeAnswer('  Mínimo  Privilegio  ')).toBe('minimo privilegio');
  });

  it('handles empty string', () => {
    expect(normalizeAnswer('')).toBe('');
  });
});

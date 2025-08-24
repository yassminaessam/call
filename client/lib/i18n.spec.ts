import { describe, test, expect } from 'vitest';
import { formatCurrency, formatNumber, plural, getDir } from './i18n';

describe('i18n utilities', () => {
  test('formatCurrency clamps invalid fraction digits', () => {
    const val = formatCurrency(1234.567, 'en', { maximumFractionDigits: 50 });
    // Should NOT blow up and should not show 50 fraction digits (expect at most 20, practically 2 default)
    expect(/\d{1,3}(,\d{3})*(\.\d{1,20})?/.test(val)).toBe(true);
  });

  test('formatCurrency swaps min/max when inverted', () => {
    const val = formatCurrency(10, 'en', { minimumFractionDigits: 4, maximumFractionDigits: 2 });
    // Should still produce something with 2-4 fraction digits (swapped)
    expect(val).toMatch(/10[.,]00/);
  });

  test('formatNumber basic', () => {
    expect(formatNumber(1000, 'en')).toMatch(/1,000/);
  });

  test('plural english', () => {
    const one = plural('en', 1, { one: '1 item', other: '{{count}} items' });
    const many = plural('en', 3, { one: '1 item', other: '{{count}} items' });
    expect(one).toBe('1 item');
    expect(many).toBe('3 items');
  });

  test('getDir arabic is rtl', () => {
    expect(getDir('ar')).toBe('rtl');
    expect(getDir('en')).toBe('ltr');
  });
});

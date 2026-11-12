import { describe, expect, it } from 'vitest';
import { isValidCxPrice } from './cx-limits';

describe('isValidCxPrice', () => {
  it.each([530, 62.5, 0.07, 1.5, 123000000])('accepts %s', price => {
    expect(isValidCxPrice(price)).toBe(true);
  });

  it.each([45.67, 16.47, 43810, 1.234])('rejects %s', price => {
    expect(isValidCxPrice(price)).toBe(false);
  });
});

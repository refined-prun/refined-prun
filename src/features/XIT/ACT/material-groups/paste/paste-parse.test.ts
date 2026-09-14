import { describe, expect, it } from 'vitest';
import { parseMaterials, parsePaste } from './paste-parse';

const known = ['RAT', 'DW', 'OVE', 'FEO'];
const resolveTicker = (ticker: string) => known.find(x => x === ticker.toUpperCase());

describe('parsePaste', () => {
  it('rejects an unterminated quoted quantity instead of silently accepting it', () => {
    const result = parsePaste('RAT,"100', resolveTicker);
    expect(result.errors).toHaveLength(1);
    expect(parseMaterials('RAT,"100', resolveTicker)).toBeUndefined();
  });

  it('reads a tab-separated paste with prices', () => {
    const result = parsePaste('RAT\t100\t530\nDW\t50\t62.5', resolveTicker);
    expect(result.errors).toEqual([]);
    expect(result.delimiter).toBe('\t');
    expect(result.rows).toEqual([
      { ticker: 'RAT', amount: 100, price: 530 },
      { ticker: 'DW', amount: 50, price: 62.5 },
    ]);
  });

  it('accepts rows with and without a price in either order', () => {
    const pricedFirst = parsePaste('DW,50,62.5\nRAT,100', resolveTicker);
    expect(pricedFirst.errors).toEqual([]);
    expect(pricedFirst.rows).toEqual([
      { ticker: 'DW', amount: 50, price: 62.5 },
      { ticker: 'RAT', amount: 100 },
    ]);

    const unpricedFirst = parsePaste('RAT,100\nDW,50,62.5', resolveTicker);
    expect(unpricedFirst.errors).toEqual([]);
    expect(unpricedFirst.rows).toEqual([
      { ticker: 'RAT', amount: 100 },
      { ticker: 'DW', amount: 50, price: 62.5 },
    ]);
  });

  it('reports the failing row instead of discarding the paste', () => {
    const result = parsePaste('RAT,100\nXYZ,50\nDW,25', resolveTicker);
    expect(result.rows).toEqual([
      { ticker: 'RAT', amount: 100 },
      { ticker: 'DW', amount: 25 },
    ]);
    expect(result.errors).toEqual([{ line: 2, reason: 'unknown ticker "XYZ"' }]);
  });

  it('numbers rows by their position in the paste, blank rows included', () => {
    const result = parsePaste('RAT,100\n\n\nXYZ,50', resolveTicker);
    expect(result.errors.map(x => x.line)).toEqual([4]);
  });

  it('reads an unambiguous quoted thousands separator inside a tab-separated paste', () => {
    const result = parsePaste('RAT\t"1,600,000"\t530', resolveTicker);
    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([{ ticker: 'RAT', amount: 1600000, price: 530 }]);
  });

  it('reads semicolon-separated rows with comma decimals', () => {
    const result = parsePaste('RAT;100;62,5', resolveTicker);
    expect(result.errors).toEqual([]);
    expect(result.delimiter).toBe(';');
    expect(result.rows).toEqual([{ ticker: 'RAT', amount: 100, price: 62.5 }]);
  });

  it('reads a paste that uses bare carriage returns', () => {
    const result = parsePaste('RAT,100\rDW,50', resolveTicker);
    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(2);
  });

  it('rejects a price with more than three significant figures', () => {
    const result = parsePaste('RAT,100,45.67', resolveTicker);
    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual([
      {
        line: 1,
        reason: 'price "45.67" has more than 3 significant figures (use 45.7)',
      },
    ]);
  });

  it('accepts prices whose extra digits are non-significant zeros', () => {
    const result = parsePaste('RAT,100,530\nDW,50,123000000', resolveTicker);
    expect(result.errors).toEqual([]);
    expect(result.rows.map(x => x.price)).toEqual([530, 123000000]);
  });

  it.each(['1,600', '1.600'])('rejects ambiguous quantity and price %s', raw => {
    const quantity = parsePaste(`RAT\t${raw}`, resolveTicker);
    expect(quantity.errors).toEqual([
      { line: 1, reason: `quantity "${raw}" has ambiguous separators; write it without grouping` },
    ]);
    expect(quantity.rows).toEqual([]);
    expect(parseMaterials(`RAT\t"${raw}"`, resolveTicker)).toBeUndefined();

    const price = parsePaste(`RAT\t100\t${raw}`, resolveTicker);
    expect(price.errors).toEqual([
      { line: 1, reason: `price "${raw}" has ambiguous separators; write it without grouping` },
    ]);
  });

  it('rejects a price with more than two decimal places', () => {
    const result = parsePaste('RAT,100,0.125', resolveTicker);
    expect(result.errors).toEqual([
      { line: 1, reason: 'price "0.125" has more than two decimal places' },
    ]);
  });

  it('rejects a fractional quantity', () => {
    const result = parsePaste('RAT,10.5', resolveTicker);
    expect(result.errors).toEqual([{ line: 1, reason: 'quantity "10.5" is not a whole number' }]);
  });

  it('rejects fractional text that Number would round to a whole quantity', () => {
    expect(parseMaterials('RAT;1.0000000000000001', resolveTicker)).toBeUndefined();
  });

  it('rejects two different prices for one ticker but allows a repeated one', () => {
    const conflicting = parsePaste('RAT,100,530\nRAT,50,540', resolveTicker);
    expect(conflicting.rows).toHaveLength(1);
    expect(conflicting.errors).toEqual([
      { line: 2, reason: 'conflicting price for RAT; line 1 used 530' },
    ]);

    const repeated = parsePaste('RAT,100,530\nRAT,50,530', resolveTicker);
    expect(repeated.errors).toEqual([]);
    expect(repeated.rows).toHaveLength(2);
  });

  it('fails the whole paste when rows use different delimiters', () => {
    const result = parsePaste('RAT,100\nDW;50', resolveTicker);
    expect(result.fatal).toBe(
      'Paste mixes comma-separated and semicolon-separated rows. Use one delimiter throughout.',
    );
    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('rejects a row that is not two or three fields', () => {
    const result = parsePaste('RAT\nDW,50,530,999', resolveTicker);
    expect(result.errors).toEqual([
      { line: 1, reason: 'expected TICKER, QUANTITY[, PRICE] (got 1 fields)' },
      { line: 2, reason: 'expected TICKER, QUANTITY[, PRICE] (got 4 fields)' },
    ]);
  });
});

describe('parseMaterials', () => {
  it('sums repeated tickers and keeps their price', () => {
    const result = parseMaterials('RAT,100,530\nRAT,50,530\nDW,25', resolveTicker);
    expect(result).toEqual({
      RAT: { quantity: 150, price: 530 },
      DW: { quantity: 25 },
    });
  });

  it('omits prices entirely when no row carries one', () => {
    expect(parseMaterials('RAT,100', resolveTicker)).toEqual({
      RAT: { quantity: 100 },
    });
  });

  it('returns undefined when any row failed, so a partial bill never runs', () => {
    expect(parseMaterials('RAT,100\nXYZ,50', resolveTicker)).toBeUndefined();
  });

  it('returns undefined for empty input', () => {
    expect(parseMaterials('', resolveTicker)).toBeUndefined();
    expect(parseMaterials(undefined, resolveTicker)).toBeUndefined();
  });
});

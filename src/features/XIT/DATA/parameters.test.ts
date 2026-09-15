import { describe, expect, it } from 'vitest';
import { parseDataExplorerParameters } from '@src/features/XIT/DATA/parameters';

describe('parseDataExplorerParameters', () => {
  it.each([
    [[], { connectionEnabled: true }],
    [['ships'], { sourceId: 'ships', connectionEnabled: true }],
    [['JSON'], { connectionEnabled: false }],
    [['ships', 'JSON'], { sourceId: 'ships', connectionEnabled: false }],
    [['json', 'ships'], { sourceId: 'ships', connectionEnabled: false }],
  ])('parses optional DATA parameters %#', (parameters, expected) => {
    expect(parseDataExplorerParameters(parameters)).toEqual(expected);
  });
});

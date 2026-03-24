import { castArray } from '@src/utils/cast-array';

interface QueryResult<T> {
  include: T[];
  exclude: Set<T>;
  includeAll: boolean;
  excludeAll: boolean;
}

export function findWithQuery<T>(
  query: string | string[],
  find: (term: string, parts: string[]) => T | T[] | undefined,
): QueryResult<T> {
  if (typeof query === 'string') {
    query = query
      .trim()
      .split(' ')
      .filter(x => x.length > 0);
  }
  query = query.map(x => x.toLowerCase());

  let include = [] as T[];
  const includeSet = new Set<T>();
  const exclude = new Set<T>();
  let includeAll = true;
  let excludeAll = false;

  let isNot = false;

  let nextTerm = '';
  const nextTermParts = [] as string[];
  while (query.length > 0) {
    // Accumulate terms until we find a match. For example, 'Lom Palanka' is initially split into
    // 'Lom' and 'Palanka', but we need to join them into 'Lom Palanka' to match.
    const nextQueryPart = query.shift()!;
    nextTermParts.push(nextQueryPart);
    if (nextTerm.length === 0) {
      nextTerm = nextQueryPart;
    } else {
      nextTerm += ' ' + nextQueryPart;
    }

    if (nextTerm === 'not') {
      isNot = true;
      excludeAll = true;
      nextTerm = '';
      nextTermParts.length = 0;
      continue;
    }

    const match = find(nextTerm, nextTermParts);
    if (match === undefined) {
      continue;
    }

    const matches = castArray(match);
    if (!isNot) {
      includeAll = false;
      for (const item of matches) {
        if (!includeSet.has(item)) {
          include.push(item);
          includeSet.add(item);
        }
      }
    } else {
      excludeAll = false;
      for (const item of matches) {
        exclude.add(item);
      }
    }

    nextTerm = '';
    nextTermParts.length = 0;
  }

  include = include.filter(x => !exclude.has(x));
  return {
    include,
    exclude,
    includeAll,
    excludeAll,
  };
}

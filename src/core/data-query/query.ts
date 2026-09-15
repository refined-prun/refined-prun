import {
  DataQuery,
  DataQueryFilter,
  DataQueryResult,
  DataSourceDescriptor,
  DEFAULT_DATA_QUERY_LIMIT,
  MAX_DATA_QUERY_LIMIT,
} from '@src/core/data-query/types';

const operators = new Set([
  'eq',
  'neq',
  'contains',
  'startsWith',
  'gt',
  'gte',
  'lt',
  'lte',
  'exists',
]);

const blockedPathSegments = new Set(['__proto__', 'prototype', 'constructor']);

interface PathValue {
  exists: boolean;
  value: unknown;
}

export class DataQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataQueryError';
  }
}

export function parseFilterValue(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function cloneDataSnapshot(rows: unknown[] | undefined) {
  return rows === undefined ? undefined : cloneSerializableRows(rows);
}

export function executeDataQuery(
  descriptor: DataSourceDescriptor,
  query: DataQuery,
  generatedAt = new Date(),
): DataQueryResult {
  const normalizedQuery = validateAndNormalizeQuery(query);
  if (normalizedQuery.sourceId !== descriptor.id) {
    throw new DataQueryError(
      `Query source "${normalizedQuery.sourceId}" does not match descriptor.`,
    );
  }

  const snapshot = descriptor.snapshot();
  const rows = cloneSerializableRows(snapshot ?? []);
  const totalRows = rows.length;
  const search = normalizedQuery.search?.toLocaleLowerCase();
  const filters = normalizedQuery.filters ?? [];

  let matched = rows.filter(row => {
    if (search && !serializeForSearch(row).toLocaleLowerCase().includes(search)) {
      return false;
    }
    return filters.every(filter => matchesFilter(row, filter));
  });

  if (normalizedQuery.sort) {
    const { direction, path } = normalizedQuery.sort;
    matched = matched
      .map((row, index) => ({ index, row }))
      .sort((a, b) => {
        const compared = comparePathValues(a.row, b.row, path, direction);
        return compared === 0 ? a.index - b.index : compared;
      })
      .map(x => x.row);
  }

  const matchedRows = matched.length;
  const limit = normalizedQuery.limit!;
  const limitedRows = matched.slice(0, limit);

  return {
    source: {
      id: descriptor.id,
      label: descriptor.label,
      provenance: descriptor.provenance,
      completeness: descriptor.completeness(),
    },
    generatedAt: generatedAt.toISOString(),
    query: cloneSerializable(normalizedQuery),
    totalRows,
    matchedRows,
    truncated: matchedRows > limitedRows.length,
    rows: limitedRows,
  };
}

export function validateAndNormalizeQuery(input: unknown): DataQuery {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new DataQueryError('Query must be an object.');
  }
  const query = input as DataQuery;
  if (typeof query.sourceId !== 'string' || query.sourceId.trim() === '') {
    throw new DataQueryError('sourceId must be a non-empty string.');
  }
  if (query.search !== undefined && typeof query.search !== 'string') {
    throw new DataQueryError('search must be a string.');
  }
  if (query.filters !== undefined && !Array.isArray(query.filters)) {
    throw new DataQueryError('filters must be an array.');
  }

  const filters = query.filters?.map((filter, index) => validateFilter(filter, index));
  let sort: DataQuery['sort'];
  if (query.sort !== undefined) {
    const sortInput: unknown = query.sort;
    if (typeof sortInput !== 'object' || sortInput === null || Array.isArray(sortInput)) {
      throw new DataQueryError('sort must be an object.');
    }
    validatePath(query.sort.path, 'sort path');
    if (query.sort.direction !== 'asc' && query.sort.direction !== 'desc') {
      throw new DataQueryError('sort direction must be "asc" or "desc".');
    }
    sort = { path: query.sort.path, direction: query.sort.direction };
  }

  let limit = DEFAULT_DATA_QUERY_LIMIT;
  if (query.limit !== undefined) {
    if (!Number.isInteger(query.limit) || query.limit <= 0) {
      throw new DataQueryError('limit must be a positive integer.');
    }
    limit = Math.min(query.limit, MAX_DATA_QUERY_LIMIT);
  }

  return {
    sourceId: query.sourceId,
    ...(query.search !== undefined ? { search: query.search } : {}),
    ...(filters !== undefined ? { filters } : {}),
    ...(sort !== undefined ? { sort } : {}),
    limit,
  };
}

function validateFilter(input: unknown, index: number): DataQueryFilter {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new DataQueryError(`Filter ${index + 1} must be an object.`);
  }
  const filter = input as DataQueryFilter;
  validatePath(filter.path, `filter ${index + 1} path`);
  if (!operators.has(filter.operator)) {
    throw new DataQueryError(`Filter ${index + 1} has an unknown operator.`);
  }
  if (
    filter.operator === 'exists' &&
    filter.value !== undefined &&
    typeof filter.value !== 'boolean'
  ) {
    throw new DataQueryError(`Filter ${index + 1} exists value must be a boolean when provided.`);
  }
  return {
    path: filter.path,
    operator: filter.operator,
    ...(filter.value !== undefined ? { value: cloneSerializable(filter.value) } : {}),
  };
}

function validatePath(path: string, label: string) {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new DataQueryError(`${label} must be a non-empty dot-separated path.`);
  }
  const segments = path.split('.');
  if (segments.some(x => x === '' || blockedPathSegments.has(x))) {
    throw new DataQueryError(`${label} contains an invalid segment.`);
  }
}

function matchesFilter(row: unknown, filter: DataQueryFilter) {
  const pathValue = getPathValue(row, filter.path);
  if (filter.operator === 'exists') {
    return filter.value === false ? !pathValue.exists : pathValue.exists;
  }
  if (!pathValue.exists) {
    return false;
  }

  const value = pathValue.value;
  switch (filter.operator) {
    case 'eq':
      return deepEqual(value, filter.value);
    case 'neq':
      return !deepEqual(value, filter.value);
    case 'contains':
      if (typeof value === 'string' && typeof filter.value === 'string') {
        return value.toLocaleLowerCase().includes(filter.value.toLocaleLowerCase());
      }
      return Array.isArray(value) && value.some(x => deepEqual(x, filter.value));
    case 'startsWith':
      return (
        typeof value === 'string' &&
        typeof filter.value === 'string' &&
        value.toLocaleLowerCase().startsWith(filter.value.toLocaleLowerCase())
      );
    case 'gt':
      return compareComparable(value, filter.value, x => x > 0);
    case 'gte':
      return compareComparable(value, filter.value, x => x >= 0);
    case 'lt':
      return compareComparable(value, filter.value, x => x < 0);
    case 'lte':
      return compareComparable(value, filter.value, x => x <= 0);
  }
}

function compareComparable(
  left: unknown,
  right: unknown,
  predicate: (comparison: number) => boolean,
) {
  if (typeof left === 'number' && typeof right === 'number') {
    return predicate(left - right);
  }
  if (typeof left === 'string' && typeof right === 'string') {
    return predicate(left.localeCompare(right));
  }
  return false;
}

function comparePathValues(
  leftRow: unknown,
  rightRow: unknown,
  path: string,
  direction: 'asc' | 'desc',
) {
  const left = getPathValue(leftRow, path);
  const right = getPathValue(rightRow, path);
  const leftMissing = !left.exists || left.value === null || left.value === undefined;
  const rightMissing = !right.exists || right.value === null || right.value === undefined;
  if (leftMissing || rightMissing) {
    if (leftMissing && rightMissing) {
      return 0;
    }
    return leftMissing ? 1 : -1;
  }

  const comparison = compareValues(left.value, right.value);
  return direction === 'desc' ? -comparison : comparison;
}

function compareValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  if (typeof left === 'string' && typeof right === 'string') {
    return left.localeCompare(right);
  }
  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return Number(left) - Number(right);
  }
  return stableString(left).localeCompare(stableString(right));
}

function getPathValue(row: unknown, path: string): PathValue {
  let value = row;
  for (const segment of path.split('.')) {
    if ((typeof value !== 'object' && typeof value !== 'function') || value === null) {
      return { exists: false, value: undefined };
    }
    if (!Object.hasOwn(value, segment)) {
      return { exists: false, value: undefined };
    }
    value = (value as Record<string, unknown>)[segment];
  }
  return { exists: true, value };
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((x, index) => deepEqual(x, right[index]))
    );
  }
  if (typeof left === 'object' && left !== null && typeof right === 'object' && right !== null) {
    const leftObject = left as Record<string, unknown>;
    const rightObject = right as Record<string, unknown>;
    const leftKeys = Object.keys(leftObject);
    const rightKeys = Object.keys(rightObject);
    return (
      leftKeys.length === rightKeys.length &&
      leftKeys.every(
        key => Object.hasOwn(rightObject, key) && deepEqual(leftObject[key], rightObject[key]),
      )
    );
  }
  return false;
}

function serializeForSearch(value: unknown) {
  return JSON.stringify(value) ?? String(value);
}

function stableString(value: unknown) {
  if (typeof value === 'object') {
    return JSON.stringify(value) ?? String(value);
  }
  return String(value);
}

function cloneSerializableRows(rows: unknown[]) {
  return cloneSerializable(rows);
}

function cloneSerializable<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    throw new DataQueryError('Data is not serializable.');
  }
}

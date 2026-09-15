export type DataProvenance =
  | 'extension-settings'
  | 'prun-live'
  | 'prun-live-with-defaults'
  | 'fio-reference-with-prun-overrides';

export type DataCompleteness = 'not-loaded' | 'partial' | 'complete';

export type DataSourceShape = 'collection' | 'record';

export interface DataSourceDescriptor {
  id: string;
  label: string;
  description: string;
  provenance: DataProvenance;
  shape: DataSourceShape;
  completeness(): DataCompleteness;
  snapshot(): unknown[] | undefined;
  warning?: string;
  load?: {
    parameter?: 'siteId';
    execute(parameter?: string): void;
  };
}

export type DataFilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'startsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'exists';

export interface DataQueryFilter {
  path: string;
  operator: DataFilterOperator;
  value?: unknown;
}

export interface DataQuery {
  sourceId: string;
  search?: string;
  filters?: DataQueryFilter[];
  sort?: { path: string; direction: 'asc' | 'desc' };
  limit?: number;
}

export interface DataQueryResult {
  source: {
    id: string;
    label: string;
    provenance: DataProvenance;
    completeness: DataCompleteness;
  };
  generatedAt: string;
  query: DataQuery;
  totalRows: number;
  matchedRows: number;
  truncated: boolean;
  rows: unknown[];
}

export interface DataSourceSummary {
  id: string;
  label: string;
  description: string;
  provenance: DataProvenance;
  shape: DataSourceShape;
  completeness: DataCompleteness;
  warning?: string;
  load?: {
    parameter?: 'siteId';
  };
}

export interface DataSnapshot {
  source: DataSourceSummary;
  rows: unknown[] | undefined;
}

export const DEFAULT_DATA_QUERY_LIMIT = 250;
export const MAX_DATA_QUERY_LIMIT = 5000;

import { cloneDataSnapshot, executeDataQuery, DataQueryError } from '@src/core/data-query/query';
import {
  DataQuery,
  DataQueryResult,
  DataSnapshot,
  DataSourceDescriptor,
  DataSourceSummary,
} from '@src/core/data-query/types';

export class DataCatalog {
  private readonly descriptors = new Map<string, DataSourceDescriptor>();

  constructor(descriptors: DataSourceDescriptor[]) {
    for (const descriptor of descriptors) {
      if (this.descriptors.has(descriptor.id)) {
        throw new DataQueryError(`Duplicate data source ID "${descriptor.id}".`);
      }
      this.descriptors.set(descriptor.id, descriptor);
    }
  }

  list(): DataSourceSummary[] {
    return [...this.descriptors.values()]
      .map(x => summarizeSource(x))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  get(sourceId: string): DataSourceDescriptor | undefined {
    return this.descriptors.get(sourceId);
  }

  snapshot(sourceId: string): DataSnapshot {
    const descriptor = this.getRequired(sourceId);
    return {
      source: summarizeSource(descriptor),
      rows: cloneDataSnapshot(descriptor.snapshot()),
    };
  }

  query(query: DataQuery, generatedAt?: Date): DataQueryResult {
    return executeDataQuery(this.getRequired(query.sourceId), query, generatedAt);
  }

  export(query: DataQuery, generatedAt?: Date): DataQueryResult {
    return this.query(query, generatedAt);
  }

  load(sourceId: string, parameter?: string) {
    const descriptor = this.getRequired(sourceId);
    if (!descriptor.load) {
      throw new DataQueryError(`Data source "${sourceId}" does not support loading.`);
    }
    if (descriptor.load.parameter === 'siteId' && !parameter?.trim()) {
      throw new DataQueryError('A site ID is required for this data source.');
    }
    descriptor.load.execute(parameter?.trim());
  }

  private getRequired(sourceId: string) {
    const descriptor = this.descriptors.get(sourceId);
    if (!descriptor) {
      throw new DataQueryError(`Unknown data source ID "${sourceId}".`);
    }
    return descriptor;
  }
}

function summarizeSource(descriptor: DataSourceDescriptor): DataSourceSummary {
  return {
    id: descriptor.id,
    label: descriptor.label,
    description: descriptor.description,
    provenance: descriptor.provenance,
    shape: descriptor.shape,
    completeness: descriptor.completeness(),
    ...(descriptor.warning ? { warning: descriptor.warning } : {}),
    ...(descriptor.load ? { load: { parameter: descriptor.load.parameter } } : {}),
  };
}

export function createCollectionSource(
  descriptor: Omit<DataSourceDescriptor, 'shape' | 'snapshot'> & {
    snapshot(): unknown[] | undefined;
  },
): DataSourceDescriptor {
  return {
    ...descriptor,
    shape: 'collection',
  };
}

export function createRecordSource(
  descriptor: Omit<DataSourceDescriptor, 'shape' | 'snapshot'> & {
    snapshotRecord(): unknown | undefined;
  },
): DataSourceDescriptor {
  const { snapshotRecord, ...source } = descriptor;
  return {
    ...source,
    shape: 'record',
    snapshot: () => {
      const record = snapshotRecord();
      return record === undefined ? undefined : [record];
    },
  };
}

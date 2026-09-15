export interface DataExplorerParameters {
  sourceId?: string;
  connectionEnabled: boolean;
}

export function parseDataExplorerParameters(parameters: string[]): DataExplorerParameters {
  const jsonOnly = parameters.some(x => x.toUpperCase() === 'JSON');
  const sourceId = parameters.find(x => x.toUpperCase() !== 'JSON');
  return { sourceId, connectionEnabled: !jsonOnly };
}

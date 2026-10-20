import getMapArray from '@src/utils/get-map-array';

export interface ReachabilityGraph {
  ftl: Map<string, string[]>;
  gateways: FioApi.Gateway[];
  // Maps a gateway location (planet or station natural id) to its system natural id.
  getSystem: (location: string) => string | undefined;
}

// Ships without FTL move only inside their system, except through gateways.
// Void sectors have no FTL connections, so only gateways reach them.
export function getReachableSystems(
  graph: ReachabilityGraph,
  start: string,
  shipVolume: number,
  hasFtl: boolean,
) {
  const edges = new Map<string, string[]>();
  const addEdge = (from: string, to: string) => getMapArray(edges, from).push(to);

  if (hasFtl) {
    for (const [from, list] of graph.ftl) {
      for (const to of list) {
        addEdge(from, to);
      }
    }
  }

  const gatewayById = new Map(graph.gateways.map(x => [x.GatewayId, x]));
  for (const gateway of graph.gateways) {
    if (
      gateway.OperationalState !== 'OPERATIONAL' ||
      gateway.LinkStatus !== 'ESTABLISHED' ||
      !gateway.OutgoingLink
    ) {
      continue;
    }
    const target = gatewayById.get(gateway.OutgoingLink);
    if (!target || Math.min(gateway.MaxShipVolume, target.MaxShipVolume) < shipVolume) {
      continue;
    }
    const from = graph.getSystem(gateway.LocationNaturalId);
    const to = graph.getSystem(target.LocationNaturalId);
    if (from && to) {
      addEdge(from, to);
    }
  }

  const reachable = new Set([start]);
  const queue = [start];
  for (let i = 0; i < queue.length; i++) {
    for (const next of edges.get(queue[i]) ?? []) {
      if (!reachable.has(next)) {
        reachable.add(next);
        queue.push(next);
      }
    }
  }
  return reachable;
}

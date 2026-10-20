import { describe, expect, it } from 'vitest';
import { getReachableSystems, ReachabilityGraph } from '@src/core/shipping/reachability';

function gateway(
  id: string,
  location: string,
  link: string | null,
  maxShipVolume = 3000,
): FioApi.Gateway {
  return {
    GatewayId: id,
    LocationNaturalId: location,
    OperationalState: 'OPERATIONAL',
    LinkStatus: 'ESTABLISHED',
    OutgoingLink: link,
    MaxShipVolume: maxShipVolume,
  };
}

const graph: ReachabilityGraph = {
  ftl: new Map([
    ['A', ['B']],
    ['B', ['A', 'C']],
    ['C', ['B']],
  ]),
  gateways: [gateway('g1', 'Cb', 'g2', 1500), gateway('g2', 'Va', 'g1'), gateway('g3', 'Ac', 'g4')],
  getSystem: x => x.slice(0, -1),
};

describe('getReachableSystems', () => {
  it('follows FTL connections and gateways for FTL ships', () => {
    expect(getReachableSystems(graph, 'A', 1000, true)).toEqual(new Set(['A', 'B', 'C', 'V']));
  });

  it('skips gateways that are too small for the ship', () => {
    expect(getReachableSystems(graph, 'A', 2000, true)).toEqual(new Set(['A', 'B', 'C']));
  });

  it('keeps STL ships in their system unless a gateway leaves it', () => {
    expect(getReachableSystems(graph, 'B', 500, false)).toEqual(new Set(['B']));
    expect(getReachableSystems(graph, 'C', 500, false)).toEqual(new Set(['C', 'V']));
  });

  it('ignores gateways without an established link', () => {
    const broken: ReachabilityGraph = {
      ...graph,
      gateways: [
        { ...gateway('g1', 'Cb', 'g2'), LinkStatus: 'UNLINKED' },
        gateway('g2', 'Va', 'g1'),
      ],
    };
    expect(getReachableSystems(broken, 'C', 500, false)).toEqual(new Set(['C']));
  });

  it('treats void systems without connections as unreachable by FTL', () => {
    expect(getReachableSystems(graph, 'V', 500, true)).toEqual(new Set(['V', 'C', 'B', 'A']));
    expect(getReachableSystems({ ...graph, gateways: [] }, 'A', 500, true).has('V')).toBe(false);
  });
});

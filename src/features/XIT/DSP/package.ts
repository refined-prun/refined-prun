import type { DispatchBaseConfig } from './utils';
import { billQuantities, MaterialBill, mergeBills } from '@src/features/XIT/ACT/material-bill';

export interface DispatchBase {
  naturalId: string;
  planetName: string;
  config: DispatchBaseConfig;
  bill?: MaterialBill;
  ship?: {
    id: string;
    name: string;
    exchangeCode: string;
    origin?: string;
    dest?: string;
  };
}

export function getDispatchError(bases: DispatchBase[]) {
  if (bases.length === 0) {
    return 'Assign a ship and enable resupply or repair for at least one base';
  }
  if (bases.some(x => x.ship === undefined)) {
    return 'Assigned ships must be docked at an exchange';
  }
  if (bases.some(x => x.ship!.origin === undefined || x.ship!.dest === undefined)) {
    return 'Waiting for ship cargo and warehouse inventories';
  }
  if (bases.some(x => x.bill === undefined)) {
    return 'Waiting for base material data';
  }
  if (bases.every(x => Object.keys(x.bill!).length === 0)) {
    return 'No materials need to be dispatched';
  }
  return undefined;
}

export function buildDispatchPackage(
  bases: DispatchBase[],
  refuelAction?: UserData.ActionData,
): UserData.ActionPackageData | undefined {
  if (getDispatchError(bases) !== undefined) {
    return undefined;
  }

  // Use display names for groups and natural ids for SFC/BRA commands.
  const groupNameOf = (base: DispatchBase) => base.planetName || base.naturalId;

  const groups: UserData.MaterialGroupData[] = [];
  const cxBuyActions: UserData.ActionData[] = [];

  // Per-exchange aggregate of bills for bases with cxBuy on.
  const exchangeBills = new Map<string, MaterialBill>();
  // Bases that actually stage (non-empty bill), in list order.
  const stagedBases: DispatchBase[] = [];

  for (const base of bases) {
    const { naturalId, config, ship } = base;
    const bill = base.bill!;
    if (Object.keys(bill).length === 0) {
      continue;
    }

    stagedBases.push(base);

    groups.push({
      type: 'Manual',
      name: groupNameOf(base),
      planet: naturalId,
      materials: billQuantities(bill),
    });

    if (config.cxBuy) {
      const code = ship!.exchangeCode;
      exchangeBills.set(code, mergeBills(exchangeBills.get(code), bill)!);
    }
  }

  // Group by ship, preserving list order within each group and insertion
  // order of first-seen ships.
  const byShip = new Map<string, DispatchBase[]>();
  for (const base of stagedBases) {
    const shipId = base.ship!.id;
    let list = byShip.get(shipId);
    if (list === undefined) {
      list = [];
      byShip.set(shipId, list);
    }
    list.push(base);
  }

  // Multi-base ships first (order of each ship's first base in the list),
  // then single-base ships.
  const multiShipGroups: DispatchBase[][] = [];
  const singleShipBases: DispatchBase[] = [];
  for (const shipBases of byShip.values()) {
    if (shipBases.length >= 2) {
      multiShipGroups.push(shipBases);
    } else {
      singleShipBases.push(shipBases[0]);
    }
  }

  const mtraActions: UserData.ActionData[] = [];
  const finishActions: UserData.ActionData[] = [];

  // Load all ships before any finish actions (JSON, agent posts, SFC).
  // Each ship's material group combines its bases' bills.
  const pushShipMtra = (shipBases: DispatchBase[]) => {
    const first = shipBases[0];
    const ship = first.ship!;
    const shipName = ship.name;
    const loadName = `Load ${shipName}`;
    const origin = ship.origin!;
    const dest = ship.dest!;

    let materials: MaterialBill | undefined;
    for (const base of shipBases) {
      materials = mergeBills(materials, base.bill);
    }

    groups.push({
      type: 'Manual',
      name: loadName,
      materials: billQuantities(materials!),
    });

    const offloadGroups = shipBases.filter(x => x.config.offloadJson).map(groupNameOf);
    const agentGroups = shipBases.filter(x => x.config.agent).map(groupNameOf);
    const repairGroups = shipBases.filter(x => x.config.repair).map(groupNameOf);

    const { load, finish } = buildTwoPhaseMtraActions({
      loadName,
      finishName: `Offload ${shipName}`,
      group: loadName,
      origin,
      dest,
      sfcDestination: first.naturalId,
      offloadGroups,
      agentGroups,
      repairGroups,
    });
    mtraActions.push(load);
    finishActions.push(finish);
  };

  for (const shipBases of multiShipGroups) {
    pushShipMtra(shipBases);
  }

  for (const base of singleShipBases) {
    pushShipMtra([base]);
  }

  for (const [code, materials] of exchangeBills) {
    if (Object.keys(materials).length === 0) {
      continue;
    }
    const groupName = `Buy ${code}`;
    groups.push({
      type: 'Manual',
      name: groupName,
      materials: billQuantities(materials),
    });
    cxBuyActions.push({
      type: 'CX Buy',
      name: groupName,
      group: groupName,
      exchange: code,
      useCXInv: true,
      skippable: true,
    });
  }

  return {
    global: { name: 'Dispatch' },
    groups,
    actions: [
      ...(refuelAction !== undefined ? [refuelAction] : []),
      ...cxBuyActions,
      ...mtraActions,
      ...finishActions,
    ],
  };
}

// DSP emits all ships' load actions before finish actions (JSON, agent posts, SFC).
// mtra.ts handles noSfc on load actions and finishOnly on finish actions.
interface TwoPhaseMtraOptions {
  loadName: string;
  finishName: string;
  group: string;
  origin: string;
  dest: string;
  sfcDestination: string;
  offloadGroups: string[];
  agentGroups: string[];
  repairGroups: string[];
}

function buildTwoPhaseMtraActions(opts: TwoPhaseMtraOptions): {
  load: UserData.ActionData;
  finish: UserData.ActionData;
} {
  return {
    load: {
      type: 'MTRA',
      name: opts.loadName,
      group: opts.group,
      origin: opts.origin,
      dest: opts.dest,
      noSfc: true,
    },
    finish: {
      type: 'MTRA',
      name: opts.finishName,
      group: opts.group,
      origin: opts.origin,
      dest: opts.dest,
      finishOnly: true,
      sfcDestination: opts.sfcDestination,
      ...(opts.offloadGroups.length > 0 ? { offloadGroups: opts.offloadGroups } : {}),
      ...(opts.agentGroups.length > 0 ? { agentGroups: opts.agentGroups } : {}),
      ...(opts.repairGroups.length > 0 ? { repairGroups: opts.repairGroups } : {}),
    },
  };
}

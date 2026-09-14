import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/mtra/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/mtra/Configure.vue';
import { MTRA_TRANSFER } from '@src/features/XIT/ACT/action-steps/MTRA_TRANSFER';
import { SHPI_UNLOAD } from '@src/features/XIT/ACT/action-steps/SHPI_UNLOAD';
import { POST_AGENT } from '@src/features/XIT/ACT/action-steps/POST_AGENT';
import { LOG_JSON } from '@src/features/XIT/ACT/action-steps/LOG_JSON';
import { OPEN_SFC } from '@src/features/XIT/ACT/action-steps/OPEN_SFC';
import { OPEN_BRA } from '@src/features/XIT/ACT/action-steps/OPEN_BRA';
import { atSameLocation, deserializeStorage } from '@src/features/XIT/ACT/actions/utils';
import { Config, CX_BUY_ONLY_DEST } from '@src/features/XIT/ACT/actions/mtra/config';
import { AssertFn, configurableValue } from '@src/features/XIT/ACT/shared-types';
import { generateAgentIds } from '@src/features/XIT/ACT/agent-sync';
import { getPlanetName } from '@src/core/planet-name';
import { buildOffloadPackage } from '@src/features/XIT/ACT/actions/mtra/offload-package';

act.addAction<Config>({
  type: 'MTRA',
  shortDescription: 'Transfer materials between storages at the same location',
  description: (action, config) => {
    if (!action.group || !action.origin || !action.dest) {
      return '--';
    }

    const origin =
      action.origin == configurableValue
        ? (config?.origin ?? 'configured location')
        : action.origin;
    const dest =
      action.dest == configurableValue
        ? (config?.destination ?? 'configured location')
        : action.dest;
    if (dest === CX_BUY_ONLY_DEST) {
      return `CX Buy only [${action.group}] from ${origin} (no transfer)`;
    }
    return `Transfer group [${action.group}] from ${origin} to ${dest}`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => {
    return data.origin === configurableValue || data.dest === configurableValue;
  },
  isValidConfig: (data, config) => {
    return (
      (data.origin !== configurableValue || config.origin !== undefined) &&
      (data.dest !== configurableValue || config.destination !== undefined)
    );
  },
  generateSteps: async ctx => {
    const { data, config, packageName, log, getMaterialGroup, getMaterialGroupPlanet, emitStep } =
      ctx;
    const assert: AssertFn = ctx.assert;

    const PRUNPLANNER_PACKAGES = [
      'PRUNplanner Supply Cart',
      'PRUNplanner Construct',
      'PRUNplanner Transfer',
      'PRUNplanner Burn Supply',
    ];

    // Assert-narrowed locals (rebound so nested helpers keep the non-undefined type).
    const maybeMaterials = await getMaterialGroup(data.group);
    assert(maybeMaterials, 'Invalid material group');
    const materials = Object.fromEntries(
      Object.entries(maybeMaterials).map(([ticker, x]) => [ticker, x.quantity]),
    );

    const serializedOrigin = data.origin === configurableValue ? config?.origin : data.origin;
    const maybeOrigin = deserializeStorage(serializedOrigin);
    assert(maybeOrigin, 'Invalid origin');
    const origin = maybeOrigin;

    const serializedDest = data.dest === configurableValue ? config?.destination : data.dest;
    if (serializedDest === CX_BUY_ONLY_DEST) {
      return;
    }
    const maybeDest = deserializeStorage(serializedDest);
    assert(maybeDest, 'Invalid destination');
    const dest = maybeDest;

    const isSameLocation = atSameLocation(origin, dest);
    assert(isSameLocation, 'Origin and destination are not at the same location');

    // A finishOnly action emits JSON, agent posts, and SFC after all ships' load actions.
    // The matching load action already emitted the transfers.
    function emitTransferSteps() {
      // Use SHPI only when the group covers all cargo and the destination fits it all.
      // SHPI has no partial-transfer feedback; MTRA provides per-material capacity warnings.
      const originItems = origin.items.filter(x => x.quantity);
      const epsilon = 0.000001;
      const destFits =
        origin.weightLoad <= dest.weightCapacity - dest.weightLoad + epsilon &&
        origin.volumeLoad <= dest.volumeCapacity - dest.volumeLoad + epsilon;
      const fullCargoOffload =
        origin.type === 'SHIP_STORE' &&
        dest.type === 'STORE' &&
        destFits &&
        originItems.length > 0 &&
        originItems.every(x => (materials[x.quantity!.material.ticker] ?? 0) >= x.quantity!.amount);
      if (fullCargoOffload) {
        log.info('Group covers the entire cargo hold - unloading via SHPI instead of MTRA');
        emitStep(SHPI_UNLOAD({ shipId: origin.addressableId }));
      } else {
        for (const ticker of Object.keys(materials)) {
          emitStep(
            MTRA_TRANSFER({
              from: origin.id,
              to: dest.id,
              ticker,
              amount: materials[ticker],
            }),
          );
        }
      }
    }

    async function emitFinishSteps() {
      // Post a single-group offload; the multi-group branch below handles DISPATCH stops.
      if (
        dest.type === 'SHIP_STORE' &&
        data.postToAgent &&
        !data.offloadGroups &&
        !data.agentGroups
      ) {
        emitStep(
          POST_AGENT({
            pkg: buildOffloadPackage(data.group, materials, serializedDest),
          }),
        );
      }

      if (dest.type === 'SHIP_STORE') {
        const needsPrint = !!data.printOffloadJson;
        const needsSfc = !data.noSfc && !PRUNPLANNER_PACKAGES.includes(packageName);

        // Single-group print and SFC share a planet; multi-group packages resolve each separately.
        const printGroups = data.offloadGroups ?? [];
        const agentGroups = data.agentGroups ?? (data.postToAgent ? printGroups : []);
        const hasMultiGroups = printGroups.length > 0 || agentGroups.length > 0;

        let planet: string | undefined;
        if (!hasMultiGroups) {
          // Resolve only if needed: getMaterialGroupPlanet warns when the group has no planet.
          const needGroupPlanet = needsPrint || (needsSfc && data.sfcDestination === undefined);
          planet = needGroupPlanet ? getMaterialGroupPlanet(data.group) : undefined;
        }

        if (hasMultiGroups) {
          // One offload package per group name (union of print + agent lists).
          // LOG_JSON only for printGroups; POST_AGENT only for agentGroups.
          // Multi-stop agent posts get chain ids so XIT AGENT can SFC to the next stop.
          let ids: string[] | undefined;
          if (agentGroups.length > 0) {
            ids = ctx.preview
              ? Array.from({ length: agentGroups.length }, (_, i) => `preview-${i + 1}`)
              : await generateAgentIds(agentGroups.length, ctx.state.reservedAgentIds);
          }
          for (const name of [...new Set([...printGroups, ...agentGroups])]) {
            const groupMats = await getMaterialGroup(name);
            if (!groupMats) {
              log.warning(`Skipping offload for missing material group [${name}]`);
              continue;
            }
            const groupPlanet = getMaterialGroupPlanet(name);
            const offloadPkg = buildOffloadPackage(
              'Auto Offload',
              Object.fromEntries(
                Object.entries(groupMats).map(([ticker, x]) => [ticker, x.quantity]),
              ),
              serializedDest,
              groupPlanet ? `${getPlanetName(groupPlanet)} Base` : configurableValue,
            );
            if (groupPlanet && data.repairGroups?.includes(name)) {
              // Survives agent-channel sync - unmapped keys pass through compaction.
              offloadPkg.actions[0].braPlanet = groupPlanet;
            }
            if (printGroups.includes(name)) {
              emitStep(LOG_JSON({ pkg: offloadPkg }));
            }
            if (ids && agentGroups.includes(name)) {
              emitStep(POST_AGENT({ pkg: offloadPkg, id: ids[agentGroups.indexOf(name)] }));
            }
          }
        } else if (needsPrint) {
          emitStep(
            LOG_JSON({
              pkg: buildOffloadPackage(
                'Auto Offload',
                materials,
                serializedDest,
                planet ? `${getPlanetName(planet)} Base` : configurableValue,
              ),
            }),
          );
        }

        if (needsSfc) {
          emitStep(
            OPEN_SFC({
              shipId: dest.addressableId,
              destination: data.sfcDestination ?? planet,
            }),
          );
        }
      }
    }

    if (!data.finishOnly) {
      emitTransferSteps();
    }

    // DISPATCH repair reminders follow unloading and precede the next flight.
    if (data.braPlanet) {
      emitStep(OPEN_BRA({ planet: data.braPlanet }));
    }

    await emitFinishSteps();
  },
});

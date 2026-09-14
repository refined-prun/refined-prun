import { act } from '@src/features/XIT/ACT/act-registry';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import { getPlanetName } from '@src/core/planet-name';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { selectAddress } from '@src/infrastructure/prun-ui/utils/select-address';
import { resizeSplitWindow, splitOwnerId } from '@src/infrastructure/prun-ui/companion-buffer';
import { sfcStageWindowSize } from '@src/features/XIT/ACT/action-steps/sfc-stage-layout';

interface Data {
  shipId: string;
  destination?: string;
}

// Delay before each SFC after the first so the player can submit the previous flight.
// ACT opens SFC and fills the destination; the player submits it. No delay follows the last SFC.
const flightSubmitGapMs = 2000;

export const OPEN_SFC = act.addActionStep<Data>({
  type: 'OPEN_SFC',
  description: data => {
    const ship = shipsStore.getById(data.shipId);
    const shipLabel = ship?.name ?? ship?.registration ?? 'unknown ship';
    return data.destination
      ? `Open SFC for ${shipLabel}, set destination to ${getPlanetName(data.destination)}`
      : `Open SFC for ${shipLabel}`;
  },
  execute: async ctx => {
    const { data, log, isFirstOfType, requestTile, waitAct, complete } = ctx;
    const assert: AssertFn = ctx.assert;

    const ship = shipsStore.getById(data.shipId);
    assert(ship, 'Ship not found');

    const tile = await requestTile(`SFC ${ship.registration}`, {
      actDelayMs: isFirstOfType ? 0 : flightSubmitGapMs,
    });
    if (!tile) {
      return;
    }

    const destinationName = data.destination ? getPlanetName(data.destination) : undefined;

    if (data.destination) {
      await waitAct('Set destination?');
      const container = await $(tile.anchor, C.AddressSelector.container);
      const naturalId = convertToPlanetNaturalId(data.destination) ?? data.destination;
      if (await selectAddress(container, naturalId)) {
        log.info(`Destination set: ${destinationName} - submit the flight in SFC`);
      } else {
        log.warning(
          `Could not set destination to ${destinationName} - select it manually, then submit the flight`,
        );
      }
    }

    if (isFirstOfType) {
      await applySfcStageLayout(tile);
    }

    complete();
  },
});

async function applySfcStageLayout(tile: PrunTile) {
  const windowEl = tile.frame.closest(`.${C.Window.window}`);
  const ownerId = splitOwnerId(windowEl);
  if (ownerId === undefined) {
    return;
  }
  const bodyEl = _$(windowEl!, C.Window.body) as HTMLElement | null;
  const currentWidth = parseInt(bodyEl?.style.width ?? '', 10);
  const currentHeight = parseInt(bodyEl?.style.height ?? '', 10);
  const layout = sfcStageWindowSize(actPaneWidth(tile), currentWidth, currentHeight);
  await resizeSplitWindow(ownerId, layout.actWidth, layout.sfcWidth, layout.height);
}

// Measure the ACT sibling in pixels; its inline width is a percentage.
function actPaneWidth(sfcTile: PrunTile) {
  const node = sfcTile.container.parentElement;
  if (node === null) {
    return NaN;
  }
  const sibling = _$$(node, C.Node.child).find(x => x !== sfcTile.container);
  return sibling === undefined ? NaN : sibling.getBoundingClientRect().width;
}

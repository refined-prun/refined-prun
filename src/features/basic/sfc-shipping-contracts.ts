import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightPlansStore } from '@src/infrastructure/prun-api/data/flight-plans';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { planShipLoad } from '@src/core/shipping/shipping-ads';
import { canAcceptContracts } from '@src/core/shipping/trips';
import { getPlanetName } from '@src/core/planet-name';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { fixed0, fixed01 } from '@src/utils/format';
import { getShipContractsCommand } from '@src/features/XIT/ACT/actions/ship-contracts/command';

// Ads already proposed in this session, so a declined or stale ad is not proposed again.
const proposed = new Set<string>();

function onTileReady(tile: PrunTile) {
  const ship = computed(() => shipsStore.getByRegistration(tile.parameter));
  subscribe($$(tile.anchor, C.MissionPlan.table), table => {
    const planId = refPrunId(table);
    const destination = computed(() => {
      const segments = flightPlansStore.getById(planId.value)?.segments;
      return getEntityNaturalIdFromAddress(segments?.[segments.length - 1]?.destination);
    });
    const load = computed(() =>
      ship.value && destination.value && canAcceptContracts()
        ? planShipLoad(ship.value, destination.value, proposed)
        : undefined,
    );
    let shownForPlan: string | null = null;
    watchEffectWhileNodeAlive(table, () => {
      const result = load.value;
      if (!ship.value || !destination.value || !result || result.items.length === 0) {
        return;
      }
      if (shownForPlan === planId.value) {
        return;
      }
      shownForPlan = planId.value;
      for (const ad of result.items) {
        proposed.add(ad.key);
      }
      const registration = ship.value.registration;
      const target = destination.value;
      const currencies = [...new Set(result.items.map(x => x.currency))].join('/');
      const keys = result.items.map(x => x.key);
      showConfirmationOverlay(
        table,
        () => void showBuffer(getShipContractsCommand(registration, target, keys)),
        {
          message:
            `You could carry ${fixed01(result.weight)} t and ${fixed01(result.volume)} m³ ` +
            `to ${getPlanetName(target)} for ${fixed0(result.value)} ${currencies} ` +
            `(${fixed0(result.items.length)} shipping ads).`,
          confirmLabel: 'Accept',
        },
      );
    });
  });
}

function init() {
  tiles.observe('SFC', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'SFC: Proposes the best shipping ads to the planned destination for the free cargo space.',
);

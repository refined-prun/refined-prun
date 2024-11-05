import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { isEmpty } from 'ts-extras';

function onTileReady(tile: PrunTile) {
  // Shorten flight status
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const ship = computed(() => shipsStore.getById(id.value));
    const flight = computed(() => flightsStore.getById(ship.value?.flightId));

    const labels = {
      TAKE_OFF: '↑',
      DEPARTURE: '↗',
      CHARGE: '±',
      JUMP: '⟿',
      TRANSIT: '⟶',
      APPROACH: '↘',
      LANDING: '↓',
    };

    const statusLabel = computed(() => {
      if (!ship.value) {
        return undefined;
      }

      if (!flight.value) {
        return '⦁';
      }

      const segment = flight.value.segments[flight.value.currentSegmentIndex];
      if (!segment) {
        return undefined;
      }

      return labels[segment.type] ?? undefined;
    });

    function replaceStatus() {
      if (statusLabel.value === undefined) {
        return;
      }
      const statusCell = row.children[3] as HTMLTableCellElement;
      if (!statusCell) {
        return;
      }

      const nodes = Array.from(statusCell.childNodes).filter(
        x => x.nodeType === Node.TEXT_NODE || x.nodeType === Node.ELEMENT_NODE,
      );
      if (isEmpty(nodes)) {
        return;
      }
      if (statusCell.style.textAlign !== 'center') {
        statusCell.style.textAlign = 'center';
      }
      if (nodes[0].textContent !== statusLabel.value) {
        nodes[0].textContent = statusLabel.value;
      }
      for (const node of nodes.slice(1)) {
        if (node.textContent) {
          node.textContent = '';
        }
      }
    }
    replaceStatus();
    const observer = new MutationObserver(replaceStatus);
    observer.observe(row, { childList: true, subtree: true, characterData: true });
  });
}

function init() {
  tiles.observe('FLT', onTileReady);
}

features.add({
  id: 'flt-shorten-flight-status',
  description: 'FLT: Replaces the flight status text with arrow icons.',
  advanced: true,
  init,
});

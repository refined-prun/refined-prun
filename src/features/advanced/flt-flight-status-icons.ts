import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { isEmpty } from 'ts-extras';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function onTileReady(tile: PrunTile) {
  // Shorten flight status
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const ship = computed(() => shipsStore.getById(id.value));
    const flight = computed(() => flightsStore.getById(ship.value?.flightId));

    const labels: Record<PrunApi.SegmentType, string> = {
      TAKE_OFF: '↑',
      DEPARTURE: '↗',
      TRANSIT: '⟶',
      CHARGE: '±',
      JUMP: '➾',
      FLOAT: '↑',
      APPROACH: '↘',
      LANDING: '↓',
      LOCK: '⟴',
      DECAY: '⟴',
      JUMP_GATEWAY: '⟴',
    };

    const currentSegment = computed(() => {
      if (!flight.value) return undefined;
      return flight.value.segments[flight.value.currentSegmentIndex];
    });

    const statusLabel = computed(() => {
      if (!ship.value) return undefined;
      if (!flight.value) return '⦁';

      const segment = currentSegment.value;
      return segment ? labels[segment.type] : undefined;
    });

    const tooltipName = computed(() => {
      if (!ship.value) return undefined;
      const segment = currentSegment.value;
      if (!flight.value || !segment) return `SFC ${ship.value.registration}`;
      return `${segment.type.replace('_', ' ')}: SFC ${ship.value.registration}`;
    });

    function replaceStatus() {
      if (statusLabel.value === undefined) {
        return;
      }
      const statusCell = row.children[3] as HTMLTableCellElement;
      if (statusCell === undefined) {
        return;
      }

      statusCell.style.display = 'table-cell';
      statusCell.title = tooltipName.value ?? '';
      statusCell.classList.add(C.Link.link);

      statusCell.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        showBuffer(`SFC ${ship.value!.registration}`);
      };

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
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Replaces the flight status text with arrow icons.');

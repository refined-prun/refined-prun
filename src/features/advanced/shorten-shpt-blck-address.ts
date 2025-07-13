import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { getDestinationName } from '@src/infrastructure/prun-api/data/addresses';
import { watchUntil } from '@src/utils/watch';

function init() {
  subscribe($$(document, C.ColoredIcon.container), async container => {
    const label = await $(container, C.ColoredIcon.label);
    const subLabel = await $(container, C.ColoredIcon.subLabel);

    if (label.textContent !== 'SHPT' && label.textContent !== 'BLCK') {
      return;
    }

    const id = refPrunId(container);
    await watchUntil(() => !!id.value);

    const destination = contractsStore.getDestinationByShipmentId(id.value);
    const name = getDestinationName(destination);
    if (!name) {
      return;
    }

    subLabel.textContent = name;
  });
}

features.add(import.meta.url, init, 'Shortens addresses in SHPT and BLCK items.');

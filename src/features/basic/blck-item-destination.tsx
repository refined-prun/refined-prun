import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { getDestinationFullName } from '@src/infrastructure/prun-api/data/addresses';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchUntil } from '@src/utils/watch';

function init() {
  subscribe($$(document, C.ColoredIcon.container), async container => {
    const label = await $(container, C.ColoredIcon.label);
    if (label.textContent !== 'BLCK') {
      return;
    }

    const id = refPrunId(container);
    await watchUntil(() => !!id.value);

    const destination = contractsStore.getDestinationByShipmentId(id.value);
    const name = getDestinationFullName(destination);
    if (name) {
      createFragmentApp(() => (
        <span class={[C.ColoredIcon.subLabel, C.type.typeVerySmall]}>{name}</span>
      )).after(label);
    }
  });
}

features.add(import.meta.url, init, 'Adds a destination address to BLCK items.');

import ContFulfillInfo from './ContFulfillInfo.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';

function onTileReady(tile: PrunTile) {
  const contract = computed(() => contractsStore.getByLocalId(tile.parameter));

  const pendingCount = computed(() => {
    const c = contract.value;
    if (!c) {
      return 0;
    }
    return c.conditions.filter(x => x.status !== 'FULFILLED' && x.party === c.party).length;
  });

  // Observe DOM mutations to keep fulfillableCount reactive.
  const domVersion = ref(0);
  const observer = new MutationObserver(() => {
    domVersion.value++;
  });
  observer.observe(tile.anchor, { childList: true, subtree: true });

  const fulfillableCount = computed(() => {
    // Touch domVersion to re-evaluate when DOM changes.
    void domVersion.value;
    const buttons = _$$(tile.anchor, C.Button.success);
    return buttons.filter(x => x.textContent?.trim().toLowerCase() === 'fulfill').length;
  });

  const onFulfillNext = () => {
    const buttons = _$$(tile.anchor, C.Button.success);
    const fulfillBtn = buttons.find(x => x.textContent?.trim().toLowerCase() === 'fulfill');
    if (fulfillBtn) {
      fulfillBtn.click();
    }
  };

  // Place after the CMD row.
  const cmdRow = _$$(tile.anchor, C.FormComponent.containerCommand)[0];
  if (cmdRow === undefined) {
    return;
  }

  createFragmentApp(
    ContFulfillInfo,
    reactive({ pendingCount, fulfillableCount, onFulfillNext }),
  ).after(cmdRow);
}

function init() {
  tiles.observe('CONT', onTileReady);
}

features.add(import.meta.url, init, 'CONT: Adds fulfill-next button and pending condition count.');

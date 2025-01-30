import { refAttributeValue } from '@src/utils/reactive-dom';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ColoredIcon.container), async container => {
    const label = await $(container, C.ColoredIcon.labelContainer);
    const attribute = refAttributeValue(container, 'title');
    const detail = computed(() => {
      const regex = /#([a-zA-Z0-9]+)/;
      const match = attribute.value?.match(regex);

      if (!match) {
        return undefined;
      }

      const id = match[1];
      // The id is the localId of the contract
      // getDestinationByShipmentId is needed until the APEX bug is fixed
      // https://discord.com/channels/667551433503014924/1333780301234569228/1333780301234569228
      return (
        contractsStore.getDestinationByLocalContractId(id) ??
        contractsStore.getDestinationByShipmentId(id)
      );
    });
    createFragmentApp(
      ColoredIconDetail,
      reactive({
        detail,
      }),
    ).appendTo(label);
  });
}

function init() {
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

features.add(import.meta.url, init, 'Adds a shipment destination detail to SHPT items.');

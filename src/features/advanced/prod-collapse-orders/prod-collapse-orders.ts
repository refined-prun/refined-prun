import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { computedTileState } from '@src/store/user-data-tiles';
import { keepLast } from '@src/utils/keep-last';
import HiddenIndicator from './HiddenIndicator.vue';
import HideOrders from './HideOrders.vue';
import classes from './prod-collapse-orders.module.css';
import { getTileState } from './tile-state';

async function onTileReady(tile: PrunTile) {
  const parameter = tile.parameter;
  if (!parameter) return;
  const hideOrdersInfo = computedTileState(getTileState(tile), 'hideOrdersInfo', {});
  const infoProxy = computed({
    get: () => {
      return hideOrdersInfo.value;
    },
    set: (data: [string, number, number]) => {
      const result = { ...hideOrdersInfo.value };
      if (data[1] === -1 && data[2] === -1) {
        delete result[data[0]];
      } else {
        result[data[0]] = [data[1], data[2]];
      }
      hideOrdersInfo.value = result;
    },
  });

  subscribe($$(tile.anchor, C.SiteProductionLines.grid), grid => {
    const site = sitesStore.getById(parameter);
    if (!site) return;
    const production = productionStore.getBySiteId(site.siteId);
    if (!production) return;
    let columnIndex = 0;
    subscribe($$(grid, C.SiteProductionLines.column), column => {
      const orders = computed(() => _$$(column, C.OrderSlot.container));
      const diviver = _$(column, C.SiteProductionLines.slotDivider)!;
      if (!diviver) return;

      const lineId = production.find(line =>
        line.orders.some(order => order.id === getPrunId(orders.value[0] as HTMLElement)),
      )!.id;
      if (!lineId) return;

      const line = computed(
        () => productionStore.all.value?.find(prodLine => prodLine.id === lineId)!,
      );

      function setOrdersDisplay(keepCapacity: number, keepSlots: number) {
        infoProxy.value = [line.value.type, keepCapacity, keepSlots];
        orders.value.forEach((order: HTMLElement, index: number) => {
          if (index < line.value.capacity) {
            order.style.display = index < keepCapacity ? '' : 'none';
          } else {
            order.style.display = index < line.value.capacity + keepSlots ? '' : 'none';
          }
        });
      }

      createFragmentApp(
        HideOrders,
        reactive({
          headerOrdersInfo: infoProxy.value[line.value.type],
          capacity: line.value.capacity,
          slots: line.value.slots,
          setOrdersDisplay,
          displayAllOrders: () => {
            orders.value.forEach(order => order.style.removeProperty('display'));
            infoProxy.value = [line.value.type, -1, -1];
          },
        }),
      ).appendTo(_$(grid.children[columnIndex++], C.SiteProductionLines.headerActions)!);

      const hiddenProd = document.createElement('div');
      diviver.before(hiddenProd);
      createFragmentApp(
        HiddenIndicator,
        reactive({
          amtHidden: computed(() =>
            infoProxy.value[line.value.type]
              ? line.value.capacity - infoProxy.value[line.value.type][0]
              : 0,
          ),
        }),
      ).appendTo(hiddenProd);

      const hiddenQueue = document.createElement('div');
      keepLast(column, () => column, hiddenQueue);
      createFragmentApp(
        HiddenIndicator,
        reactive({
          amtHidden: computed(() =>
            infoProxy.value[line.value.type]
              ? line.value.slots - infoProxy.value[line.value.type][1]
              : 0,
          ),
        }),
      ).appendTo(hiddenQueue);

      watch(line, () => {
        diviver.before(hiddenProd);
        setOrdersDisplay(infoProxy.value[line.value.type][0], infoProxy.value[line.value.type][1]);
      });
    });
  });
}

function init() {
  applyCssRule(`.${C.SiteProductionLines.headerActions} :not(:last-child)`, classes.headerActions);
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Collapse all or some ongoing and queued recipes.');

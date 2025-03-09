import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { computedTileState } from '@src/store/user-data-tiles';
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
    production.forEach((line, index) => {
      const headerActions = _$(grid.children[index], C.SiteProductionLines.headerActions);
      if (!headerActions) return;

      const orders = Array.from(
        _$$(grid, C.SiteProductionLines.column)[index].children,
      ) as HTMLElement[];

      const lineName = line.type;
      createFragmentApp(
        HideOrders,
        reactive({
          headerOrdersInfo: infoProxy.value[lineName],
          capacity: line.capacity,
          slots: line.slots,
          setOrdersDisplay: (keepCapacity: number, keepSlots: number) => {
            infoProxy.value = [lineName, keepCapacity, keepSlots];
            orders.forEach((order: HTMLElement, index: number) => {
              if (index < line.capacity) {
                order.style.display = index < keepCapacity ? '' : 'none';
              } else if (index > line.capacity) {
                order.style.display = index - line.capacity - 1 < keepSlots ? '' : 'none';
              }
            });
          },
          displayAllOrders: () => {
            orders.forEach(order => order.style.removeProperty('display'));
            infoProxy.value = [lineName, -1, -1];
          },
        }),
      ).appendTo(headerActions);

      createFragmentApp(
        HiddenIndicator,
        reactive({
          amtHidden: computed(() => {
            return infoProxy.value[lineName] ? line.capacity - infoProxy.value[lineName][0] : 0;
          }),
        }),
      ).before(orders.at(line.capacity)!);

      createFragmentApp(
        HiddenIndicator,
        reactive({
          amtHidden: computed(() => {
            return infoProxy.value[lineName] ? line.slots - infoProxy.value[lineName][1] : 0;
          }),
        }),
      ).after(orders[orders.length - 1]);
    });
  });
}

function init() {
  applyCssRule(`.${C.SiteProductionLines.headerActions} :not(:last-child)`, classes.headerActions);
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Collapse all or some ongoing and queued recipes.');

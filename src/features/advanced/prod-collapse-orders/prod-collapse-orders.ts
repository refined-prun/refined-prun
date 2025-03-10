import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
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
    let columnIndex = 0;
    subscribe($$(grid, C.SiteProductionLines.column), column => {
      const orders = Array.from(column.children) as HTMLElement[];

      let line = production.find(line =>
        line.orders.some(order => order.id === getPrunId(orders[0] as HTMLElement)),
      )!;
      if (!line) return;

      function setOrdersDisplay(keepCapacity: number, keepSlots: number) {
        infoProxy.value = [line.type, keepCapacity, keepSlots];
        orders.forEach((order: HTMLElement, index: number) => {
          if (index < line.capacity) {
            order.style.display = index < keepCapacity ? '' : 'none';
          } else {
            order.style.display = index <= line.capacity + keepSlots ? '' : 'none';
          }
        });
      }

      createFragmentApp(
        HideOrders,
        reactive({
          headerOrdersInfo: infoProxy.value[line.type],
          capacity: line.capacity,
          slots: line.slots,
          setOrdersDisplay,
          displayAllOrders: () => {
            orders.forEach(order => order.style.removeProperty('display'));
            infoProxy.value = [line.type, -1, -1];
          },
        }),
      ).appendTo(_$(grid.children[columnIndex++], C.SiteProductionLines.headerActions)!);

      const hiddenProd = document.createElement('div');
      const hiddenQueue = document.createElement('div');

      function setIndicatorPositions() {
        orders.at(line.capacity)!.before(hiddenProd);
        column.appendChild(hiddenQueue);
      }

      setIndicatorPositions();

      createFragmentApp(
        HiddenIndicator,
        reactive({
          amtHidden: computed(() =>
            infoProxy.value[line.type] ? line.capacity - infoProxy.value[line.type][0] : 0,
          ),
        }),
      ).appendTo(hiddenProd);

      createFragmentApp(
        HiddenIndicator,
        reactive({
          amtHidden: computed(() =>
            infoProxy.value[line.type] ? line.slots - infoProxy.value[line.type][1] : 0,
          ),
        }),
      ).appendTo(hiddenQueue);

      const lineStore = computed(
        () => productionStore.all.value?.find(line => line.id === line.id)!,
      );
      watch(lineStore, (data: PrunApi.ProductionLine) => {
        if (data.capacity === line.capacity && data.slots === line.slots) return;
        setIndicatorPositions();

        const newOrders = Array.from(column.children) as HTMLElement[];
        if (newOrders.length === orders.length) return;
        orders.length = 0;
        orders.push(...newOrders);

        line = data;
        setOrdersDisplay(infoProxy.value[line.type][0], infoProxy.value[line.type][1]);
      });
    });
  });
}

function init() {
  applyCssRule(`.${C.SiteProductionLines.headerActions} :not(:last-child)`, classes.headerActions);
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Collapse all or some ongoing and queued recipes.');

import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { computedTileState } from '@src/store/user-data-tiles';
import { createReactiveDiv } from '@src/utils/reactive-element';
import HideOrders from './HideOrders.vue';
import $style from './prod-collapse-orders.module.css';
import { getTileState } from './tile-state';
import css from '@src/utils/css-utils.module.css';

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
    const production = productionStore.getBySiteId(site?.siteId);
    let columnIndex = 0;
    subscribe($$(grid, C.SiteProductionLines.column), column => {
      const orders = computed(() => {
        return _$$(column, C.OrderSlot.container);
      });
      const diviver = _$(column, C.SiteProductionLines.slotDivider)!;
      if (!diviver) return;

      const lineId = production?.find(line => {
        return line.orders.some(order => {
          return order.id === getPrunId(orders.value[0] as HTMLElement);
        });
      })?.id;

      const line = computed(() => {
        return productionStore.all.value!.find(prodLine => {
          return prodLine.id === lineId;
        })!;
      });

      function setOrdersDisplay(keepCapacity: number, keepSlots: number) {
        infoProxy.value = [line.value.type, keepCapacity, keepSlots];
        for (let i = 0; i < orders.value.length; i++) {
          if (i < line.value.capacity) {
            orders.value[i].classList.toggle(css.hidden, i >= keepCapacity);
          } else {
            orders.value[i].classList.toggle(css.hidden, i >= line.value.capacity + keepSlots);
          }
        }
      }

      createFragmentApp(
        HideOrders,
        reactive({
          headerOrdersInfo: infoProxy.value[line.value.type],
          capacity: line.value.capacity,
          slots: line.value.slots,
          setOrdersDisplay,
          displayAllOrders: () => {
            for (const order of orders.value) {
              order.classList.toggle(css.hidden, false);
            }
            infoProxy.value = [line.value.type, -1, -1];
          },
        }),
      ).appendTo(_$(grid.children[columnIndex++], C.SiteProductionLines.headerActions)!);

      const hiddenProdText = ref(
        computed(() => {
          if (infoProxy.value[line.value.type]) {
            const amt = line.value.capacity - infoProxy.value[line.value.type][0];
            if (amt) {
              return `+${amt} more`;
            }
          }
          return undefined;
        }),
      );
      const hiddenProd = createReactiveDiv(column, hiddenProdText);
      hiddenProd.style.textAlign = 'center';
      hiddenProd.style.fontSize = '9px';
      column.insertBefore(hiddenProd, diviver);

      const hiddenQueueText = ref(
        computed(() => {
          if (infoProxy.value[line.value.type]) {
            const amt = line.value.slots - infoProxy.value[line.value.type][1];
            if (amt) {
              return `+${amt} more`;
            }
          }
          return undefined;
        }),
      );
      const hiddenQueue = createReactiveDiv(column, hiddenQueueText);
      hiddenQueue.style.textAlign = 'center';
      hiddenQueue.style.fontSize = '9px';
      column.appendChild(hiddenQueue);

      // Doesn't need to be updated on infoProxy changes, so only watch line.
      watch(line, () => {
        column.insertBefore(hiddenProd, diviver);
        column.appendChild(hiddenQueue);
        setOrdersDisplay(infoProxy.value[line.value.type][0], infoProxy.value[line.value.type][1]);
      });
    });
  });
}

function init() {
  applyCssRule(`.${C.SiteProductionLines.headerActions}`, $style.headerActions);
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Collapse all or some ongoing and queued recipes.');

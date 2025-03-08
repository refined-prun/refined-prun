import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { computedTileState } from '@src/store/user-data-tiles';
import HideOrders from './HideOrders.vue';
import classes from './prod-collapse-orders.module.css';
import { getTileState } from './tile-state';

async function onTileReady(tile: PrunTile) {
  const hideOrdersInfo = computedTileState(
    getTileState(tile),
    'hideOrdersInfo',
    new Map<string, number[]>(),
  );
  console.log(hideOrdersInfo);

  const siteProductionGrid = await $(tile.anchor, C.SiteProductionLines.grid);
  const headerCount = siteProductionGrid.children.length / 2;
  for (let counter = 0; counter < headerCount; counter++) {
    subscribe(
      $$(siteProductionGrid.children[counter], C.SiteProductionLines.headerActions),
      headerActions => {
        const headerName = headerActions.parentElement?.children[0].children[0].innerHTML!;
        const prodLineOrdersAmt = getOrdersAmt(siteProductionGrid, headerCount + counter);
        createFragmentApp(
          HideOrders,
          reactive({
            hideOrdersInfo: (hideOrdersInfo.value as Map<string, number[]>).get(headerName)!,
            totalProd: prodLineOrdersAmt[0],
            totalQueue: prodLineOrdersAmt[1],
            setOrdersDisplay: (keepProdAmt: number, keepQueueAmt: number) => {
              setOrdersDisplay(
                siteProductionGrid,
                headerCount + counter,
                keepProdAmt,
                keepQueueAmt,
              );
              (hideOrdersInfo.value as Map<string, number[]>).set(headerName, [
                keepProdAmt,
                keepQueueAmt,
              ]);
              console.log(hideOrdersInfo);
            },
            displayAllOrders: () => {
              displayAllOrders(siteProductionGrid, headerCount + counter);
            },
          }),
        ).appendTo(headerActions);
      },
    );
  }
}

function setOrdersDisplay(
  grid: HTMLElement,
  gridIndex: number,
  keepProdAmt: number,
  keepQueueAmt: number,
) {
  const siteProductionLine = grid.children[gridIndex];
  if (siteProductionLine) {
    const orders = Array.from(siteProductionLine.children) as HTMLElement[];
    const dividerIndex = orders.findIndex(order =>
      order.classList.contains(C.SiteProductionLines.slotDivider),
    );
    const prodOrders = orders.slice(0, dividerIndex);
    setDisplayOnOrders(prodOrders, keepProdAmt);
    const queueOrders = orders.slice(dividerIndex + 1, orders.length);
    setDisplayOnOrders(queueOrders, keepQueueAmt);
  }
}

function setDisplayOnOrders(orders: HTMLElement[], keepAmt: number) {
  for (let counter = 0; counter < orders.length; counter++) {
    if (counter < keepAmt) {
      orders[counter].style.display = 'flex';
    } else {
      orders[counter].style.display = 'none';
    }
  }
}

function displayAllOrders(grid: HTMLElement, gridIndex: number) {
  const siteProductionLine = grid.children[gridIndex];
  if (siteProductionLine) {
    const orders = Array.from(siteProductionLine.children) as HTMLElement[];
    for (const order of orders) {
      order.style.display = 'flex';
    }
  }
}

function getOrdersAmt(grid: HTMLElement, gridIndex: number) {
  const siteProductionLine = grid.children[gridIndex];
  if (siteProductionLine) {
    const orders = Array.from(siteProductionLine.children) as HTMLElement[];
    const dividerIndex = orders.findIndex(order =>
      order.classList.contains(C.SiteProductionLines.slotDivider),
    );
    return [dividerIndex, orders.length - dividerIndex - 1];
  }
  return [0, 0];
}

function init() {
  applyCssRule(`.${C.SiteProductionLines.headerActions} :not(:last-child)`, classes.headerActions);
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Collapse all or some ongoing and queued recipes');

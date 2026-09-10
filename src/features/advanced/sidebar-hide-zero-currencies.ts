import css from '@src/utils/css-utils.module.css';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

async function onSidebarLineReady(sidebarLine: HTMLElement) {
  const currencyCodeElement = await $(sidebarLine, C.Sidebar.currencyCode);
  const currencyCode = currencyCodeElement.textContent?.trim();
  if (!currencyCode) {
    return;
  }

  watchEffectWhileNodeAlive(sidebarLine, () => {
    const amount = balancesStore.all.value?.find(x => x.currency === currencyCode)?.amount;
    sidebarLine.classList.toggle(css.hidden, amount === 0);
  });
}

function init() {
  subscribe($$(document, C.Sidebar.sidebarLine), onSidebarLineReady);
}

features.add(import.meta.url, init, 'Hides currencies with zero balance in the right sidebar.');

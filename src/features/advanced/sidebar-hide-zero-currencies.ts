import css from '@src/utils/css-utils.module.css';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import '@src/utils/set-trim-disconnected';

const sidebarLines = new Set<HTMLElement>();

function updateSidebarLines() {
  sidebarLines.trimDisconnected();
  const balances = balancesStore.all.value ?? [];

  for (const sidebarLine of sidebarLines) {
    const currencyCode = _$(sidebarLine, C.Sidebar.currencyCode)?.textContent?.trim();
    if (!currencyCode) {
      continue;
    }

    const amount = balances.find(x => x.currency === currencyCode)?.amount;
    const isZero = amount === 0;
    sidebarLine.classList.toggle(css.hidden, isZero);
  }
}

function init() {
  subscribe($$(document, C.Sidebar.sidebarLine), sidebarLine => {
    sidebarLines.add(sidebarLine);
    updateSidebarLines();
  });

  watch(() => balancesStore.all.value, updateSidebarLines, { deep: true });
}

features.add(import.meta.url, init, 'Hides currencies with zero balance in the right sidebar.');

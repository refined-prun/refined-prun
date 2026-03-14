import css from '@src/utils/css-utils.module.css';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import '@src/utils/set-trim-disconnected';

const sidebarLines = new Set<HTMLElement>();

function updateSidebarLine(
  sidebarLine: HTMLElement,
  balances: readonly { currency: string; amount: number }[],
) {
  const currencyCode = _$(sidebarLine, C.Sidebar.currencyCode)?.textContent?.trim();
  if (!currencyCode) {
    return;
  }

  const amount = balances.find(x => x.currency === currencyCode)?.amount;
  const amountText = _$(sidebarLine, C.Sidebar.amount)?.textContent?.trim() ?? '';
  const isZero = amount === 0 || isDisplayedZeroAmount(amountText);
  sidebarLine.classList.toggle(css.hidden, isZero);
}

function isDisplayedZeroAmount(text: string) {
  const compact = text.replaceAll('\u00A0', '').replaceAll(' ', '');
  const normalized = compact.replaceAll(',', '');
  if (normalized === '') {
    return false;
  }
  return Number(normalized) === 0;
}

function updateSidebarLines() {
  sidebarLines.trimDisconnected();
  const balances = balancesStore.all.value ?? [];

  for (const sidebarLine of sidebarLines) {
    updateSidebarLine(sidebarLine, balances);
  }
}

function onSidebarLineReady(sidebarLine: HTMLElement) {
  sidebarLines.add(sidebarLine);
  updateSidebarLines();
}

function init() {
  subscribe($$(document, C.Sidebar.sidebarLine), onSidebarLineReady);

  watch(
    () => balancesStore.all.value,
    () => {
      updateSidebarLines();
    },
    { deep: true },
  );
}

features.add(import.meta.url, init, 'Hides currencies with zero balance in the right sidebar.');

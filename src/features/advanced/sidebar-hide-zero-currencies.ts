import css from '@src/utils/css-utils.module.css';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';

const sidebarLines = new Set<HTMLElement>();

function updateSidebarLine(sidebarLine: HTMLElement) {
  const amountsByCurrency = new Map<string, number>();
  for (const x of balancesStore.all.value ?? []) {
    amountsByCurrency.set(x.currency, x.amount);
  }

  const currencyCode = _$(sidebarLine, C.Sidebar.currencyCode)?.textContent?.trim();
  if (!currencyCode) {
    return;
  }

  const amount = amountsByCurrency.get(currencyCode);
  const amountText = _$(sidebarLine, C.Sidebar.amount)?.textContent?.trim() ?? '';
  const isZero = amount === 0 || isDisplayedZeroAmount(amountText);
  sidebarLine.classList.toggle(css.hidden, isZero);
}

function isDisplayedZeroAmount(text: string) {
  const compact = text.replaceAll('\u00A0', '').replaceAll(' ', '');
  const normalized = compact.replace(/[^0-9,.-]/g, '');
  return /^-?0([.,]0+)?$/.test(normalized);
}

function onSidebarLineReady(sidebarLine: HTMLElement) {
  sidebarLines.add(sidebarLine);
  updateSidebarLine(sidebarLine);
}

function init() {
  subscribe($$(document, C.Sidebar.sidebarLine), onSidebarLineReady);

  watch(
    () => balancesStore.all.value,
    () => {
      for (const sidebarLine of sidebarLines) {
        if (!sidebarLine.isConnected) {
          sidebarLines.delete(sidebarLine);
          continue;
        }
        updateSidebarLine(sidebarLine);
      }
    },
    { deep: true },
  );
}

features.add(import.meta.url, init, 'Hides currencies with zero balance in the right sidebar.');

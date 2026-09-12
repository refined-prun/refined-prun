import { parseDisplayedInteger } from './numbers';

// The drag payload is not usable. Read the source icon and selected inventory stacks.
let lastDragSource: Element | undefined;

export function trackDragSource() {
  document.addEventListener(
    'dragstart',
    e => {
      lastDragSource = (e.target as Element).closest('[draggable="true"]') ?? undefined;
    },
    true,
  );
}

export interface DraggedStack {
  ticker: string;
  quantity: number;
}

function readStack(container: Element): DraggedStack | undefined {
  const ticker = _$(container, C.ColoredIcon.label)?.textContent?.trim();
  const text = _$(container, C.MaterialIcon.indicator)?.textContent;
  if (!ticker || !text) {
    return undefined;
  }
  // Item IDs repeat across stores, so read the amount from this source icon.
  const quantity = parseDisplayedInteger(text);
  return quantity === undefined ? undefined : { ticker, quantity };
}

export function getDraggedStacks() {
  const source = lastDragSource;
  if (!source) {
    return [];
  }
  const container = source.closest(`.${C.GridItemView.container}`);
  if (!container?.classList.contains(C.GridItemView.selected)) {
    const stack = readStack(source);
    return stack ? [stack] : [];
  }
  const grid = container.closest(`.${C.InventoryView.grid}`);
  const containers = grid ? _$$(grid, C.GridItemView.container) : [container];
  return containers
    .filter(x => x.classList.contains(C.GridItemView.selected))
    .map(readStack)
    .filter(x => x !== undefined);
}

export interface QuickAmount {
  label: string;
  // Sort quantity for the largest stack.
  amount: number;
  resolve: (stack: DraggedStack) => number;
  // Open a quantity prompt instead of adding a row.
  prompt?: boolean;
}

export function quickAmounts(quantity: number, single: boolean): QuickAmount[] {
  const options: QuickAmount[] = [
    { label: '1', amount: 1, resolve: stack => Math.min(1, stack.quantity) },
  ];
  for (let power = 10; power <= quantity; power *= 10) {
    options.push({
      label: String(power),
      amount: power,
      resolve: stack => Math.min(power, stack.quantity),
    });
  }
  options.push({
    label: 'HLF',
    amount: Math.floor(quantity / 2),
    resolve: stack => Math.max(1, Math.floor(stack.quantity / 2)),
  });
  options.push({ label: 'ALL', amount: quantity, resolve: stack => stack.quantity });
  const sorted = options.filter(option => option.amount >= 1).sort((a, b) => a.amount - b.amount);
  if (!single) {
    return sorted;
  }
  return [
    { label: 'AMT', amount: quantity, resolve: stack => stack.quantity, prompt: true },
    ...sorted,
  ];
}

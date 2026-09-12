import {
  changeInputValue,
  changeSelectIndex,
  clickElement,
  focusElement,
  selectMaterialInMaterialSelector,
  selectAndChangeInputValue,
} from '@src/util';
import { waitUntil } from '@src/utils/wait';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';
import { getMaterialByName } from '@src/infrastructure/prun-ui/i18n';
import { ContractDraftSpec, MaterialEntry, TemplateType } from './parsers';
import { selectAddress } from '@src/infrastructure/prun-ui/utils/select-address';
import { formatGamePrice, parseGameNumber } from './numbers';

// Fill local template fields without submitting the template.

function findTemplateSelect(anchor: Element) {
  const container = _$(anchor, C.TemplateSelection.templateTypeSelect);
  return container ? _$(container, 'select') : undefined;
}

export function currentTemplateType(anchor: Element): TemplateType | undefined {
  const value = findTemplateSelect(anchor)?.value;
  return value === 'BUY' || value === 'SELL' || value === 'SHIP' ? value : undefined;
}

// Loan fields are not represented in the export format.
export function isLoanTemplate(anchor: Element) {
  return findTemplateSelect(anchor)?.value.startsWith('LOAN') ?? false;
}

// Wait for the new template type to render its amount input.
function amountInputName(type: TemplateType) {
  return type === 'SHIP' ? 'shipments[0].amount' : 'trades[0].amount';
}

export async function selectTemplateType(anchor: Element, type: TemplateType) {
  const select = findTemplateSelect(anchor);
  if (!select) {
    return false;
  }
  const index = Array.from(select.options).findIndex(option => option.value === type);
  if (index < 0) {
    return false;
  }
  if (select.value !== type) {
    changeSelectIndex(select, index);
  }
  return await waitUntil(
    () => _$$(anchor, 'input').some(x => x.name === amountInputName(type)),
    3000,
  );
}

export async function setCurrency(anchor: Element, currency: string): Promise<boolean> {
  const found = await waitUntil(() => !!findCurrencySelect(anchor, currency), 3000);
  if (!found) {
    return false;
  }
  const select = findCurrencySelect(anchor, currency)!;
  const index = Array.from(select.options).findIndex(option => option.value === currency);
  changeSelectIndex(select, index);
  return true;
}

function findCurrencySelect(anchor: Element, currency: string) {
  return _$$(anchor, 'select').find(select =>
    Array.from(select.options).some(option => option.value === currency),
  );
}

// Currency options are three-letter codes, with an optional blank placeholder.
function findAnyCurrencySelect(anchor: Element) {
  return _$$(anchor, 'select').find(select => {
    if (select.options.length < 2) {
      return false;
    }
    const values = Array.from(select.options)
      .map(option => option.value)
      .filter(value => value !== '');
    return values.length > 0 && values.every(value => /^[A-Z]{3}$/.test(value));
  });
}

// The game charges the price once per shipment row.
export function setShipPrice(anchor: Element, payment: number) {
  const groupCount = _$$(anchor, C.TemplateSelection.group).length;
  const pricePerRow = Math.max(1, Math.round(payment / Math.max(1, groupCount)));

  const priceInput = _$$(anchor, 'input').find(x => x.name === 'price');
  if (!priceInput) {
    return false;
  }
  selectAndChangeInputValue(priceInput, String(pricePerRow));
  return true;
}

// Store options load after the origin resolves. Booleans select the first store or none;
// strings match a store ID or part of its name.
export async function setAutoProvision(anchor: Element, store: string | boolean) {
  if (store === false) {
    const select = _$(anchor, C.StoreSelect.container) as HTMLSelectElement | undefined;
    if (select) {
      changeSelectIndex(select, 0);
      return true;
    }
    // An empty store list renders the field label without a select.
    return _$$(anchor, 'label').some(x => x.htmlFor === 'autoProvisionStore');
  }
  const findSelect = () => {
    const select = _$(anchor, C.StoreSelect.container) as HTMLSelectElement | undefined;
    return select && select.options.length > 1 ? select : undefined;
  };
  const ready = await waitUntil(() => !!findSelect(), 5000);
  if (!ready) {
    return false;
  }
  const select = findSelect()!;
  if (store === true) {
    changeSelectIndex(select, 1);
    return true;
  }
  const needle = store.toLowerCase();
  const index = Array.from(select.options).findIndex(
    option => option.value === store || option.text.toLowerCase().includes(needle),
  );
  if (index < 0) {
    return false;
  }
  changeSelectIndex(select, index);
  return true;
}

export function setDeadline(anchor: Element, days: number) {
  const input = _$$(anchor, 'input').find(x => x.name === 'deadline');
  if (!input) {
    return false;
  }
  selectAndChangeInputValue(input, String(days));
  return true;
}

function findAddCommodityButton(anchor: Element) {
  return _$$(anchor, 'button').find(
    x =>
      x.textContent === L.TemplateSelection.action.addCommodity() ||
      x.textContent === L.TemplateSelection.action.addShipment(),
  );
}

async function waitForGroupCount(anchor: Element, expected: number, timeout = 2000) {
  await waitUntil(() => _$$(anchor, C.TemplateSelection.group).length >= expected, timeout);
}

// Shipment rows have no per-row price input.
export async function importMaterials(anchor: Element, materials: MaterialEntry[]) {
  const issues: string[] = [];
  for (let i = 0; i < materials.length; i++) {
    let groups = _$$(anchor, C.TemplateSelection.group);
    if (groups.length <= i) {
      await clickElement(findAddCommodityButton(anchor));
      await waitForGroupCount(anchor, i + 1);
      groups = _$$(anchor, C.TemplateSelection.group);
    }

    if (groups.length <= i) {
      issues.push(`material ${materials[i].ticker} (row ${i + 1})`);
      continue;
    }
    const group = groups[i];
    const { ticker, amount, price } = materials[i];

    const amountInput = _$$(group, 'input').find(x => x.inputMode === 'numeric');
    if (amountInput) {
      focusElement(amountInput);
      changeInputValue(amountInput, String(amount));
    }

    if (price !== undefined) {
      const priceInput = _$$(group, 'input').find(x => x.inputMode === 'decimal');
      if (priceInput) {
        focusElement(priceInput);
        changeInputValue(priceInput, formatGamePrice(price));
      }
    }

    const materialSelectorContainer = _$(group, C.MaterialSelector.container);
    if (
      materialSelectorContainer === undefined ||
      !(await selectMaterialInMaterialSelector(materialSelectorContainer, ticker))
    ) {
      issues.push(`material ${ticker} (row ${i + 1})`);
    }
  }
  return issues;
}

function readInputNumber(input: HTMLInputElement | null | undefined) {
  const text = input?.value.trim();
  if (!text) {
    return undefined;
  }
  return parseGameNumber(text, input!.inputMode === 'decimal');
}

// Export local form fields; omit empty values and unsupported loan fields.
export function readDraftSpec(anchor: Element): ContractDraftSpec {
  const spec: ContractDraftSpec = { materials: [] };

  const type = currentTemplateType(anchor);
  if (type) {
    spec.type = type;
  }

  const currency = findAnyCurrencySelect(anchor)?.value;
  if (currency) {
    spec.currency = currency;
  }

  const addresses = _$$(anchor, C.AddressSelector.container);
  const addressValue = (index: number) => {
    const container = addresses.at(index);
    const input = container
      ? (_$(container, C.AddressSelector.input) as HTMLInputElement | undefined)
      : undefined;
    const value = input?.value.trim();
    if (!value) {
      return undefined;
    }
    // Station inputs hold system IDs. Export names for readable, reusable JSON.
    return (
      stationsStore.getByNaturalId(value)?.name ??
      planetsStore.getByNaturalId(value)?.name ??
      stationsStore.getBySystemNaturalId(value)?.name ??
      value
    );
  };
  if (type === 'SHIP') {
    spec.origin = addressValue(0);
    spec.destination = addressValue(1);
  } else {
    spec.location = addressValue(0);
  }

  const groups = _$$(anchor, C.TemplateSelection.group);

  if (type === 'SHIP') {
    // Convert the per-shipment price to a contract total.
    const priceInput = _$$(anchor, 'input').find(x => x.name === 'price');
    const price = readInputNumber(priceInput);
    if (price !== undefined) {
      spec.payment = price * Math.max(1, groups.length);
    }

    // Store IDs are account-specific, so export whether auto-provision is enabled.
    const storeSelect = _$(anchor, C.StoreSelect.container) as HTMLSelectElement | undefined;
    if (storeSelect) {
      spec.autoProvision = storeSelect.selectedIndex > 0;
    }
  }

  spec.deadline = readInputNumber(_$$(anchor, 'input').find(x => x.name === 'deadline'));

  for (const group of groups) {
    // Selected materials use localized display names; unselected inputs can hold tickers.
    const selector = _$(group, C.MaterialSelector.container);
    const value = selector ? _$(selector, 'input')?.value.trim() : undefined;
    const material = getMaterialByName(value) ?? materialsStore.getByTicker(value);
    if (!material) {
      continue;
    }
    const ticker = material.ticker;
    const amount = readInputNumber(_$$(group, 'input').find(x => x.inputMode === 'numeric')) ?? 0;
    const price =
      type === 'SHIP'
        ? undefined
        : readInputNumber(_$$(group, 'input').find(x => x.inputMode === 'decimal'));
    spec.materials.push({ ticker, amount, price });
  }

  // List contract fields before the material array.
  const { materials, ...fields } = spec;
  return { ...fields, materials };
}

// Fill the type before its fields and payment after materials.
// Disable auto-provision before changing the origin; select a store after it resolves.
export async function importSpec(anchor: Element, spec: ContractDraftSpec) {
  const issues: string[] = [];

  if (spec.type && !(await selectTemplateType(anchor, spec.type))) {
    issues.push(`template ${spec.type}`);
  }
  const isShip = currentTemplateType(anchor) === 'SHIP';

  if (spec.currency && !(await setCurrency(anchor, spec.currency))) {
    issues.push(`currency ${spec.currency}`);
  }

  issues.push(...(await importMaterials(anchor, spec.materials)));

  if (spec.payment !== undefined) {
    if (!isShip) {
      issues.push('payment (SHIP only)');
    } else if (!setShipPrice(anchor, spec.payment)) {
      issues.push('payment');
    }
  }

  const addresses = _$$(anchor, C.AddressSelector.container);
  const fillAddress = async (index: number, name: string, label: string) => {
    const address = addresses.at(index);
    if (!address || !(await selectAddress(address, name))) {
      issues.push(`${label} ${name}`);
    }
  };
  if (isShip) {
    if (spec.location) {
      issues.push('location (BUY/SELL only)');
    }
    // Clear the old store before a new origin can hide its select.
    if (spec.autoProvision === false && !(await setAutoProvision(anchor, false))) {
      issues.push('auto-provision false');
    }
    if (spec.origin) {
      await fillAddress(0, spec.origin, 'origin');
    }
    if (spec.destination) {
      await fillAddress(1, spec.destination, 'destination');
    }
    if (
      spec.autoProvision !== undefined &&
      spec.autoProvision !== false &&
      !(await setAutoProvision(anchor, spec.autoProvision))
    ) {
      issues.push(`auto-provision ${spec.autoProvision}`);
    }
  } else {
    if (spec.origin || spec.destination) {
      issues.push('origin/destination (SHIP only)');
    }
    if (spec.autoProvision !== undefined) {
      issues.push('auto-provision (SHIP only)');
    }
    if (spec.location) {
      await fillAddress(0, spec.location, 'location');
    }
  }

  if (spec.deadline !== undefined && !setDeadline(anchor, spec.deadline)) {
    issues.push('deadline');
  }

  return issues;
}

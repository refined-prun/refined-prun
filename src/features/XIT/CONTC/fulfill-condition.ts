import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { clickElement } from '@src/util';
import { waitActionFeedback } from '@src/utils/action-feedback';
import css from '@src/utils/css-utils.module.css';

const FULFILLABLE_TYPES: ReadonlySet<PrunApi.ContractConditionType> = new Set([
  'PROVISION',
  'DELIVERY',
  'PAYMENT',
  'PICKUP',
  'PICKUP_SHIPMENT',
  'DELIVERY_SHIPMENT',
  'COMEX_PURCHASE_PICKUP',
  'PROVISION_SHIPMENT',
  'LOAN_PAYOUT',
  'LOAN_INSTALLMENT',
  'GATEWAY_FUEL',
  'INFRASTRUCTURE_UPKEEP',
  'WORKFORCE_PROGRAM_PAYMENT',
]);

export function isFulfillable(
  contract: PrunApi.Contract,
  condition: PrunApi.ContractCondition,
): boolean {
  if (contract.status === 'OPEN') {
    return false;
  }
  return FULFILLABLE_TYPES.has(condition.type);
}

export async function fulfillCondition(
  contract: PrunApi.Contract,
  condition: PrunApi.ContractCondition,
): Promise<{ success: boolean; error?: string }> {
  const done = ref(false);
  try {
    const command = `CONT ${contract.localId}`;
    await showBuffer(command, {
      force: true,
      autoSubmit: true,
      autoClose: true,
      closeWhen: done,
    });

    // Find the tile that was just opened.
    const tile = tiles.find(command, true)[0];
    if (tile === undefined) {
      return { success: false, error: 'Failed to open contract buffer.' };
    }

    // Wait for the conditions table to render.
    await $(tile.anchor, 'tbody');

    // Find the row matching our condition's index.
    // Conditions are sorted by index in the CONT table.
    const sorted = [...contract.conditions].sort((a, b) => a.index - b.index);
    const idx = sorted.findIndex(x => x.id === condition.id);
    if (idx < 0) {
      return { success: false, error: 'Could not find condition in contract.' };
    }

    const rows = _$$(tile.anchor, 'tr');
    // Skip the header row.
    const dataRows = rows.filter(x => _$$(x, 'td').length > 0);
    if (idx >= dataRows.length) {
      return { success: false, error: 'Could not find condition row.' };
    }

    const row = dataRows[idx];
    const fulfillBtn = _$$(row, C.Button.success).find(
      x => x.textContent?.trim().toLowerCase() === 'fulfill',
    );
    if (fulfillBtn === undefined) {
      return { success: false, error: 'Cannot fulfill this condition right now.' };
    }

    // Replace display:none with offscreen positioning so React processes events.
    const bufferWindow = tile.frame.closest(`.${C.Window.window}`) as HTMLElement | null;
    if (bufferWindow) {
      bufferWindow.classList.remove(css.hidden);
      bufferWindow.style.position = 'fixed';
      bufferWindow.style.left = '-9999px';
    }
    await clickElement(fulfillBtn as HTMLElement);

    const error = await waitActionFeedback(tile.frame);
    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } finally {
    done.value = true;
  }
}

import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { clickElement } from '@src/util';
import { waitActionFeedback } from '@src/utils/action-feedback';

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
    await showBuffer(command, { force: true, autoSubmit: true, autoClose: true, closeWhen: done });

    // Find the tile that was just opened.
    const tile = tiles.find(command, true)[0];
    if (tile === undefined) {
      return { success: false, error: 'Failed to open contract buffer.' };
    }

    // Wait for sections to render.
    await $(tile.anchor, C.SectionList.section);

    const sections = _$$(tile.anchor, C.SectionList.section);
    const sorted = [...contract.conditions].sort((a, b) => a.index - b.index);
    const idx = sorted.findIndex(x => x.id === condition.id);
    if (idx < 0 || idx >= sections.length) {
      return { success: false, error: 'Could not find condition section.' };
    }

    const section = sections[idx];
    const buttons = _$$(section, C.SectionList.button);
    const fulfillBtn = buttons.find(x => x.textContent?.trim().toLowerCase() === 'fulfill');
    if (fulfillBtn === undefined) {
      return { success: false, error: 'Fulfill button not found in condition section.' };
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

import { sendPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';
import { context } from '@src/infrastructure/prun-api/data/screens';
import { companyContextId } from '@src/infrastructure/prun-api/data/user-data';

export function transferItem(sourceStoreId: string, targetStoreId: string, itemId: string) {
  const contextId = context.value ?? companyContextId.value;
  return sendPrunMessage({
    messageType: 'STORAGE_TRANSFER_ITEM',
    payload: {
      sourceStoreId,
      targetStoreId,
      itemId,
      actionId: crypto.randomUUID(),
    },
    contextId,
  });
}

import { loadUserData } from '@src/infrastructure/storage/user-data-serializer';
import { initializeTileListener } from '@src/store/user-data-tiles';
import { trackBalanceHistory } from '@src/store/user-data-balance';

export function initializeUserData() {
  loadUserData();
  initializeTileListener();
  trackBalanceHistory();
}

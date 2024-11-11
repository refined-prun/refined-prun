import { inject } from 'vue';
import xit from '@src/features/XIT/xit-registry';

export function useXitParameters() {
  return inject(xit.parameters) ?? [];
}

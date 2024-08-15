import './pending-contracts-add-details.css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import PrunCss from '@src/prun-ui/prun-css';
import { widgetAfter } from '@src/utils/vue-mount';
import ContractPartnerName from '@src/features/pending-contracts-add-details/ContractPartnerName.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { reactive } from 'vue';
import { showBuffer } from '@src/util';

function onContractIdReady(id: HTMLDivElement) {
  id.addEventListener('click', () => showBuffer(`CONT ${id.textContent}`));
  widgetAfter(
    id,
    ContractPartnerName,
    reactive({
      contractLocalId: refTextContent(id),
    }),
  );
}

export function init() {
  observeReadyElementsByClassName(PrunCss.Sidebar.contractId, onContractIdReady);
}

void features.add({
  id: 'pending-contracts-add-details',
  init,
  attribute: true,
});

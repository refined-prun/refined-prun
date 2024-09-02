import classes from './pending-contracts-add-details.module.css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { widgetAfter } from '@src/utils/vue-mount';
import ContractPartnerName from './ContractPartnerName.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { reactive } from 'vue';
import { showBuffer } from '@src/util';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

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
  applyCssRule(`.${PrunCss.Sidebar.contract} .${PrunCss.Link.link}`, classes.link);
  applyCssRule(`.${PrunCss.Sidebar.contractId}`, classes.contractId);
  applyCssRule(`.${PrunCss.Sidebar.contractId}:hover`, `${classes.contractId}:hover`);
  observeReadyElementsByClassName(PrunCss.Sidebar.contractId, onContractIdReady);
}

void features.add({
  id: 'pending-contracts-add-details',
  init,
  attribute: true,
});

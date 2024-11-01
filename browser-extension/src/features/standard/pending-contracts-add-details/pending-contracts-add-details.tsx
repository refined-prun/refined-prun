import css from '@src/utils/css-utils.module.css';
import classes from './pending-contracts-add-details.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContractPartnerName from './ContractPartnerName.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { reactive } from 'vue';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';

function onContractIdReady(id: HTMLElement) {
  id.addEventListener('click', () => showBuffer(`CONT ${id.textContent}`));
  createFragmentApp(
    ContractPartnerName,
    reactive({
      contractLocalId: refTextContent(id),
    }),
  ).after(id);
}

export function init() {
  applyCssRule(`.${PrunCss.Sidebar.contract} .${PrunCss.Link.link}`, css.hidden);
  applyCssRule(`.${PrunCss.Sidebar.contractId}`, classes.contractId);
  applyCssRule(`.${PrunCss.Sidebar.contractId}:hover`, `${classes.contractId}:hover`);
  subscribe($$(document, PrunCss.Sidebar.contractId), onContractIdReady);
}

void features.add({
  id: 'pending-contracts-add-details',
  description: 'Adds a partner name to contracts in the sidebar.',
  init,
});

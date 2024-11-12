import css from '@src/utils/css-utils.module.css';
import classes from './pending-contracts-add-details.module.css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContractPartnerName from './ContractPartnerName.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function onContractIdReady(id: HTMLElement) {
  id.addEventListener('click', () => showBuffer(`CONT ${id.textContent}`));
  createFragmentApp(
    ContractPartnerName,
    reactive({
      contractLocalId: refTextContent(id),
    }),
  ).after(id);
}

function init() {
  applyCssRule(`.${PrunCss.Sidebar.contract} .${PrunCss.Link.link}`, css.hidden);
  applyCssRule(`.${PrunCss.Sidebar.contractId}`, classes.contractId);
  applyCssRule(`.${PrunCss.Sidebar.contractId}:hover`, `${classes.contractId}:hover`);
  subscribe($$(document, PrunCss.Sidebar.contractId), onContractIdReady);
}

features.add({
  id: 'pending-contracts-add-details',
  description: 'Adds a partner name to contracts in the sidebar.',
  init,
});

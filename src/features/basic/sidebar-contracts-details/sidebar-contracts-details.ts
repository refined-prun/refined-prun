import css from '@src/utils/css-utils.module.css';
import classes from './sidebar-contracts-details.module.css';
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
  applyCssRule(`.${C.Sidebar.contract} .${C.Link.link}`, css.hidden);
  applyCssRule(`.${C.Sidebar.contractId}`, classes.contractId);
  applyCssRule(`.${C.Sidebar.contractId}:hover`, `${classes.contractId}:hover`);
  subscribe($$(document, C.Sidebar.contractId), onContractIdReady);
}

features.add(
  import.meta.url,
  init,
  'Adds a partner name to contracts in the sidebar on the right.',
);

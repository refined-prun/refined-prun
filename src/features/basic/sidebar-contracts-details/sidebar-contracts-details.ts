import css from '@src/utils/css-utils.module.css';
import link from '@src/infrastructure/prun-ui/css/link.module.css';
import $style from './sidebar-contracts-details.module.css';
import ContractPartnerName from './ContractPartnerName.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function onContractIdReady(id: HTMLElement) {
  id.addEventListener('click', e => {
    void showBuffer(`CONT ${id.textContent}`);
    e.preventDefault();
    e.stopPropagation();
  });
  createFragmentApp(
    ContractPartnerName,
    reactive({
      contractLocalId: refTextContent(id),
    }),
  ).after(id);
}

function init() {
  applyCssRule(`.${C.Sidebar.contract} .${C.Link.link}:last-child`, css.hidden);
  applyCssRule(`.${C.Sidebar.contractId}`, link.link);
  applyCssRule(`.${C.Sidebar.contractId}`, $style.contractId);
  subscribe($$(document, C.Sidebar.contractId), onContractIdReady);
}

features.add(
  import.meta.url,
  init,
  'Adds a partner name to contracts in the sidebar on the right.',
);

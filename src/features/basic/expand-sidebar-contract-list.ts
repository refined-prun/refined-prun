import $style from './expand-sidebar-contract-list.module.css';
import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { clickElement } from '@src/util';

async function onSidebarReady(sidebar: HTMLElement) {
  const sectionHeads = _$$(sidebar, C.Sidebar.sectionHead);
  if (sectionHeads.length === 0) {
    return;
  }

  const localizedTitle = PrunI18N['Sidebar.header.contracts']?.[0]?.value;
  const contractTitle = sectionHeads.find(x => x.textContent === localizedTitle);
  if (!contractTitle) {
    return;
  }

  const contractsSection = contractTitle.parentElement!;
  const contractsSectionContent = await $(contractsSection, C.Sidebar.sectionContent);
  contractsSection.classList.add($style.contractsSection);
  contractsSectionContent.classList.add($style.contractsSectionContent);
  subscribe($$(contractsSectionContent, C.EndlessScrollControl.loadMore), loadMore => {
    loadMore.style.display = 'none';
    void clickLoadMore(loadMore);
  });
}

async function clickLoadMore(loadMore: HTMLElement) {
  if (!loadMore.isConnected) {
    return;
  }
  if (!loadMore.classList.contains(C.EndlessScrollControl.hidden)) {
    await clickElement(loadMore);
  }
  requestAnimationFrame(() => void clickLoadMore(loadMore));
}

function init() {
  applyCssRule([`.${C.Sidebar.container}`], $style.sidebarContainer);
  subscribe($$(document, C.Sidebar.container), onSidebarReady);
}

features.add(import.meta.url, init, 'Fully expands the contracts list in the sidebar.');

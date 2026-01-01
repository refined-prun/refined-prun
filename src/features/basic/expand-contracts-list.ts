import $style from './expand-contracts-list.module.css';

function init() {
  applyCssRule(
    [
      `.${C.MainState.sidebar}`,
      `.${C.Sidebar.container} > div:nth-child(4)`,
      `.${C.Sidebar.sectionContent} > div[style*="height"]`,
    ],
    $style.contractheight,
  );
}

features.add(import.meta.url, init, 'Adjust the height of the Pending Contracts scroll area.');

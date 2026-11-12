import $style from './reduce-padding.module.css';

function init() {
  applyCssRule(`.${C.ScrollView.view}`, $style.scrollmargin);
  applyCssRule(`.${C.MainState.sidebar}`, $style.sidebarwidth);
  applyCssRule(`.${C.Sidebar.container}`, $style.sidebarpadding);
}

features.add(import.meta.url, init, 'Reduce padding and margins in various UI components.');

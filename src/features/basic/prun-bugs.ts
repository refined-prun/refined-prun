import { applyClassCssRule, applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './prun-bugs.module.css';
import { getPrunCssStylesheets } from '@src/infrastructure/prun-ui/prun-css';

function removeMobileCssRules() {
  const styles = getPrunCssStylesheets();
  for (const style of styles) {
    const styleSheet = style.sheet!;
    const rules = styleSheet.cssRules;
    try {
      for (let j = rules.length - 1; j >= 0; j--) {
        const rule = rules[j];
        if (rule instanceof CSSMediaRule && rule.media.mediaText.includes('screen')) {
          styleSheet.deleteRule(j);
        }
      }
    } catch (e) {
      console.log(`Could not modify stylesheet: ${styleSheet.href}, Error: ${e}`);
    }
  }
}

function fixZOrder() {
  applyClassCssRule(
    [C.ComExOrdersPanel.filter, C.LocalMarket.filter, C.ContractsListTable.filter],
    classes.filter,
  );
  applyClassCssRule(C.ScrollView.track, classes.scrollTrack);
}

function init() {
  removeMobileCssRules();
  fixZOrder();

  // Prevents top-right user info from shrinking.
  applyCssRule(`.${C.Head.container} > div:nth-child(2)`, classes.userInfo);

  // Removes GridItemView background color.
  applyClassCssRule(C.GridItemView.container, classes.gridItem);

  // Adds text centering to GridItemView name.
  applyClassCssRule(C.GridItemView.name, classes.gridItemName);
}

features.add(import.meta.url, init, 'Fixes CSS bugs.');

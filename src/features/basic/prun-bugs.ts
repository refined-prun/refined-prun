import { getPrunCssStylesheets } from '@src/infrastructure/prun-ui/prun-css';
import {
  applyClassCssRule,
  applyCssRule,
  applyScopedClassCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';
import { changeInputValue } from '@src/util';
import classes from './prun-bugs.module.css';

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

function fixContractConditionEditor() {
  // Condition editor fails to save the condition unless the user interacts with the input.
  // Here we simulate this interaction.
  tiles.observe('CONTD', tile => {
    subscribe($$(tile.anchor, C.DraftConditionEditor.form), form => {
      subscribe($$(form, 'input'), input => {
        if (input.type !== 'text') {
          return;
        }
        const value = input.value;
        changeInputValue(input, '');
        changeInputValue(input, value);
      });
    });
  });
}

function init() {
  removeMobileCssRules();
  fixZOrder();
  fixContractConditionEditor();

  // Prevents top-right user info from shrinking.
  applyCssRule(`.${C.Head.container} > div:nth-child(2)`, classes.userInfo);

  // Removes GridItemView background color.
  applyClassCssRule(C.GridItemView.container, classes.gridItem);

  // Adds text centering to GridItemView name.
  applyClassCssRule(C.GridItemView.name, classes.gridItemName);

  // The overlay stops materials from being clickable
  applyScopedClassCssRule(['PROD', 'PRODQ'], C.OrderTile.overlay, classes.disablePointerEvents);

  // Prevent PROD buffer vertical scroll bar gutter from being always visible
  applyScopedClassCssRule(
    'PROD',
    C.SiteProductionLines.container,
    classes.containerScrollbarGutter,
  );
}

features.add(import.meta.url, init, 'Fixes PrUn bugs.');

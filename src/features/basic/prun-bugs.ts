import { getPrunCssStylesheets } from '@src/infrastructure/prun-ui/prun-css';
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
  applyCssRule(
    [
      `.${C.ComExOrdersPanel.filter}`,
      `.${C.LocalMarket.filter}`,
      `.${C.ContractsListTable.filter}`,
    ],
    classes.filter,
  );
  applyCssRule(`.${C.ScrollView.track}`, classes.scrollTrack);
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
  applyCssRule(`.${C.Head.container}`, classes.head);

  // Removes GridItemView background color.
  applyCssRule(`.${C.GridItemView.container}`, classes.gridItem);

  // Adds text centering to GridItemView name.
  applyCssRule(`.${C.GridItemView.name}`, classes.gridItemName);

  // The overlay stops materials from being clickable
  applyCssRule(['PROD', 'PRODQ'], `.${C.OrderTile.overlay}`, classes.disablePointerEvents);

  // Prevent PROD buffer vertical scroll bar gutter from being always visible
  applyCssRule('PROD', `.${C.SiteProductionLines.container}`, classes.containerScrollbarGutter);
}

features.add(import.meta.url, init, 'Fixes PrUn bugs.');

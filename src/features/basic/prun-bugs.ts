import { prunCssStylesheets } from '@src/infrastructure/prun-ui/prun-css';
import $style from './prun-bugs.module.css';

function removeMobileCssRules() {
  for (const style of prunCssStylesheets) {
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
    $style.filter,
  );
  applyCssRule(`.${C.ScrollView.track}`, $style.scrollTrack);
}

function init() {
  removeMobileCssRules();
  fixZOrder();

  // Prevents top-right user info from shrinking.
  applyCssRule(`.${C.Head.container}`, $style.head);

  // Item sub-labels are missing word-break.
  applyCssRule(`.${C.ColoredIcon.subLabel}`, $style.subLabel);

  // Removes GridItemView background color.
  applyCssRule(`.${C.GridItemView.container}`, $style.gridItem);

  // Adds text centering to GridItemView name.
  applyCssRule(`.${C.GridItemView.name}`, $style.gridItemName);

  // The overlay stops materials from being clickable.
  applyCssRule(['PROD', 'PRODQ'], `.${C.OrderTile.overlay}`, $style.disablePointerEvents);

  // Prevent PROD buffer vertical scroll bar gutter from being always visible.
  applyCssRule('PROD', `.${C.SiteProductionLines.container}`, $style.containerScrollbarGutter);

  // User search results box in GIFT is too big to fit in the tile.
  applyCssRule('GIFT', `.${C.UserSelector.suggestionsContainer}`, $style.giftSearchResults);

  // Fixes the dot / arrow in system info being left skewed
  applyCssRule(
    'SYSI',
    `.${C.EnvironmentTable.gridContainer} .${C.ColoredValue.positive}`,
    $style.centerText,
  );
  applyCssRule(
    'SYSI',
    `.${C.EnvironmentTable.gridContainer} .${C.ColoredValue.negative}`,
    $style.centerText,
  );

  // Fix the tooltip arrow position.
  applyCssRule('[data-tooltip-position="bottom"]', $style.tooltipBottom);
  applyCssRule('[data-tooltip-position="right"]', $style.tooltipRight);
}

features.add(import.meta.url, init, 'Fixes PrUn bugs.');

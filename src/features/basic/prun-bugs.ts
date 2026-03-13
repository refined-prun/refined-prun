import { prunCssStylesheets } from '@src/infrastructure/prun-ui/prun-css';
import $style from './prun-bugs.module.css';
import { clickElement } from '@src/util';

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

function disableInvalidPopidSliders(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    subscribe($$(row, 'rc-slider'), async slider => {
      const sliderMarks = Array.from((await $(slider, 'rc-slider-mark')).children);
      const sliderMaxMark = sliderMarks[sliderMarks.length - 1];
      const sliderMax = parseFloat(sliderMaxMark.textContent);
      const sliderValueMark = sliderMarks.findLast(x =>
        x.classList.contains('rc-slider-mark-text-active'),
      );
      if (!sliderValueMark) {
        return;
      }
      const sliderValue = parseFloat(sliderValueMark.textContent);
      const reserveCell = row.children[3];
      if (reserveCell == undefined) {
        return;
      }
      const reserveBar = await $(reserveCell, 'progress');
      if (reserveBar.value - sliderValue + sliderMax > reserveBar.max) {
        // If the slider is filled, disabling it could lock it in an invalid position.
        // So, we first minimize the slider value by clicking the min mark.
        clickElement(sliderMarks[0] as HTMLElement);
        slider.classList.add('rc-slider-disabled');
        slider.style.pointerEvents = 'none';
      }
    });
  });
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

function fixSliders() {
  applyCssRule('.rc-slider-dot', $style.rcSliderDotFixes);
  applyCssRule('.rc-slider-handle', $style.rcSliderHandleFixes);
  applyCssRule('.rc-slider-disabled .rc-slider-handle', $style.rcSliderHandleDisabledFixes);
  applyCssRule('.rc-slider-step', $style.rcSliderStepFixes);
  applyCssRule('.rc-slider-disabled  .rc-slider-step', $style.rcSliderStepDisabledFixes);
}

function init() {
  removeMobileCssRules();
  fixZOrder();
  fixSliders();

  // Prevents top-right user info from shrinking.
  applyCssRule(`.${C.Head.container}`, $style.head);

  // Item sub-labels are missing word-break.
  applyCssRule(`.${C.ColoredIcon.subLabel}`, $style.subLabel);

  // Removes GridItemView background color.
  applyCssRule(`.${C.GridItemView.container}`, $style.gridItem);
  // Prevent layout shifts when items become selected by making the border consistent width.
  applyCssRule(`.${C.GridItemView.selected}`, $style.gridItemSelected);

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

  tiles.observe('POPID', disableInvalidPopidSliders);
}

features.add(import.meta.url, init, 'Fixes PrUn bugs.');

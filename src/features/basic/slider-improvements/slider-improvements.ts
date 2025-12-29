import $style from './slider-improvements.module.css';
import SliderButton from '@src/features/basic/slider-improvements/SliderButton.vue';
import { clickElement } from '@src/util';

function onTileReady(tile: PrunTile) {
  sliderMinMaxButtons(tile);
  sliderTableBulkMinMax(tile);
}

function sliderTableBulkMinMax(tile: PrunTile) {
  subscribe($$(tile.anchor, 'table'), table => {
    const headerRow = _$(table, 'thead')?.firstElementChild;
    if (!headerRow) return;
    const sliders = _$$(table, 'rc-slider');
    if (sliders.length > 0) {
      const sliderColumns = new Map<number, HTMLElement[]>();
      sliders.forEach(slider => {
        const cell = slider.closest('td');
        const columnIndex = Array.prototype.slice.call(cell?.parentElement?.children).indexOf(cell);
        const column = sliderColumns.get(columnIndex);
        if (!column) {
          sliderColumns.set(columnIndex, [slider]);
        } else {
          column.push(slider);
        }
      });
      for (const [columnIndex, sliders] of sliderColumns.entries()) {
        const header = headerRow.children[columnIndex];
        const minSliderColumn = () => {
          sliders.forEach(slider => {
            const markContainer = _$(slider, 'rc-slider-mark');
            if (markContainer && !slider.classList.contains('rc-slider-disabled')) {
              clickElement(markContainer.firstElementChild as HTMLElement);
            }
          });
        };
        const maxSliderColumn = () => {
          sliders.forEach(slider => {
            const markContainer = _$(slider, 'rc-slider-mark');
            if (markContainer && !slider.classList.contains('rc-slider-disabled')) {
              clickElement(markContainer.lastElementChild as HTMLElement);
            }
          });
        };
        const disabled = sliders.every(slider => slider.classList.contains('rc-slider-disabled'));
        header.classList.add($style.sliderColumnHeader);
        createFragmentApp(
          SliderButton,
          reactive({
            onClick: minSliderColumn,
            label: '<',
            disabled,
          }),
        ).prependTo(header);
        createFragmentApp(
          SliderButton,
          reactive({
            onClick: maxSliderColumn,
            label: '>',
            disabled,
          }),
        ).appendTo(header);
      }
    }
  });
}

function sliderMinMaxButtons(tile: PrunTile) {
  subscribe($$(tile.anchor, 'rc-slider'), slider => {
    slider.parentElement?.classList.add($style.sliderView);
    const disabled = slider.classList.contains('rc-slider-disabled');
    const markContainer = _$(slider, 'rc-slider-mark');
    const minSlider = () => clickElement(markContainer?.firstElementChild as HTMLElement);
    const maxSlider = () => clickElement(markContainer?.lastElementChild as HTMLElement);
    createFragmentApp(
      SliderButton,
      reactive({
        onClick: minSlider,
        label: '<',
        disabled,
      }),
    ).before(slider);
    createFragmentApp(
      SliderButton,
      reactive({
        onClick: maxSlider,
        label: '>',
        disabled,
      }),
    ).after(slider);
  });
}

// ONLY FOR POPID(?)
function disableInvalidSliders(tile: PrunTile) {
  subscribe($$(tile.anchor, 'table'), table => {
    subscribe($$(table, 'rc-slider'), slider => {
      const sliderMaxMark = _$(slider, 'rc-slider-mark')?.lastElementChild;
      if (!sliderMaxMark) return;
      const sliderMax = parseFloat(sliderMaxMark.textContent);
      const sliderValueMark = _$$(slider, 'rc-slider-mark-text-active').findLast(() => true); // the last active mark-text will be either the min/max or the current value
      if (!sliderValueMark) return;
      const sliderValue = parseFloat(sliderValueMark.textContent);
      const row = slider.closest('tr');
      const reserveCell = row?.children.item(3);
      if (!reserveCell) return;
      const reserveBar = _$(reserveCell, 'progress');
      if (reserveBar && reserveBar.value - sliderValue + sliderMax > reserveBar?.max) {
        slider.classList.add('rc-slider-disabled');
        slider.style.pointerEvents = 'none';
      }
    });
  });
}

function fixSliderCss() {
  applyCssRule(['.rc-slider-dot'], $style.rcSliderDotFixes);
  applyCssRule(['.rc-slider-handle'], $style.rcSliderHandleFixes);
  applyCssRule(['.rc-slider-disabled .rc-slider-handle'], $style.rcSliderHandleDisabledFixes);
  applyCssRule(['.rc-slider-step'], $style.rcSliderStepFixes);
  applyCssRule(['.rc-slider-disabled  .rc-slider-step'], $style.rcSliderStepDisabledFixes);
}

function init() {
  fixSliderCss();
  tiles.observeAll(onTileReady);
  tiles.observe('POPID', disableInvalidSliders);
}

features.add(import.meta.url, init, 'Various improvements to sliders');

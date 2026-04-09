import StackedProgressBar from '@src/components/StackedProgressBar.vue';
import { refAttributeValue } from '@src/utils/reactive-dom';
import $style from './readable-reserve-bars.module.css';

function replacePOPIDReserves(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), async row => {
    const sliderHandle = await $(row, 'rc-slider-handle');
    const sliderHandleClasses = refAttributeValue(sliderHandle, 'class');
    const sliderValueText = refAttributeValue(sliderHandle, 'aria-valuenow');
    // SliderValue should only be updated when the slider is released (or no value has been set).
    // Otherwise, we lose track of the stock already contributed.
    const sliderValue = computed<number>(oldValue => {
      if (
        sliderHandleClasses.value?.includes('rc-slider-handle-dragging') &&
        oldValue != undefined
      ) {
        return oldValue;
      }
      return Number(sliderValueText.value);
    });
    const reserveCell = row.children[3];
    if (reserveCell === undefined) {
      return;
    }
    const reserveBar = await $(reserveCell, 'progress');
    reserveBar.hidden = true;
    const barValueText = refAttributeValue(reserveBar, 'value');
    const barValue = computed(() => Number(barValueText.value));
    const barMaxText = refAttributeValue(reserveBar, 'max');
    const barMax = computed(() => Number(barMaxText.value));
    const reserveValue = computed(() => barValue.value - sliderValue.value);
    createFragmentApp(
      StackedProgressBar,
      reactive({
        max: barMax,
        sections: [
          {
            value: reserveValue,
            class: $style.reserveSection,
          },
          {
            value: sliderValue,
            class: $style.contributionSection,
          },
        ],
      }),
    ).after(reserveBar);
  });
}

function init() {
  tiles.observe(['POPID'], replacePOPIDReserves);
}

features.add(
  import.meta.url,
  init,
  'POPID: Sections the reserve bar to make the change more visible.',
);

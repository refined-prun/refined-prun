import StackedProgressBar from '@src/components/StackedProgressBar.vue';
import { refAttributeValue } from '@src/utils/reactive-dom';
import $style from './visible-popid-contributions.module.css';

function replacePopidReserveBars(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), async reserveRow => {
    const contributionSliderHandle = await $(reserveRow, 'rc-slider-handle');
    const contributionSliderClasses = refAttributeValue(contributionSliderHandle, 'class');
    const contributionSliderValueText = refAttributeValue(
      contributionSliderHandle,
      'aria-valuenow',
    );
    // Contribution value should only be updated when the slider is released
    // or when no previous value has been set. Otherwise, we lose track of
    // the stock already contributed.
    const contributionValue = computed<number>(previousContributionValue => {
      if (
        contributionSliderClasses.value?.includes('rc-slider-handle-dragging') &&
        previousContributionValue !== undefined
      ) {
        return previousContributionValue;
      }
      return Number(contributionSliderValueText.value);
    });
    const reserveCell = reserveRow.children[3];
    if (reserveCell === undefined) {
      return;
    }
    const reserveProgressBar = await $(reserveCell, 'progress');
    reserveProgressBar.hidden = true;
    const totalReserveValueText = refAttributeValue(reserveProgressBar, 'value');
    const totalReserveValue = computed(() => Number(totalReserveValueText.value));
    const reserveMaxValueText = refAttributeValue(reserveProgressBar, 'max');
    const reserveMaxValue = computed(() => Number(reserveMaxValueText.value));
    const currentReserveValue = computed(() => totalReserveValue.value - contributionValue.value);
    createFragmentApp(
      StackedProgressBar,
      reactive({
        max: reserveMaxValue,
        sections: [
          {
            value: currentReserveValue,
            class: $style.reserveSection,
          },
          {
            value: contributionValue,
            class: $style.contributionSection,
          },
        ],
      }),
    ).after(reserveProgressBar);
    const nextConsumptionCell = reserveRow.children[2];
    if (nextConsumptionCell === undefined) {
      return;
    }
    const nextConsumptionProgressBar = await $(nextConsumptionCell, 'progress');
    nextConsumptionProgressBar.hidden = true;
    const nextConsumptionMaxValueText = refAttributeValue(nextConsumptionProgressBar, 'max');
    const nextConsumptionMaxValue = computed(() => Number(nextConsumptionMaxValueText.value));
    // The "next consumption" bar is not a real storage.
    // The actual value is best calculated from the real reserve value.
    const nextConsumptionReserveValue = computed(() =>
      Math.min(currentReserveValue.value, nextConsumptionMaxValue.value),
    );
    const nextConsumptionContributionValue = computed(() =>
      Math.min(
        contributionValue.value,
        nextConsumptionMaxValue.value - nextConsumptionReserveValue.value,
      ),
    );
    createFragmentApp(
      StackedProgressBar,
      reactive({
        max: nextConsumptionMaxValue,
        sections: [
          {
            value: nextConsumptionReserveValue,
            class: $style.reserveSection,
          },
          {
            value: nextConsumptionContributionValue,
            class: $style.contributionSection,
          },
        ],
      }),
    ).after(nextConsumptionProgressBar);
  });
}

function init() {
  tiles.observe(['POPID'], replacePopidReserveBars);
}

features.add(
  import.meta.url,
  init,
  'POPID: Sections the reserve bar to make the change more visible.',
);

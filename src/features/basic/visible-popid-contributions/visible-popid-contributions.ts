import StackedProgressBar from '@src/components/StackedProgressBar.vue';
import { refAttributeValue } from '@src/utils/reactive-dom';
import $style from './visible-popid-contributions.module.css';
import { clamp } from '@src/utils/clamp';
import { createFragmentApp } from '@src/utils/vue-fragment-app';

function visualizeCOGCReserves(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), async reserveRow => {
    const { contributionValue, reserveValue } = await extractValuesFromReserveRow(reserveRow, 1, 2);
    const reserveCell = reserveRow.children[2];
    const reserveProgressBar = await $(reserveCell, 'progress');
    await visualizeContributions(reserveProgressBar, contributionValue, reserveValue);
  });
}

function visualizeHQReserves(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), async reserveRow => {
    const { contributionValue, reserveValue } = await extractValuesFromReserveRow(reserveRow, 1, 2);
    const reserveCell = reserveRow.children[2];
    const reserveProgressBar = await $(reserveCell, 'progress');
    await visualizeContributions(reserveProgressBar, contributionValue, reserveValue);
  });
}

function visualizeSHYPReserves(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), async reserveRow => {
    const { contributionValue, reserveValue } = await extractValuesFromReserveRow(reserveRow, 1, 2);
    const reserveCell = reserveRow.children[2];
    const reserveProgressBar = await $(reserveCell, 'progress');
    await visualizeContributions(reserveProgressBar, contributionValue, reserveValue);
  });
}

function visualizePOPIDReserves(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Population.container), async populationContainer => {
    const upkeepTable = populationContainer.children[7]?.firstElementChild;
    if (upkeepTable != undefined) {
      subscribe($$(upkeepTable, 'tr'), async reserveRow => {
        const { contributionValue, reserveValue } = await extractValuesFromReserveRow(
          reserveRow,
          1,
          3,
        );
        const reserveCell = reserveRow.children[3];
        const reserveProgressBar = await $(reserveCell, 'progress');
        await visualizeContributions(reserveProgressBar, contributionValue, reserveValue);
        const nextConsumptionCell = reserveRow.children[2];
        const nextConsumptionProgressBar = await $(nextConsumptionCell, 'progress');
        await visualizeContributions(nextConsumptionProgressBar, contributionValue, reserveValue);
      });
    }
    const upgradeTable = populationContainer.children[9]?.firstElementChild;
    if (upgradeTable != undefined) {
      subscribe($$(upgradeTable, 'tr'), async reserveRow => {
        const { contributionValue, reserveValue } = await extractValuesFromReserveRow(
          reserveRow,
          1,
          2,
        );
        const reserveCell = reserveRow.children[2];
        const reserveProgressBar = await $(reserveCell, 'progress');
        await visualizeContributions(reserveProgressBar, contributionValue, reserveValue);
      });
    }
  });
}

async function extractValuesFromReserveRow(
  reserveRow: HTMLTableRowElement,
  contributionIndex: number,
  reserveIndex: number,
): Promise<{
  contributionValue: globalThis.Ref<number>;
  reserveValue: globalThis.Ref<number>;
}> {
  const contributionCell = reserveRow.children[contributionIndex];
  const contributionSliderHandle = await $(contributionCell, 'rc-slider-handle');
  const contributionSliderHandleClasses = refAttributeValue(contributionSliderHandle, 'class');
  const contributionValueText = refAttributeValue(contributionSliderHandle, 'aria-valuenow');
  // Contribution value should only be updated when the slider is released
  // or when no previous value has been set. Otherwise, we lose track of
  // the stock already contributed.
  const contributionValue = computed<number>(previousContributionValue => {
    if (
      contributionSliderHandleClasses.value?.includes('rc-slider-handle-dragging') &&
      previousContributionValue !== undefined
    ) {
      return previousContributionValue;
    }
    return Number(contributionValueText.value);
  });
  const reserveCell = reserveRow.children[reserveIndex];
  const reserveProgressBar = await $(reserveCell, 'progress');
  const totalReserveValueText = refAttributeValue(reserveProgressBar, 'value');
  const totalReserveValue = computed(() => Number(totalReserveValueText.value));
  const realReserveValue = computed(() => totalReserveValue.value - contributionValue.value);
  return { contributionValue, reserveValue: realReserveValue };
}

async function visualizeContributions(
  progressBar: HTMLProgressElement,
  contributionValue: globalThis.Ref<number>,
  reserveValue: globalThis.Ref<number>,
) {
  const progressBarMaxText = refAttributeValue(progressBar, 'max');
  const progressBarMax = computed(() => {
    return Number(progressBarMaxText.value);
  });
  const clampedReserveValue = computed(() => clamp(reserveValue.value, 0, progressBarMax.value));
  const clampedContributionValue = computed(() =>
    clamp(
      contributionValue.value,
      0 - clampedReserveValue.value,
      progressBarMax.value - clampedReserveValue.value,
    ),
  );
  const contributionStyle = computed(() =>
    clampedContributionValue.value >= 0
      ? $style.contributionSection
      : $style.negativeContributionSection,
  );
  const adjReserveValue = computed(() =>
    clampedContributionValue.value >= 0
      ? clampedReserveValue.value
      : clampedReserveValue.value + clampedContributionValue.value,
  );
  const adjContributionValue = computed(() => Math.abs(clampedContributionValue.value));
  progressBar.hidden = true;
  createFragmentApp(
    StackedProgressBar,
    reactive({
      max: progressBarMax,
      sections: [
        {
          value: adjReserveValue,
          class: $style.reserveSection,
        },
        {
          value: adjContributionValue,
          class: contributionStyle,
        },
      ],
    }),
  ).after(progressBar);
}

function init() {
  tiles.observe(['POPID'], visualizePOPIDReserves);
  tiles.observe(['COGCU'], visualizeCOGCReserves);
  tiles.observe(['SHYP'], visualizeSHYPReserves);
  tiles.observe(['HQ'], visualizeHQReserves);
}

features.add(
  import.meta.url,
  init,
  'POPID: Sections the reserve bar to make the change more visible.',
);

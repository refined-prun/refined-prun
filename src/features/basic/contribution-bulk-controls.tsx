import { clickElement } from '@src/util';
import { refAnimationFrame } from '@src/utils/reactive-dom';
import PrunButton from '@src/components/PrunButton.vue';
import { ElementTag } from '@src/infrastructure/prun-ui/tagger';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Contribution.contribute), contribute => {
    const table = contribute.previousElementSibling;
    if (!table) {
      return;
    }
    const sliders = _$$(table, 'rc-slider');
    if (sliders.length === 0) {
      return;
    }
    const maxSliders = async () => {
      for (const slider of sliders) {
        if (slider.classList.contains('rc-slider-disabled')) {
          continue;
        }
        if (tile.command === 'POPID' && !(await canMaximizePopidSlider(slider))) {
          continue;
        }
        const mark = await $(slider, 'rc-slider-mark');
        await clickElement(mark.lastElementChild as HTMLElement);
      }
    };
    const minSliders = async () => {
      for (const slider of sliders) {
        if (slider.classList.contains('rc-slider-disabled')) {
          continue;
        }
        const mark = await $(slider, 'rc-slider-mark');
        await clickElement(mark.firstElementChild as HTMLElement);
      }
    };
    const allSliders = table.getElementsByClassName('rc-slider');
    const disabledSliders = table.getElementsByClassName('rc-slider-disabled');
    const disabled = refAnimationFrame(
      table,
      () => allSliders.length > 0 && allSliders.length === disabledSliders.length,
    );
    createFragmentApp(() => (
      <PrunButton primary disabled={disabled.value} onClick={maxSliders}>
        ALL
      </PrunButton>
    )).prependTo(contribute);
    createFragmentApp(() => (
      <PrunButton primary disabled={disabled.value} onClick={minSliders}>
        NONE
      </PrunButton>
    )).prependTo(contribute);
  });
}

async function canMaximizePopidSlider(slider: Element) {
  const row = slider.closest('tr');
  if (!row) {
    return false;
  }
  const sliderMarkContainer = await $(slider, 'rc-slider-mark');
  const sliderMarks = Array.from(sliderMarkContainer.children);
  const sliderMaxMark = sliderMarks[sliderMarks.length - 1];
  const sliderValueMark = sliderMarks.findLast(x =>
    x.classList.contains('rc-slider-mark-text-active'),
  );
  if (sliderMarks.length === 0 || !sliderValueMark) {
    return false;
  }
  const sliderMax = parseFloat(sliderMaxMark.textContent);
  const sliderValue = parseFloat(sliderValueMark.textContent);
  const reserveCell = await $(row, ElementTag.POPID_RESERVE_CELL);
  const reserveBar = await $(reserveCell, 'progress');
  return reserveBar.value - sliderValue + sliderMax <= reserveBar.max;
}

function init() {
  tiles.observe(['COGCU', 'POPID'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds bulk controls (NONE, ALL) to contribution menus in CoGC and population upkeep tiles.',
);

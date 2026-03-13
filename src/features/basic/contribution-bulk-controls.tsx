import { clickElement } from '@src/util';
import { refAnimationFrame } from '@src/utils/reactive-dom';
import PrunButton from '@src/components/PrunButton.vue';

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

function init() {
  tiles.observe(['COGCU', 'POPID'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds bulk controls (NONE, ALL) to contribution menus in CoGC and population upkeep tiles.',
);

import { clickElement } from '@src/util';
import PrunButton from '@src/components/PrunButton.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'table'), table => {
    const sliders = _$$(table, 'rc-slider');
    const contributeContainer = table.nextSibling as HTMLDivElement | null;
    if (sliders.length === 0 || !contributeContainer) {
      return;
    }
    const maxSliders = () => {
      for (const slider of sliders) {
        if (slider.classList.contains('rc-slider-disabled')) {
          continue;
        }
        $(slider, 'rc-slider-mark').then(x => clickElement(x.lastElementChild as HTMLElement));
      }
    };
    const minSliders = () => {
      for (const slider of sliders) {
        if (slider.classList.contains('rc-slider-disabled')) {
          continue;
        }
        $(slider, 'rc-slider-mark').then(x => clickElement(x.firstElementChild as HTMLElement));
      }
    };
    const disabled = sliders.every(x => x.classList.contains('rc-slider-disabled'));
    createFragmentApp(() => (
      <PrunButton primary disabled={disabled} onClick={maxSliders}>
        ALL
      </PrunButton>
    )).prependTo(contributeContainer);
    createFragmentApp(() => (
      <PrunButton primary disabled={disabled} onClick={minSliders}>
        NONE
      </PrunButton>
    )).prependTo(contributeContainer);
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

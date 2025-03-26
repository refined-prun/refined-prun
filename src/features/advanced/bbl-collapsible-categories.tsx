import css from '@src/utils/css-utils.module.css';
import $style from './bbl-collapsible-categories.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.SectionList.container), container => {
    for (const divider of _$$(container, C.SectionList.divider)) {
      // Hide Infrastructure (which is the first category) by default
      const enabled = ref(container.firstChild !== divider);
      divider.addEventListener('click', () => (enabled.value = !enabled.value));
      const indicatorClass = computed(() => ({
        [C.RadioItem.indicator]: true,
        [C.RadioItem.active]: enabled.value,
        [C.effects.shadowPrimary]: enabled.value,
      }));
      createFragmentApp(() => <div class={indicatorClass.value} />).before(divider.firstChild!);
    }
  });
}

function init() {
  applyCssRule(
    'BBL',
    `.${C.SectionList.divider}:not(:has(.${C.RadioItem.active})) + div`,
    css.hidden,
  );
  applyCssRule('BBL', `.${C.SectionList.divider}`, $style.divider);
  tiles.observe('BBL', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'BBL: Makes categories collapsible and collapses the "Infrastructure" category by default.',
);

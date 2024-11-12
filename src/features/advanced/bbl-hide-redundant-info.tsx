import css from '@src/utils/css-utils.module.css';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { isRepairableBuilding } from '@src/core/buildings';

function onTileReady(tile: PrunTile) {
  const siteId = tile.parameter;
  const site = computed(() => sitesStore.getById(siteId));
  subscribe($$(tile.anchor, C.SectionList.section), section => {
    const id = refPrunId(section);
    const building = computed(() => site.value?.platforms.find(p => p.id == id.value));
    watchEffectWhileNodeAlive(section, () => {
      if (!building.value) {
        return;
      }

      setAttribute(section, 'data-rp-established', building.value.lastRepair === null);
      setAttribute(section, 'data-rp-repaired', building.value.lastRepair !== null);
      setAttribute(section, 'data-rp-infrastructure', !isRepairableBuilding(building.value));
    });
  });
}

function setAttribute(element: HTMLElement, attribute: string, value: boolean) {
  if (value) {
    element.setAttribute(attribute, '');
  } else {
    element.removeAttribute(attribute);
  }
}

function init() {
  // Hide 'Last repair'
  applyScopedCssRule(
    'BBL',
    `.${C.SectionList.section}[data-rp-established] .${C.SectionList.table} tr:nth-child(2)`,
    css.hidden,
  );
  // Hide 'Established'
  applyScopedCssRule(
    'BBL',
    `.${C.SectionList.section}[data-rp-repaired] .${C.SectionList.table} tr:nth-child(1)`,
    css.hidden,
  );
  // Hide 'Repair costs'
  applyScopedCssRule(
    'BBL',
    `.${C.SectionList.section}[data-rp-infrastructure] .${C.SectionList.table} tr:nth-child(3)`,
    css.hidden,
  );
  // Hide 'Book value'
  applyScopedCssRule(
    'BBL',
    `.${C.SectionList.section} .${C.SectionList.table} tr:nth-child(5)`,
    css.hidden,
  );
  tiles.observe('BBL', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'BBL: Hides "Last repair", "Established", and "Repair costs" rows if they are empty' +
    ' or irrelevant to repairs. Also hides the "Book value" row.',
);

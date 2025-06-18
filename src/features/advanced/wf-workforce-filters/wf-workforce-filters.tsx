import css from '@src/utils/css-utils.module.css';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import WorkforceFilterBar from '@src/features/advanced/wf-workforce-filters/WorkforceFilterBar.vue';
import { computedTileState } from '@src/store/user-data-tiles';
import { getTileState } from '@src/features/advanced/wf-workforce-filters/tile-state';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

const workforceTypes = ['PIONEER', 'SETTLER', 'TECHNICIAN', 'ENGINEER', 'SCIENTIST'];

function onTileReady(tile: PrunTile) {
  const workforces = computed(() => workforcesStore.getById(tile.parameter));
  const filters = computedTileState(getTileState(tile), 'hideWorkforce', []);
  const visibleMaterials = computed(() => {
    if (!workforces.value) {
      return undefined;
    }

    const materials = new Set<string>();
    for (const wf of workforces.value.workforces) {
      const filter = filters.value.find(x => x.workforce === wf.level);
      if (filter && !filter.value) {
        continue;
      }
      for (const need of wf.needs) {
        materials.add(need.material.ticker);
      }
    }

    return [...materials];
  });

  subscribe($$(tile.anchor, C.Workforces.table), async table => {
    createFragmentApp(WorkforceFilterBar, reactive({ filters })).before(table);

    watchEffectWhileNodeAlive(table, () => {
      if (!workforces.value) {
        return;
      }

      if (filters.value.length === 0) {
        filters.value = workforceTypes.map(x => ({
          workforce: x,
          value: (workforces.value?.workforces.find(y => y.level === x)?.capacity ?? 0) > 0,
        }));
        if (filters.value.every(x => !x.value)) {
          for (const filter of filters.value) {
            filter.value = true;
          }
        }
      }

      const rows = _$$(table, 'tr');
      for (const row of rows) {
        const isHeader = _$(row, 'th') !== undefined;
        // The first row has a <th> with colspan=2 that messes up the element index.
        const startingColumn = isHeader ? 5 : 6;
        for (let i = 0; i < workforceTypes.length; i++) {
          const workforceType = workforceTypes[i];
          const column = row.children[startingColumn + i];
          const isVisible = filters.value.find(x => x.workforce === workforceType)?.value ?? true;
          column.classList.toggle(css.hidden, !isVisible);
        }

        const materialLabel = _$(row, C.ColoredIcon.label);
        if (materialLabel) {
          const isHidden = !(visibleMaterials.value?.includes(materialLabel.textContent!) ?? true);
          row.classList.toggle(css.hidden, isHidden);
        }
      }
    });
  });
}

function init() {
  tiles.observe('WF', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'WF: Adds filters to hide zero workforce types and consumables.',
);

import css from '@src/utils/css-utils.module.css';
import $style from './hide-unused-workforce.module.css';
import SelectButton from './hide-system-chat-messages/SelectButton.vue';

const wfTypes = ['Pioneers', 'Settlers', 'Technicians', 'Engineers', 'Scientists'];

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Workforces.table), async table => {
    const toggleWorkforces = document.createElement('div');
    toggleWorkforces.classList.add($style.radioItemDiv);
    toggleWorkforces.textContent = 'Show: ';
    table.parentElement?.prepend(toggleWorkforces);

    const materialBody = table.children[2];
    const materialRows = _$$(materialBody, 'tr');
    const headerBody = await $(table, C.Workforces.stats);
    const wfRequiredValues = _$$(headerBody, C.Workforces.requiredValue);
    const wfConsumables: HTMLElement[][] = Array.from({ length: wfTypes.length }, () => []);
    const wfShown = Array.from({ length: wfTypes.length }, () => ref(false));
    for (let i = 0; i < wfTypes.length; i++) {
      for (let j = 0; j < materialRows.length; j++) {
        // Column index 6 is the first workforce type column, followed by subsequent types.
        if (materialRows[j].children[6 + i].children.length !== 0) {
          wfConsumables[i].push(materialRows[j]);
        }
      }
      wfShown[i].value = wfRequiredValues[i].textContent !== '0';
    }

    const allRows = _$$(table, 'tr');

    function setRowColumnsStyle() {
      for (const row of materialRows) {
        row.classList.add(css.hidden);
      }
      for (let j = 0; j < wfTypes.length; j++) {
        if (wfShown[j].value) {
          for (const workforceElement of wfConsumables[j]) {
            workforceElement.classList.remove(css.hidden);
          }
        }
        for (const row of allRows) {
          // Calculate the column index from the end of the array.
          // The first row has a <th> with colspan=2 that messes it up otherwise.
          const columnIndex = row.children.length - (wfTypes.length - j);
          row.children[columnIndex].classList.toggle(css.hidden, !wfShown[j].value);
        }
      }
    }
    setRowColumnsStyle();

    for (let i = 0; i < wfTypes.length; i++) {
      createFragmentApp(() => (
        <SelectButton
          label={`${wfTypes[i]}`}
          selected={wfShown[i].value}
          set={(value: boolean) => {
            wfShown[i].value = value;
            setRowColumnsStyle();
          }}
        />
      )).appendTo(toggleWorkforces);
    }
  });
}

function init() {
  tiles.observe('WF', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'WF: Adds buttons to hide unused workforce types and consumables.',
);

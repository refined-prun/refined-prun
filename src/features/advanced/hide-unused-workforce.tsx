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
    const wfConsumables: HTMLElement[][] = [[], [], [], [], []];
    const headerBody = await $(table, C.Workforces.stats);
    const wfRequiredValues = _$$(headerBody, C.Workforces.requiredValue);
    const wfShown = [ref(false), ref(false), ref(false), ref(false), ref(false)];
    for (let i = 0; i < wfTypes.length; i++) {
      for (let j = 0; j < materialRows.length; j++) {
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
          row.children[row.children.length - Math.abs(wfTypes.length - 1 - j) - 1].classList.toggle(
            css.hidden,
            !wfShown[wfShown.length - Math.abs(wfTypes.length - 1 - j) - 1].value,
          );
        }
      }
    }

    for (let i = 0; i <= 4; i++) {
      if (wfShown[i].value) {
        setRowColumnsStyle();
      }

      createFragmentApp(() => (
        <>
          <SelectButton
            label={`${wfTypes[i]}`}
            selected={wfShown[i].value}
            set={(value: boolean) => {
              wfShown[i].value = value;
              setRowColumnsStyle();
            }}></SelectButton>
        </>
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

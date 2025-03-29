import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import $style from './cx-search-bar.module.css';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import css from '@src/utils/css-utils.module.css';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import TextInput from '@src/components/forms/TextInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import fa from '@src/utils/font-awesome.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ComExPanel.input), comExPanel => {
    const actionBar = _$(comExPanel, C.ActionBar.container)!;

    const searchText = ref('');

    const select = _$(comExPanel, 'select')!;
    const selectValue = ref('');
    select.addEventListener('change', () => {
      selectValue.value = select.value;
    });

    type TickerToElement = Map<string, HTMLElement>;
    const optionElements: TickerToElement = new Map();
    const rowElements: TickerToElement = new Map();

    if (optionElements.size === 0) {
      const options = _$$(comExPanel, 'option')!;
      for (const option of options) {
        optionElements.set(option.getAttribute('value')!, option);
      }
    }

    function loadRowElements() {
      const currentTBody = _$(comExPanel, 'tbody');
      if (!currentTBody) {
        return;
      }
      const rows = _$$(currentTBody, 'tr');
      for (const row of rows) {
        const labelText = _$(row, C.ColoredIcon.label)!.innerText;
        rowElements.set(labelText, row);
      }
      triggerRef(searchText);
    }

    // If CX loads a category it's already seen, it loads the data from memory and only tr's will be changed.
    const selectValueWatch = watch(selectValue, () => {
      loadRowElements();
    });
    onNodeDisconnected(comExPanel, selectValueWatch);

    // If CX loads a category it hasn't fetched from the server yet, a new tbody will be generated.
    subscribe($$(comExPanel, 'tbody'), () => {
      loadRowElements();
    });

    const resetMatches = (value: HTMLElement) => {
      if (value.isConnected) {
        value.classList.toggle(css.hidden, searchText.value.length !== 0);
      }
    };

    // Main search loop.
    watchEffectWhileNodeAlive(comExPanel, () => {
      const searchTerm = searchText.value.toUpperCase();

      if (rowElements.size === 0) {
        loadRowElements();
        return;
      }

      optionElements.forEach(resetMatches);
      rowElements.forEach(resetMatches);

      if (searchTerm.length > 0) {
        for (const material of materialsStore.all.value!) {
          if (
            material.ticker.includes(searchTerm) ||
            getMaterialName(material)?.toUpperCase().includes(searchTerm)
          ) {
            const optionElement = optionElements.get(material.category);
            if (optionElement) {
              optionElement.classList.remove(css.hidden);
            }
            const rowElement = rowElements.get(material.ticker);
            if (rowElement && rowElement.isConnected) {
              rowElement.classList.remove(css.hidden);
            }
          }
        }
      }
    });

    createFragmentApp(() => (
      <div class={[C.ActionBar.element, $style.textInputElement]}>
        Search:
        <TextInput v-model={searchText.value} />
        <div onClick={() => (searchText.value = '')}>
          <PrunButton class={$style.button} dark>
            <div class={fa.solid}>{'\uf00d'} </div>
          </PrunButton>
        </div>
      </div>
    )).before(actionBar.children[0]);
  });
}

function init() {
  applyCssRule('CX', `.${C.BrokerList.table}`, $style.table);
  tiles.observe('CX', onTileReady);
}

features.add(import.meta.url, init, 'CX: Adds a search bar to highlight materials and categories.');

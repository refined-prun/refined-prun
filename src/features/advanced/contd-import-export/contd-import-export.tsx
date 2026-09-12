import { keepLast } from '@src/utils/keep-last';
import { tileKey } from '@src/hooks/use-tile';
import PasteImport from './PasteImport.vue';
import { trackDragSource } from './drag';
import $style from './contd-import-export.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.TemplateSelection.container), container => {
    const exportTarget = document.createElement('div');
    container.appendChild(exportTarget);
    keepLast(container, () => container, exportTarget);
    createFragmentApp(PasteImport, { exportTarget }).provide(tileKey, tile).before(container);
  });
}

function init() {
  trackDragSource();
  applyCssRule('CONTD', `.${C.TemplateSelection.container}`, $style.compactContainer);
  applyCssRule(
    'CONTD',
    `.${$style.exportRow} .${C.FormComponent.input}`,
    $style.exportInputRowRule,
  );
  tiles.observe('CONTD', onTileReady);
}

features.add(import.meta.url, init, 'CONTD: Adds importing and exporting of contract templates.');

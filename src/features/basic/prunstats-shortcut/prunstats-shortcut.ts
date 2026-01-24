import CoPrunstatsShortcut from '@src/features/basic/prunstats-shortcut/CoPrunstatsShortcut.vue';
import UsrPrunstatsShortcut from '@src/features/basic/prunstats-shortcut/UsrPrunstatsShortcut.vue';

function onCoReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.FormComponent.containerPassive), row => {
    const staticInput = _$(row, C.StaticInput.static);
    const value = staticInput?.textContent.trim();
    // 'Managing Director' field is the eighth child (as of 12/28/2025)
    const is8thChild = row.parentElement?.children[7] === row;
    if (is8thChild && value) {
      createFragmentApp(
        CoPrunstatsShortcut,
        reactive({
          username: value,
        }),
      ).appendTo(staticInput!);
    }
  });
}

function onUsrReady(tile: PrunTile) {
  const username = tile.parameter?.trim();
  if (username) {
    subscribe($$(tile.frame, C.ContextControls.container), contextControls => {
      createFragmentApp(
        UsrPrunstatsShortcut,
        reactive({
          username,
        }),
      ).appendTo(contextControls);
    });
  }
}

function init() {
  tiles.observe(['CO'], onCoReady);
  tiles.observe(['USR'], onUsrReady);
}

features.add(
  import.meta.url,
  init,
  'CO, USR: Adds shortcuts to useful PMMG-Product (XIT PRUNSTAT) graphs',
);

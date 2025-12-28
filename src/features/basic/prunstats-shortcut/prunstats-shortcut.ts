import { usersStore } from '@src/infrastructure/prun-api/data/users.ts';
import CoPrunstatsShortcut from '@src/features/basic/prunstats-shortcut/CoPrunstatsShortcut.vue';

function onCoReady(tile: PrunTile) {
  const coArg = tile.parameter?.toLowerCase();
  if (!coArg) {
    return;
  }
  subscribe($$(tile.anchor, C.FormComponent.containerPassive), row => {
    const staticInput = _$(row, C.StaticInput.static);
    const value = staticInput?.textContent.trim();
    const user = usersStore.getByUsername(value);
    // User exists and is the correct user for tile command
    console.log(value, coArg, user);
    if (
      user &&
      (user.company.code.toLowerCase() == coArg || user.company.id.toLowerCase() == coArg)
    ) {
      createFragmentApp(
        CoPrunstatsShortcut,
        reactive({
          username: user.username,
        }),
      ).appendTo(staticInput!);
    }
  });
}

function init() {
  tiles.observe(['CO'], onCoReady);
  tiles.observe(['USR'], () => {});
}

features.add(
  import.meta.url,
  init,
  'CO, USR: Adds shortcuts to useful PMMG-Product (XIT PRUNSTAT) graphs',
);

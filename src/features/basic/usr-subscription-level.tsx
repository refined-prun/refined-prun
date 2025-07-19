import features from '@src/features/feature-registry';
import { usersStore } from '@src/infrastructure/prun-api/data/users';
import Passive from '@src/components/forms/Passive.vue';

function onTileReady(tile: PrunTile) {
  const username = tile.parameter;
  subscribe($$(tile.anchor, C.ActionBar.container), async container => {
    const children = Array.from(container.parentElement?.children ?? []);
    const actionBarIndex = children.indexOf(container);
    if (actionBarIndex === -1) {
      return;
    }

    const usernameIndex = actionBarIndex + 1;
    const usernameElement = children[usernameIndex];
    if (usernameElement === undefined) {
      return;
    }

    const user = usersStore.getByUsername(username);
    if (!user) {
      return;
    }

    createFragmentApp(() => <Passive label="License">{user.subscriptionLevel}</Passive>).after(
      usernameElement,
    );
  });
}

function init() {
  tiles.observe('USR', onTileReady);
}

features.add(import.meta.url, init, 'USR: Adds user license info.');

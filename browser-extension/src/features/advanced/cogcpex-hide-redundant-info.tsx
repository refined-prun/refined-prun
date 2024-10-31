import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

async function onTileReady(tile: PrunTile) {
  // Replace 'view details/vote' with 'vote'
  subscribe($$(tile.anchor, PrunCss.Button.darkInline), button => {
    button.textContent = 'vote';
  });

  // Remove redundant title parts
  subscribe($$(tile.anchor, PrunCss.Link.link), link => {
    if (link.textContent) {
      link.textContent = link
        .textContent!.replace('Advertising Campaign: ', '')
        .replace('Education Events: ', '');
    }
  });
}

export function init() {
  tiles.observe('COGCPEX', onTileReady);
}

void features.add({
  id: 'cogcpex-hide-redundant-info',
  advanced: true,
  init,
});

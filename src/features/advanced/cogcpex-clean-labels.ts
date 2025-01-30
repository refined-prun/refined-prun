import features from '@src/features/feature-registry';

function onTileReady(tile: PrunTile) {
  // Replace 'view details/vote' with 'vote'
  subscribe($$(tile.anchor, C.Button.darkInline), button => {
    button.textContent = 'vote';
  });

  // Remove redundant title parts
  subscribe($$(tile.anchor, C.Link.link), link => {
    if (link.textContent) {
      link.textContent = link
        .textContent!.replace('Advertising Campaign: ', '')
        .replace('Education Events: ', '');
    }
  });
}

function init() {
  tiles.observe('COGCPEX', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'COGCPEX: Hides "Advertising Campaign:" and "Education Events:" parts of the campaign labels.',
);

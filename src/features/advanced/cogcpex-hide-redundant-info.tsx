import features from '@src/feature-registry';

function onTileReady(tile: PrunTile) {
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

function init() {
  tiles.observe('COGCPEX', onTileReady);
}

features.add({
  id: 'cogcpex-hide-redundant-info',
  description:
    'COGCPEX: Hides "Advertising Campaign:" and "Education Events:" parts of the campaign labels.',
  advanced: true,
  init,
});

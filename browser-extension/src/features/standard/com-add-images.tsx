import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { Fragment } from 'vue';

async function onTileReady(tile: PrunTile) {
  const messages = await descendantPresent(tile.frame, PrunCss.MessageList.messages);
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: messages,
    callback: processLink,
  });
}

function processLink(element: HTMLElement) {
  const link = element.textContent;
  if (!link || !isImage(link)) {
    return;
  }

  const style = {
    maxHeight: '300px',
    maxWidth: '90%',
  };

  createFragmentApp(() => (
    <Fragment>
      <br />
      <img src={link} alt="Chat image" style={style} />
    </Fragment>
  )).appendTo(element.parentElement!);
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export function init() {
  tiles.observe(['COMG', 'COMP', 'COMU'], onTileReady);
}

void features.add({
  id: 'com-add-images',
  init,
});

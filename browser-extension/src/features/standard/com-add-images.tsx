import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { Fragment } from 'vue';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.MessageList.messages), messages => {
    subscribe($$(messages, PrunCss.Link.link), processLink);
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
  if (companyStore.value?.code === 'TEP') {
    return;
  }
  tiles.observe(['COMG', 'COMP', 'COMU'], onTileReady);
}

void features.add({
  id: 'com-add-images',
  description: 'COM: Adds images to messages containing image URLs.',
  init,
});

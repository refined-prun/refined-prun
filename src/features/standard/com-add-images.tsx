import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.MessageList.messages), messages => {
    subscribe($$(messages, C.Link.link), processLink);
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
    <>
      <br />
      <img src={link} alt="Chat image" style={style} />
    </>
  )).appendTo(element.parentElement!);
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function init() {
  if (companyStore.value?.code === 'TEP') {
    return;
  }
  tiles.observe(['COMG', 'COMP', 'COMU'], onTileReady);
}

features.add(import.meta.url, init, 'COM: Adds images to messages containing image URLs.');

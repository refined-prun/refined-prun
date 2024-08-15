import features from '../feature-registry';
import buffers from '../prun-ui/prun-buffers';
import PrunCss from '../prun-ui/prun-css';
import descendantPresent from '../utils/descendant-present';
import { observeReadyElementsByClassName } from '../utils/mutation-observer';
import { widgetAppend } from '../utils/vue-mount';
import { Fragment } from 'vue';

async function onBufferCreated(buffer: PrunBuffer) {
  const messages = await descendantPresent(buffer.frame, PrunCss.MessageList.messages);
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

  widgetAppend(element.parentElement!, () => (
    <Fragment>
      <br />
      <img src={link} alt="Chat image" style={style} />
    </Fragment>
  ));
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export function init() {
  buffers.observe(['COMG', 'COMP', 'COMU'], onBufferCreated);
}

void features.add({
  id: 'com-add-images',
  init,
});

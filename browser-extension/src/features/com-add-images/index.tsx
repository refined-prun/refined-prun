import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import PrunCss from '@src/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { widgetAppend } from '@src/utils/vue-mount';
import ChatImage from '@src/features/com-add-images/ChatImage.vue';

async function onBufferCreated(buffer: PrunBuffer) {
  const messages = await descendantPresent(buffer.frame, PrunCss.MessageList.messages);
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: messages,
    callback: link => {
      const linkText = link.textContent;
      if (link.parentElement && linkText && isImage(linkText)) {
        widgetAppend(link.parentElement, ChatImage, { link: linkText });
      }
    },
  });
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

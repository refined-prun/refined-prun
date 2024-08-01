import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import PrunCss from '@src/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { h } from 'dom-chef';

async function onBufferCreated(buffer: PrunBuffer) {
  const chatArea = await descendantPresent(buffer.frame, PrunCss.Channel.messageAndUserList);
  const chatLinks = chatArea.getElementsByClassName(PrunCss.Link.link);
  const processedLinks: WeakSet<Element> = new WeakSet();
  runUpdate();

  function runUpdate() {
    if (!buffer.frame.isConnected) {
      return;
    }
    for (const link of Array.from(chatLinks)) {
      if (processedLinks.has(link)) {
        continue;
      }

      processedLinks.add(link);
      const linkText = link.textContent;
      if (!link.parentElement || !linkText || !isImage(linkText)) {
        continue;
      }

      const img = (
        <img
          src={linkText}
          alt="Chat image"
          className="chat-image"
          onLoad={() => chatArea.scrollBy(0, (img.offsetHeight || 0) + 2)}
        />
      );
      link.parentElement.appendChild(<br />);
      link.parentElement.appendChild(img);
    }
    requestAnimationFrame(runUpdate);
  }
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

import { Module } from '../ModuleRunner';
import { getBuffersFromList } from '../util';
import { Selector } from '../Selector';

/**
 * Display images or gifs in chat
 */
export class ImageCreator implements Module {
  private tag = 'pb-image';

  constructor() {}

  cleanup() {
    // Nothing to clean up.
    return;
  }

  run(allBuffers) {
    const buffers = getBuffersFromList('COM', allBuffers);

    if (!buffers) {
      return;
    }
    buffers.forEach(buffer => {
      const chatLinks = buffer.querySelectorAll(Selector.BufferLink); // Chat link elements. Also includes company code links! Make sure to filter out...
      const chatArea = buffer.querySelector(Selector.ChatArea);
      if (!chatArea) {
        return;
      }
      (Array.from(chatLinks) as HTMLElement[]).forEach(link => {
        const linkText = link.textContent;
        if (!linkText || link.classList.contains(this.tag)) {
          return;
        }
        if (!isImage(linkText)) {
          return;
        }
        const img = document.createElement('img');
        img.classList.add('chat-image');
        img.src = linkText;
        if (!link.parentElement) {
          return;
        }
        link.parentElement.appendChild(document.createElement('br'));
        link.parentElement.appendChild(img);
        link.classList.add(this.tag);

        img.addEventListener('load', function () {
          chatArea.scrollBy(0, (img.offsetHeight || 0) + 2);
        });
        return;
      });
      return;
    });

    return;
  }
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

import { Ref } from 'vue';
import { watchWhileNodeAlive } from '@src/utils/watch-while-node-alive';

export function createReactiveSpan(owner: Node, text: Ref<string | undefined>) {
  const element = document.createElement('span');
  watchWhileNodeAlive(
    owner,
    text,
    text => {
      element.style.display = text === undefined ? 'none' : '';
      element.textContent = text ?? null;
    },
    { immediate: true },
  );
  return element;
}

export function createReactiveDiv(owner: Node, text: Ref<string | undefined>) {
  const element = document.createElement('div');
  watchWhileNodeAlive(
    owner,
    text,
    text => {
      element.style.display = text === undefined ? 'none' : '';
      element.textContent = text ?? null;
    },
    { immediate: true },
  );
  return element;
}

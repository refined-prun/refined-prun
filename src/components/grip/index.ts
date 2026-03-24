import gripCss from './grip.module.css';
import { UseDraggableOptions } from 'vue-draggable-plus';

const dragging = ref(false);
const draggable: UseDraggableOptions<unknown> = {
  animation: 150,
  handle: `.${gripCss.grip}`,
  onStart: () => (dragging.value = true),
  onEnd: () => (dragging.value = false),
};

watch(dragging, () => {
  document.documentElement.classList.toggle(gripCss.gripRoot, dragging.value);
});

export const grip = {
  class: gripCss.grip,
  draggable,
};

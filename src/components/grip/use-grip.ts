import grip from './grip.module.css';
import { UseDraggableOptions } from 'vue-draggable-plus';

export function useGrip() {
  const dragging = ref(false);
  const draggable: UseDraggableOptions<unknown> = {
    animation: 150,
    handle: `.${grip.grip}`,
    onStart: () => (dragging.value = true),
    onEnd: () => (dragging.value = false),
  };
  const rootClass = computed(() => (dragging.value ? grip.gripRoot : undefined));

  return {
    draggable,
    get rootClass() {
      return rootClass.value;
    },
  };
}

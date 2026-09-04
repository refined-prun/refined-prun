<script setup lang="ts">
const { hasMore } = defineProps<{ hasMore: boolean }>();
const emit = defineEmits<{ (e: 'loadMore'): void }>();

const sentinel = useTemplateRef<HTMLButtonElement>('sentinel');
let observer: IntersectionObserver | undefined;

function rearm() {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value);
    observer.observe(sentinel.value);
  }
}

function loadMore() {
  if (!hasMore) {
    return;
  }
  emit('loadMore');
  void nextTick(rearm);
}

watch(
  () => hasMore,
  value => value && void nextTick(rearm),
);

onMounted(() => {
  const el = sentinel.value!;
  const root = el.closest(`.${C.ScrollView.view}`) ?? null;
  observer = new IntersectionObserver(entries => entries[0].isIntersecting && loadMore(), {
    root,
    rootMargin: `0px 0px 500px 0px`,
  });
  observer.observe(el);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <button
    ref="sentinel"
    :class="[C.EndlessScrollControl.loadMore, { [C.EndlessScrollControl.hidden]: !hasMore }]"
    @click="loadMore">
    {{ L.EndlessScrollControl.label.loadmore() }}
  </button>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

const props = defineProps({
  marker: {
    type: String,
    default: undefined,
  },
  onNext: {
    type: Function as PropType<() => void>,
    required: true,
  },
  onPrevious: {
    type: Function as PropType<() => void>,
    required: true,
  },
});

const boxStyle = computed(() => ({
  display: props.marker !== undefined ? 'block' : undefined,
}));

function onClick(ev: Event) {
  ev.preventDefault();
  ev.stopPropagation();
  props.onNext();
}

function onContextMenu(ev: Event) {
  ev.preventDefault();
  ev.stopPropagation();
  props.onPrevious();
}
</script>

<template>
  <div :class="$style.container" @click="onClick" @contextmenu="onContextMenu">
    <div :class="$style.box" :style="boxStyle">
      <img v-if="marker" :class="$style.icon" :src="marker" alt="Icon Marker" />
    </div>
  </div>
</template>

<style module>
.container {
  width: 15px;
  height: 15px;
  position: absolute;
  bottom: 0;
  user-select: none;
}

.box {
  background: #29353f;
  border-color: #314b5f;
  border-style: solid;
  border-width: 1px;
  border-radius: 4px 4px 4px 0;
  height: 100%;
  width: 100%;
  display: none;
}

.container:hover > .box {
  display: block;
}

.icon {
  margin: 1px;
}
</style>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import fa from '@src/utils/font-awesome.module.css';

const props = defineProps({
  marker: {
    type: String,
    default: undefined,
  },
  color: {
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
</script>

<template>
  <div
    :class="$style.container"
    @click.left.prevent.stop="onNext"
    @click.right.prevent.stop="onPrevious">
    <div :class="$style.box" :style="boxStyle">
      <div v-if="marker" :class="[fa.solid, $style.icon]" :style="{ color }">{{ marker }}</div>
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
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 1px 1px #222;
}
</style>

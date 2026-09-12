<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const { hasItems } = defineProps<{
  hasItems: boolean;
}>();

const tab = useTemplateRef('tab');
const showDropdown = ref(false);
const dropdownStyle = ref<Record<string, string>>({});
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function clearHide() {
  clearTimeout(hideTimer);
  hideTimer = undefined;
}

function onTabEnter() {
  clearHide();
  const rect = tab.value!.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom}px`,
    left: `${rect.left}px`,
  };
  showDropdown.value = true;
}

function scheduleHide() {
  clearHide();
  hideTimer = setTimeout(() => {
    showDropdown.value = false;
    hideTimer = undefined;
  }, 150);
}

onBeforeUnmount(clearHide);
</script>

<template>
  <div ref="tab" v-bind="$attrs" @mouseenter="onTabEnter" @mouseleave="scheduleHide">
    <slot />
  </div>
  <Teleport to="body">
    <div
      v-if="showDropdown && hasItems"
      :class="[$style.dropdown, C.fonts.fontRegular, C.type.typeRegular]"
      :style="dropdownStyle"
      @mouseenter="clearHide"
      @mouseleave="scheduleHide">
      <slot name="dropdown" />
    </div>
  </Teleport>
</template>

<style module>
.dropdown {
  position: fixed;
  z-index: 9999;
  background: #181818;
  border: 1px solid #333;
  min-width: 120px;
}
</style>

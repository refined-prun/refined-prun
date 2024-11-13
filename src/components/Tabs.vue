<script setup lang="ts">
export interface Tab {
  id: string;
  label: string;
  component: Component;
}

defineProps({
  tabs: {
    type: Array as PropType<Tab[]>,
    required: true,
  },
});

const model = defineModel<Tab>({
  required: true,
});
</script>

<template>
  <div :class="C.Tabs.component">
    <div :class="C.Tabs.tabs">
      <div v-for="tab in tabs" :key="tab.id" :class="C.Tabs.header" @click="model = tab">
        <template v-if="model.id === tab.id">
          <a :class="[C.Tabs.tabActive, C.Tabs.tab, C.fonts.fontRegular, C.type.typeRegular]">
            {{ tab.label }}
          </a>
          <div
            :class="[
              C.Tabs.toggleIndicator,
              C.Tabs.toggleIndicatorActive,
              C.effects.shadowPrimary,
            ]" />
        </template>
        <template v-else>
          <a :class="[C.Tabs.tab, C.fonts.fontRegular, C.type.typeRegular]">{{ tab.label }}</a>
          <div :class="[C.Tabs.toggleIndicator]" />
        </template>
      </div>
    </div>
    <article :class="C.Tabs.content">
      <div>
        <component :is="model.component" />
      </div>
    </article>
  </div>
</template>

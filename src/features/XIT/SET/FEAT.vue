<script lang="ts">
const changed = reactive({});
</script>

<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import { computed, ref } from 'vue';
import { isEmpty } from 'ts-extras';
import PrunButton from '@src/components/PrunButton.vue';
import { reloadPage } from '@src/infrastructure/prun-ui/page-functions';

const sorted = features.registry.sort((a, b) => a.id.localeCompare(b.id));

const searchIndex = new Map<string, string>();
for (const feature of sorted) {
  searchIndex.set(feature.id, `${feature.id} ${feature.description}`.toLowerCase());
}

const searchQuery = ref('');

const filtered = computed(() => {
  const keywords = searchQuery.value
    .toLowerCase()
    .replaceAll(/\W/g, ' ')
    .split(/\s+/)
    .filter(Boolean); // Ignore empty strings
  if (keywords.length === 0) {
    return sorted;
  }
  return sorted.filter(feature => keywords.some(x => searchIndex.get(feature.id)!.includes(x)));
});

function toggleFeature(id: string) {
  if (changed[id]) {
    delete changed[id];
  } else {
    changed[id] = true;
  }
}
</script>

<template>
  <div>
    <SectionHeader>Features ({{ sorted.length }})</SectionHeader>
    <form :class="$style.search">
      <Active label="Search">
        <TextInput v-model="searchQuery" />
      </Active>
      <PrunButton
        v-if="!isEmpty(Object.keys(changed))"
        primary
        :class="$style.warning"
        @click="reloadPage()">
        RESTART THE GAME TO APPLY CHANGES
      </PrunButton>
    </form>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feature in filtered" :key="feature.id">
          <td :class="$style.row" @click="toggleFeature(feature.id)">
            <div
              :class="[
                C.RadioItem.indicator,
                C.RadioItem.active,
                C.effects.shadowPrimary,
                $style.indicator,
              ]" />
            <div>
              <div :class="$style.id">{{ feature.id }}</div>
              <div :class="$style.description">{{ feature.description }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module>
.search {
  position: sticky;
  top: 0;
  background-color: #222222;
  z-index: 1;
}

.row {
  display: flex;
  flex-direction: row;
  cursor: pointer;
}

.indicator {
  height: 12px;
}

.id {
  font-weight: bold;
  margin-bottom: 4px;
}

.description {
  font-size: 10px;
  color: #888;
}

.warning {
  width: 100%;
}
</style>

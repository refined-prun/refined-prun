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
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import { saveUserData } from '@src/infrastructure/storage/user-data-serializer';
import Commands from '@src/components/forms/Commands.vue';

const isFullMode = userData.settings.mode === 'FULL';

const disabledFeatures = computed(() => new Set(userData.settings.disabled));

const available = isFullMode ? features.registry : features.registry.filter(x => !x.advanced);

const sorted = available.sort((a, b) => {
  const aDisabled = disabledFeatures.value.has(a.id);
  const bDisabled = disabledFeatures.value.has(b.id);
  if (aDisabled && !bDisabled) {
    return -1;
  }
  if (!aDisabled && bDisabled) {
    return 1;
  }
  return a.id.localeCompare(b.id);
});

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
  const disabled = userData.settings.disabled;
  if (disabledFeatures.value.has(id)) {
    removeArrayElement(disabled, id);
  } else {
    disabled.push(id);
  }
  void saveUserData();
}

function toggleClass(id: string) {
  return disabledFeatures.value.has(id) ? undefined : [C.RadioItem.active, C.effects.shadowPrimary];
}

async function onReloadClick() {
  await saveUserData();
  reloadPage();
}

async function onChangeModeClick() {
  if (isFullMode) {
    userData.settings.mode = 'BASIC';
  } else {
    userData.settings.mode = 'FULL';
  }
  await saveUserData();
  reloadPage();
}
</script>

<template>
  <div>
    <SectionHeader>
      Features: {{ sorted.length }}
      <span v-if="disabledFeatures.size > 0">({{ disabledFeatures.size }} off)</span>
    </SectionHeader>
    <form :class="$style.form">
      <Commands label="Change feature set">
        <PrunButton primary @click="onChangeModeClick">
          SWITCH TO {{ isFullMode ? 'BASIC' : 'FULL' }}
        </PrunButton>
      </Commands>
      <Active :class="$style.warningRoot" label="Search">
        <TextInput v-model="searchQuery" />
        <PrunButton
          v-if="!isEmpty(Object.keys(changed))"
          primary
          :class="$style.warning"
          @click="onReloadClick">
          RESTART THE GAME TO APPLY CHANGES
        </PrunButton>
      </Active>
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
            <div :class="[C.RadioItem.indicator, $style.indicator, toggleClass(feature.id)]" />
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
.form {
  position: sticky;
  top: 0;
  background-color: #222222;
  z-index: 1;
}

.warningRoot {
  position: relative;
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
  position: absolute;
  bottom: -100%;
}
</style>

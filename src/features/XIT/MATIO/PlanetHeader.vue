<script setup lang="ts">
import SelectInput from '@src/components/forms/SelectInput.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';
import { PlanetBurn } from '@src/core/burn';
import {
  pricingFromOptionValue,
  pricingOptions,
  pricingToOptionValue,
  MatioPricing,
} from '@src/features/XIT/MATIO/utils';

const emit = defineEmits<{
  'update:pricing': [value: MatioPricing];
}>();

const { section, hasMinimize, minimized, onClick, pricing } = defineProps<{
  section: PlanetBurn;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
  pricing: MatioPricing;
}>();

const pricingModel = computed({
  get: () => pricingToOptionValue(pricing),
  set: value => emit('update:pricing', pricingFromOptionValue(value) ?? pricing),
});
</script>

<template>
  <tr :class="$style.row">
    <td colspan="5" :class="$style.cell" @click="onClick">
      <div :class="$style.titleContent">
        <div>
          <span v-if="hasMinimize" :class="$style.minimize">
            {{ minimized ? '+' : '-' }}
          </span>
          <span>{{ section.planetName }}</span>
        </div>
        <div :class="[C.FormComponent.input, C.forms.input]">
          <div :class="[C.StaticInput.static, C.forms.static]">
            <SelectInput v-model="pricingModel" :options="pricingOptions" @click.stop />
          </div>
        </div>
      </div>
    </td>
    <td>
      <div :class="$style.buttons">
        <PrunButton dark inline @click="showBuffer(`BS ${section.naturalId}`)">BS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`INV ${section.storeId.substring(0, 8)}`)">
          INV
        </PrunButton>
      </div>
    </td>
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #2b485a;
}

.cell {
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
}

.titleContent {
  display: flex;
  align-items: center;
}

.minimize {
  display: inline-block;
  width: 26px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}
</style>

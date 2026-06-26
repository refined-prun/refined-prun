<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { parsePaste } from '@src/features/XIT/ACT/material-groups/paste/paste';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

const { config } = defineProps<{ data: UserData.MaterialGroupData; config: Config }>();

const currencyOptions = [configurableValue, 'AI1', 'CI1', 'IC1', 'NC1', 'CI2', 'NC2'];

const text = ref(config.materials ?? '');
const currency = ref(config.currency ?? configurableValue);

config.currency = currency.value;

watch(text, value => {
  config.materials = value;
});

watch(currency, value => {
  config.currency = value;
});

const result = computed(() => parsePaste(text.value));
const errors = computed(() => result.value.errors);
const hasError = computed(() => errors.value.length > 0 || result.value.rows.length === 0);
</script>

<template>
  <form>
    <Active label="Materials" :error="hasError">
      <textarea
        v-model="text"
        :class="$style.textarea"
        placeholder="Paste from a spreadsheet (tab-separated) or type manually (comma-separated)&#10;TICKER  QTY  PRICE&#10;RAT     100  530&#10;&#10;PRICE is optional; max 3 significant figures."
        spellcheck="false" />
    </Active>
    <Active label="Currency">
      <SelectInput v-model="currency" :options="currencyOptions" />
    </Active>
    <ul v-if="errors.length > 0" :class="$style.errors">
      <li v-for="error in errors" :key="error.line"> Line {{ error.line }}: {{ error.reason }} </li>
    </ul>
  </form>
</template>

<style module>
.textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background: transparent;
  border: none;

  &:focus {
    outline: none;
  }
}

.errors {
  margin: 4px 0 0;
  padding-left: 16px;
  color: rgb(217, 83, 79);
  font-size: 11px;
}
</style>

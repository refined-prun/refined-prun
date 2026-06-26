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
const fatal = computed(() => result.value.fatal);
const rowCount = computed(() => result.value.rows.length);
const hasError = computed(() => !!fatal.value || errors.value.length > 0 || rowCount.value === 0);

// "N of M lines have errors" — M counts only non-empty lines.
const nonEmptyLineCount = computed(
  () => text.value.split('\n').filter(x => x.trim().length > 0).length,
);

const summary = computed(() => {
  if (text.value.trim().length === 0) {
    return undefined;
  }
  if (fatal.value) {
    return fatal.value;
  }
  if (errors.value.length > 0) {
    return `${errors.value.length} of ${nonEmptyLineCount.value} lines have errors`;
  }
  if (rowCount.value === 0) {
    return 'No materials parsed';
  }
  return `${rowCount.value} material${rowCount.value === 1 ? '' : 's'} ready`;
});
</script>

<template>
  <form>
    <Active label="Materials" :error="hasError">
      <textarea
        v-model="text"
        :class="$style.textarea"
        placeholder="Paste from a spreadsheet (tab-separated) or type manually&#10;TICKER  QTY  PRICE&#10;RAT     100  530&#10;&#10;One delimiter per paste (tab, comma, or semicolon).&#10;PRICE is optional; max 3 significant figures."
        spellcheck="false" />
    </Active>
    <Active label="Currency">
      <SelectInput v-model="currency" :options="currencyOptions" />
    </Active>
    <div
      v-if="summary"
      :class="[$style.summary, hasError ? $style.summaryError : $style.summaryOk]">
      {{ summary }}
    </div>
    <ul v-if="!fatal && errors.length > 0" :class="$style.errors">
      <li v-for="error in errors" :key="error.line">
        <span :class="$style.line">Line {{ error.line }}</span>
        {{ error.reason }}
      </li>
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

.summary {
  margin-top: 4px;
  font-size: 12px;
}

.summaryError {
  color: rgb(217, 83, 79);
}

.summaryOk {
  color: rgb(122, 168, 116);
}

.errors {
  /* Cap height so a paste with many bad lines scrolls instead of growing the
     dialog past the window. ~8 rows visible before scrolling. */
  max-height: 160px;
  overflow-y: auto;
  margin: 4px 0 0;
  padding-left: 0;
  list-style: none;
  font-size: 11px;
  color: rgb(217, 83, 79);
}

.errors li {
  padding: 1px 0;
}

.line {
  display: inline-block;
  min-width: 52px;
  font-weight: bold;
}
</style>

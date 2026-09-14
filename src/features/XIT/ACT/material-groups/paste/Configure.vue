<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { parsePaste } from '@src/features/XIT/ACT/material-groups/paste/paste-parse';
import { resolveTicker } from '@src/features/XIT/ACT/material-groups/paste/paste';

const { config } = defineProps<{ data: UserData.MaterialGroupData; config: Config }>();

const result = computed(() => parsePaste(config.materials, resolveTicker));
const rowCount = computed(() => result.value.rows.length);
const hasError = computed(
  () => result.value.fatal !== undefined || result.value.errors.length > 0 || rowCount.value === 0,
);

// "N of M rows" counts only rows the player actually typed.
const filledRowCount = computed(
  () => (config.materials ?? '').split(/\r\n|\r|\n/).filter(x => x.trim().length > 0).length,
);

const summary = computed(() => {
  if ((config.materials ?? '').trim().length === 0) {
    return undefined;
  }
  if (result.value.fatal !== undefined) {
    return result.value.fatal;
  }
  const errorCount = result.value.errors.length;
  if (errorCount > 0) {
    return `${errorCount} of ${filledRowCount.value} rows have errors`;
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
        v-model="config.materials"
        :class="$style.textarea"
        :placeholder="`Paste from spreadsheet or type manually\nTICKER  AMOUNT  PRICE\nRAT     100     530\n\nPrice column is optional; at most 3 significant figures.\nOne delimiter per paste: tab, comma or semicolon.`"
        spellcheck="false" />
    </Active>
    <div v-if="summary" :class="[$style.summary, hasError ? $style.bad : $style.good]">
      {{ summary }}
    </div>
    <ul v-if="result.fatal === undefined && result.errors.length > 0" :class="$style.errors">
      <li v-for="error in result.errors" :key="error.line">
        <span :class="$style.line">Row {{ error.line }}</span>
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
}

.textarea:focus {
  outline: none;
}

.summary {
  margin-top: 4px;
  font-size: 11px;
}

.good {
  color: var(--rp-color-green);
}

.bad {
  color: var(--rp-color-red);
}

/* Cap the height so a paste with many bad rows scrolls instead of growing the
   dialog past the window. */
.errors {
  max-height: 160px;
  overflow-y: auto;
  margin: 4px 0 0;
  padding-left: 0;
  list-style: none;
  font-size: 11px;
  color: var(--rp-color-red);
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

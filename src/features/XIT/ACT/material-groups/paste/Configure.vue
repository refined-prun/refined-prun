<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { parseMaterials } from '@src/features/XIT/ACT/material-groups/paste/paste';

const { config } = defineProps<{ data: UserData.MaterialGroupData; config: Config }>();

const text = ref(config.materials ?? '');
const hasError = ref(false);

watch(text, value => {
  config.materials = value;
  hasError.value = parseMaterials(value) === undefined;
});
</script>

<template>
  <form>
    <Active label="Materials" :error="hasError">
      <textarea
        v-model="text"
        :class="$style.textarea"
        placeholder="Paste from spreadsheet or type manually&#10;TICKER  AMOUNT&#10;RAT     100&#10;&#10;Supports tab or comma separated values."
        spellcheck="false" />
    </Active>
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
</style>

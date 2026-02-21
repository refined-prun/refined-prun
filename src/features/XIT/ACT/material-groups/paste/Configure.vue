<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { parseMaterials } from '@src/features/XIT/ACT/material-groups/paste/paste';

const { config } = defineProps<{ data: UserData.MaterialGroupData; config: Config }>();

const text = ref(config.materials ?? '');
const hasError = ref(false);

watch(text, value => {
  config.materials = value;
  const parsed = parseMaterials(value);
  hasError.value = parsed === undefined;
});
</script>

<template>
  <form>
    <Active label="Materials" :error="hasError">
      <textarea
        v-model="text"
        :class="$style.textarea"
        placeholder="Paste materials (ticker, amount [, price])"
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
}

.textarea:focus {
  outline: none;
}
</style>

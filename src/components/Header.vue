<script setup lang="ts">
import { showErrorOverlay } from '@src/infrastructure/prun-ui/tile-overlay';

const model = defineModel<string>();

const { editable = false, validate = () => true } = defineProps<{
  editable?: boolean;
  validate?: (value: string) => string | boolean;
}>();

const inputRef = useTemplateRef<HTMLInputElement>('input');
const inputValue = ref('');
const isEditing = ref(false);

function onHeaderClick() {
  isEditing.value = true;
  inputValue.value = model.value ?? '';
  nextTick(() => inputRef.value?.focus());
}

function onEnterPress(event: KeyboardEvent) {
  if (inputValue.value.length === 0) {
    inputRef.value?.blur();
    return;
  }
  const result = validate(inputValue.value);
  if (result !== true) {
    showErrorOverlay(event, typeof result === 'string' ? result : 'Illegal arguments.');
    inputRef.value?.blur();
    return;
  }
  model.value = inputValue.value;
  inputRef.value?.blur();
}

function onBlur() {
  isEditing.value = false;
}
</script>

<template>
  <div :class="[$style.heading, C.fonts.fontHeaders, C.type.typeVeryLarge]">
    <template v-if="editable">
      <span v-if="!isEditing" :class="$style.editable" @click="onHeaderClick">
        {{ model }}
      </span>
      <input
        v-if="isEditing"
        ref="input"
        v-model="inputValue"
        :class="$style.input"
        autocomplete="off"
        type="text"
        placeholder=""
        @keyup.enter="onEnterPress"
        @blur="onBlur" />
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style module>
.heading {
  margin: 0;
  font-weight: normal;
}

.editable {
  cursor: pointer;
}

.input {
  width: 160px;
  padding: 1px 4px 2px;
  text-align: left;
  text-transform: none;
  border: 0;
  border-bottom: 1px solid #8d6411;
  background-color: #42361d;
  color: #bbb;
  outline: none;
}
</style>

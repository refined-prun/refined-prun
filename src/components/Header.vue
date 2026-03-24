<script setup lang="ts">
const model = defineModel<string>();

const { editable = false } = defineProps<{ editable?: boolean }>();

const inputRef = useTemplateRef<HTMLInputElement>('input');
const inputValue = ref('');
const isEditing = ref(false);

function onHeaderClick() {
  isEditing.value = true;
  inputValue.value = model.value ?? '';
  nextTick(() => inputRef.value?.focus());
}

function onEnterPress() {
  if (inputValue.value.length > 0) {
    model.value = inputValue.value;
  }
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

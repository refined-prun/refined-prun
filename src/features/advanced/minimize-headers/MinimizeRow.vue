<script setup lang="ts">
const props = defineProps({
  isMinimized: Boolean,
  onClick: {
    type: Function as PropType<() => void>,
    required: true,
  },
});

const symbol = computed(() => (props.isMinimized ? '+' : '-'));
</script>

<template>
  <div :class="[C.FormComponent.containerPassive, C.forms.passive, C.forms.formComponent]">
    <label :class="[C.FormComponent.label, C.fonts.fontRegular, C.type.typeRegular]"
      >Minimize</label
    >
    <div :class="[C.FormComponent.input, C.forms.input]">
      <div>
        <div :class="$style.minimize" @click="onClick">{{ symbol }}</div>
      </div>
    </div>
  </div>
</template>

<style module>
.minimize {
  font-size: 14px;
  font-weight: bold;
  margin-left: auto;
  margin-right: 3px;
  margin-top: 1px;
  text-align: center;
  width: 18px;
  cursor: pointer;
  background-color: #26353e;
  color: #3fa2de;
}

.minimize:hover {
  color: #26353e;
  background-color: #3fa2de;
}
</style>

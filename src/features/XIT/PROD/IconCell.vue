<template>
  <td :class="$style.iconCell">
    <slot />
  </td>
</template>

<style module>
.iconCell {
  display: flex;
  width: 32px;
  height: 18px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  line-height: 0;
  padding: 0;
}
</style>

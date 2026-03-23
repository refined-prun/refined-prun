<template>
  <td :class="$style.iconCell">
    <slot />
  </td>
</template>

<style module>
.iconCell {
  width: 32px;
  padding: 0;
}
</style>

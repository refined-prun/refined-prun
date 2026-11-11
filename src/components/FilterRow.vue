<template>
  <div :class="$style.row">
    <slot />
  </div>
</template>

<style module>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 6px;
  padding: 2px 0;
}
</style>

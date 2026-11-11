<template>
  <div :class="$style.container">
    <slot />
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  column-gap: 3px;
  padding: 5px;
  position: sticky;
  top: -1px;
  background: #23282b;
  z-index: 1;
}
</style>

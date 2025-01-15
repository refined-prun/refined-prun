<template>
  <div :class="$style.header">
    <h2 :class="[$style.heading, C.fonts.fontHeaders, C.type.typeVeryLarge]">
      <slot />
    </h2>
  </div>
</template>

<style module>
.header {
  margin-left: 4px;
}

.heading {
  margin: 0;
  font-weight: normal;
}
</style>

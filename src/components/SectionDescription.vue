<template>
  <div :class="$style.description"><slot /></div>
</template>

<style module>
.description {
  line-height: 13px;
  padding: 0 4px;
  background-color: #26353e;
  margin-bottom: 5px;
}
</style>

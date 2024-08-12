<script setup lang="ts">
defineProps({
  link: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <br />
  <img :src="link" alt="Chat image" :class="$style.image" />
</template>

<style module>
.image {
  max-height: 300px;
  max-width: 90%;
}
</style>

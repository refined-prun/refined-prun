<script setup lang="ts">
defineProps({
  reverse: Boolean,
});
</script>

<template>
  <div :class="C.InventorySortControls.order" style="display: inline">
    <div style="display: block">
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        role="img"
        fill="currentcolor"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        style="vertical-align: middle">
        <g>
          <path v-if="reverse" d="M25.422964 22.120933l-12.13774-21.02318L.88681 22.11324z" />
          <path v-else d="M.88681 1.097752l12.13774 21.02318L25.422964 1.105446z" />
        </g>
      </svg>
    </div>
  </div>
</template>

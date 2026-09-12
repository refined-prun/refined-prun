<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { planetContextMenu } from './planet-context-menu';
</script>

<template>
  <div id="planet_contextmenu" :class="$style.contextMenu" :style="planetContextMenu.menuStyle">
    <div v-if="planetContextMenu.naturalId">
      <PrunButton dark :class="$style.prunButton" @click="planetContextMenu.showBuffer('PLI')">
        PLI
      </PrunButton>
      <PrunButton dark :class="$style.prunButton" @click="planetContextMenu.showBuffer('COGC')">
        COGC
      </PrunButton>
      <PrunButton dark :class="$style.prunButton" @click="planetContextMenu.showBuffer('POPR')">
        POPR
      </PrunButton>
      <PrunButton dark :class="$style.prunButton" @click="planetContextMenu.showBuffer('POPI')">
        POPI
      </PrunButton>
      <PrunButton dark :class="$style.prunButton" @click="planetContextMenu.showBuffer('ADM')">
        ADM
      </PrunButton>
    </div>
  </div>
</template>

<style module>
.prunButton {
  display: block;
  margin-left: 0 !important;
  font-size: 10px;
  line-height: 11px;
  text-transform: none;
  padding: 1px 6px;
  width: 100%;
}

.contextMenu {
  background: rgb(38, 38, 38);
  border: 2px solid rgb(196, 132, 0);
  border-radius: 4px;
  color: rgb(238, 238, 238);
  position: absolute;
  z-index: 99998;
}
</style>

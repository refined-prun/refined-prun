<script setup lang="ts">
const { planetCmd, weight, weightMax, volume, volumeMax } = defineProps<{
  planetCmd: string;
  weight: string;
  weightMax: string;
  volume: string;
  volumeMax: string;
}>();
</script>

<template>
  <div :class="C.ContextControls.container">
    <div :class="$style.marginRight">
      <div :class="[C.StoreView.container, $style.noPaddingCenterHeight]">
        <div :class="C.StoreView.row">
          <div :class="C.StoreView.column">
            <div :class="[C.StoreView.capacity, $style.noPaddingTopBottom]">
              <span :class="[C.StoreView.name, $style.widthAuto]">Weight:</span>
              <div :class="C.ProgressBar.container">
                <progress
                  :class="[C.ProgressBar.primary, C.ProgressBar.progress]"
                  :value="weight"
                  :max="weightMax"></progress>
              </div>
              {{ weight }} / {{ weightMax }}t
            </div>
          </div>
          <div :class="C.StoreView.column">
            <div :class="[C.StoreView.capacity, $style.noPaddingTopBottom]">
              <span :class="[C.StoreView.name, $style.widthAuto]">Volume:</span>
              <div :class="C.ProgressBar.container">
                <progress
                  :class="[C.ProgressBar.primary, C.ProgressBar.progress]"
                  :value="volume"
                  :max="volumeMax"></progress>
              </div>
              {{ volume }} / {{ volumeMax }}m³
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.marginLeft">
      <div :class="[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]">
        <span>
          <span :class="C.ContextControls.cmd">PLI</span>
          {{ planetCmd }}
        </span>
      </div>
    </div>
  </div>
</template>

<style module>
.noPaddingCenterHeight {
  padding: 0px;
  margin-top: 1px;
}
.noPaddingTopBottom {
  padding-top: 0px;
  padding-bottom: 0px;
}
.marginRight {
  margin-right: auto;
}
.marginLeft {
  margin-left: auto;
}
.widthAuto {
  width: auto;
}
</style>

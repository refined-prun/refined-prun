<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import PrunButton from '@src/components/PrunButton.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import GripCell from '@src/components/grip/GripCell.vue';
import { getPlanetBurn } from '@src/core/burn';
import { burnDaysClass, countDays, formatBurnDays } from '@src/features/XIT/BURN/utils';
import { getRepairOffset, getRepairThreshold } from '@src/core/buildings';
import { getPlanetRepairAge } from '@src/core/repair';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { timestampEachMinute } from '@src/utils/dayjs';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { fixed0 } from '@src/utils/format';
import type { MaterialFilter } from '@src/features/XIT/ACT/material-groups/resupply/config';
import { DispatchBaseConfig } from '@src/features/XIT/DSP/utils';
import { billTotals, MaterialBill } from '@src/features/XIT/ACT/material-bill';

const { siteId, naturalId, planetName, config, overloaded, bill } = defineProps<{
  siteId: string;
  naturalId: string;
  planetName: string;
  config: DispatchBaseConfig;
  overloaded: boolean;
  bill?: MaterialBill;
}>();

const emit = defineEmits<{
  fit: [];
}>();

const materialFilterOptions: MaterialFilter[] = ['All', 'Workforce', 'Production'];

const canFit = computed(() => !!config.ship);

const burn = computed(() => getPlanetBurn(siteId));
const days = computed(() => (burn.value ? countDays(burn.value.burn) : undefined));

const burnBgClass = computed(() => (days.value === undefined ? {} : burnDaysClass(days.value)));

const daysText = computed(() => (days.value === undefined ? '-' : formatBurnDays(days.value)));

const repairAge = computed(() => getPlanetRepairAge(siteId, timestampEachMinute.value));

const repairBgClass = computed(() => {
  const age = repairAge.value;
  if (age === undefined) {
    return {};
  }
  const threshold = getRepairThreshold(naturalId);
  const offset = getRepairOffset(naturalId);
  const d = Math.floor(age);
  return {
    [C.Workforces.daysMissing]: d >= threshold,
    [C.Workforces.daysWarning]: d >= threshold - offset,
    [C.Workforces.daysSupplied]: d < threshold - offset,
  };
});

const repairDaysText = computed(() => {
  const age = repairAge.value;
  if (age === undefined) {
    return '-';
  }
  return String(Math.floor(age));
});

const loadText = computed(() => {
  if (!config.resupply && !config.repair) {
    return '--';
  }
  if (!bill) {
    return '--';
  }
  const totals = billTotals(bill);
  return `${fixed0(totals.weight)}t - ${fixed0(totals.volume)}m³`;
});

const assignedShip = computed(() => (config.ship ? shipsStore.getById(config.ship) : undefined));

const shipLabel = computed(
  () => assignedShip.value?.name ?? assignedShip.value?.registration ?? config.ship,
);

const dragOver = ref(false);

// Stop the game's dragover handler from setting dropEffect to 'none', which causes snap-back.
function onDragEnter(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer!.dropEffect = 'copy';
  dragOver.value = true;
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer!.dropEffect = 'copy';
  dragOver.value = true;
}

function onDragLeave() {
  dragOver.value = false;
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  dragOver.value = false;
  const shipId = event.dataTransfer?.getData('text/plain');
  if (!shipId) {
    return;
  }
  // Defer state changes until after dragend; unmounting the source during drop freezes the ghost.
  setTimeout(() => {
    config.ship = shipId;
  }, 0);
}

function clearShip() {
  config.ship = undefined;
}
</script>

<template>
  <tr :class="$style.row">
    <td
      :class="[$style.shipCell, dragOver && $style.shipCellOver]"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop">
      <template v-if="config.ship && shipLabel">
        <div :class="$style.shipAssigned">
          <PrunButton primary inline :class="$style.shipButton">
            <span :class="$style.shipLabel">{{ shipLabel }}</span>
          </PrunButton>
          <PrunButton dark inline :class="$style.clearButton" @click="clearShip">×</PrunButton>
        </div>
      </template>
      <div v-else :class="$style.shipPlaceholder" />
    </td>
    <GripCell />
    <td :class="$style.planetCell">
      <PrunLink inline :command="`BS ${naturalId}`" :class="$style.planetLink">
        {{ planetName }}
      </PrunLink>
    </td>
    <td :class="$style.toggleCell">
      <RadioItem v-model="config.resupply" />
    </td>
    <td :class="$style.statusCell">
      <div
        :class="[$style.statusContent, burnBgClass]"
        @click="showBuffer(`XIT BURN ${naturalId}`)">
        <span :class="$style.statusNum">{{ daysText }}</span>
      </div>
    </td>
    <td :class="$style.toggleCell">
      <RadioItem v-model="config.repair" />
    </td>
    <td :class="$style.statusCell">
      <div
        :class="[$style.statusContent, repairBgClass]"
        @click="showBuffer(`XIT REP ${naturalId}`)">
        <span :class="$style.statusNum">{{ repairDaysText }}</span>
      </div>
    </td>
    <td
      :class="[
        C.type.typeSmall,
        $style.loadCell,
        overloaded && [C.Workforces.daysMissing, $style.loadOverloaded],
      ]">
      {{ loadText }}
    </td>
    <td :class="$style.selectCell">
      <div :class="[C.forms.input, $style.selectWrap]">
        <SelectInput v-model="config.materialFilter" :options="materialFilterOptions" />
      </div>
    </td>
    <td :class="$style.fitCell">
      <PrunButton dark inline :disabled="!canFit" @click="emit('fit')">FIT</PrunButton>
    </td>
    <td :class="$style.inputCell">
      <NumberInput v-model="config.days" :class="$style.faintInput" float />
    </td>
    <td :class="$style.inputCell">
      <NumberInput v-model="config.repThreshold" :class="$style.faintInput" float />
    </td>
    <td :class="$style.inputCell">
      <NumberInput v-model="config.repAdvance" :class="$style.faintInput" float />
    </td>
    <td :class="$style.advToggleCell">
      <RadioItem v-model="config.cxBuy" horizontal>BUY</RadioItem>
    </td>
    <td :class="$style.advToggleCell">
      <RadioItem v-model="config.offloadJson" horizontal>JSON</RadioItem>
    </td>
    <td :class="$style.advToggleCell">
      <RadioItem v-model="config.agent" horizontal>AGT</RadioItem>
    </td>
  </tr>
</template>

<style module>
.row {
  height: 24px;
  border-bottom: 1px solid #2b485a;
  box-sizing: border-box;
}

.planetCell {
  max-width: 30ch;
  font-weight: bold;
  font-size: 12px;
  padding: 0 4px;
  line-height: 22px;
}

.planetLink {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: inherit;
}

.statusCell {
  width: 44px;
  min-width: 44px;
  box-sizing: border-box;
  white-space: nowrap;
  padding: 2px;
  text-align: center;
  border-left: none;
}

.statusContent {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 18px;
  box-sizing: border-box;
  padding: 2px 4px;
}

.statusNum {
  min-width: 3ch;
  text-align: center;
}

.toggleCell {
  width: 0;
  padding: 0 1px 0 3px;
  vertical-align: middle;
  border-right: none;
}

.loadCell {
  width: 0;
  white-space: nowrap;
  padding: 0 6px;
  text-align: center;
  color: #f7a600;
}

.loadOverloaded {
  color: inherit;
}

.shipCell {
  width: 0;
  white-space: nowrap;
  padding: 0 4px;
  vertical-align: middle;
}

/* Two classes override the game's table tbody td:first-child border reset. */
.row .shipCell {
  border-left: 1px solid #f7a600;
}

.shipCellOver {
  background: #2b485a;
}

/* Match the assigned width so adding or clearing a ship does not shift the column. */
.shipPlaceholder {
  border: 1px dashed #444;
  height: 18px;
  width: 84px;
  border-radius: 2px;
  box-sizing: border-box;
}

.shipAssigned {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  width: 84px;
  box-sizing: border-box;
}

.shipButton {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* Truncate inside the button to preserve its padding and avoid clipped glyphs beside ✕. */
.shipLabel {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clearButton {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  font-size: 11px;
  padding: 0;
}

.inputCell {
  width: 0;
  white-space: nowrap;
  padding: 0 2px;
  line-height: 22px;
  vertical-align: middle;
}

.faintInput {
  width: 48px;
}

.faintInput :global(input) {
  width: 48px;
  height: 17px;
  background-color: transparent;
  border-width: 0 0 1px;
  border-bottom: 1px solid transparent;
  color: #888;
  padding: 0 4px;
  box-sizing: border-box;
}

.faintInput :global(input:focus) {
  outline: none;
  color: #ccc;
  border-bottom-color: #666;
}

.selectCell {
  width: 0;
  white-space: nowrap;
  padding: 0 2px;
  line-height: 22px;
  vertical-align: middle;
}

.selectWrap {
  width: 90px;
}

.selectWrap :global(div) {
  width: 90px;
  margin: 0;
}

.selectWrap :global(select) {
  width: 100%;
}

.advToggleCell {
  width: 0;
  white-space: nowrap;
  padding: 0 2px;
  vertical-align: middle;
  text-align: center;
}

.fitCell {
  width: 0;
  white-space: nowrap;
  padding: 0 4px;
  line-height: 22px;
  vertical-align: middle;
}
</style>

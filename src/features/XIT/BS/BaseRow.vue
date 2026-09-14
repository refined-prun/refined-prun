<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import PrunButton from '@src/components/PrunButton.vue';
import InvBar from '@src/features/XIT/BS/InvBar.vue';
import MaterialList from '@src/features/XIT/BURN/MaterialList.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getPlanetBurn } from '@src/core/burn';
import { burnDaysClass, countDays, formatBurnDays } from '@src/features/XIT/BURN/utils';
import { useTileState } from '@src/store/user-data-tiles';
import { getPickupAlarm, getStorageAlarmLevel } from '@src/core/storage-analysis';
import { fixed1 } from '@src/utils/format';
import { getPlanetProduction } from '@src/core/production';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getRepairOffset, getRepairThreshold } from '@src/core/buildings';
import { getPlanetRepairAge } from '@src/core/repair';
import { timestampEachMinute } from '@src/utils/dayjs';
import { planetContextMenu } from '@src/components/planet-context-menu/planet-context-menu';
import fa from '@src/utils/font-awesome.module.css';

const {
  siteId,
  naturalId,
  planetName,
  storeId,
  showCmds,
  showBurn,
  showProd,
  showRepair,
  showInv,
  showWar,
} = defineProps<{
  siteId: string;
  naturalId: string;
  planetName: string;
  storeId: string;
  showCmds: boolean;
  showBurn: boolean;
  showProd: boolean;
  showRepair: boolean;
  showInv: boolean;
  showWar: boolean;
}>();

const burn = computed(() => getPlanetBurn(siteId));
const days = computed(() => (burn.value ? countDays(burn.value.burn) : undefined));
const expandedBurns = useTileState('expandedBurns', [] as string[]);
const isBurnExpanded = computed(() => expandedBurns.value.includes(naturalId));
const columnCount = computed(
  () =>
    1 +
    Number(showCmds) +
    Number(showBurn) +
    Number(showProd) +
    Number(showRepair) +
    Number(showInv) +
    Number(showWar),
);

function onBurnDaysClick(e: MouseEvent) {
  if (e.shiftKey) {
    e.preventDefault();
    showBuffer(`XIT BURN ${naturalId}`);
    return;
  }

  expandedBurns.value = toggleExpandedBurn(expandedBurns.value, naturalId);
}

function toggleExpandedBurn(expanded: readonly string[], naturalId: string): string[] {
  if (expanded.includes(naturalId)) {
    return expanded.filter(x => x !== naturalId);
  }
  return [...expanded, naturalId];
}

const burnBgClass = computed(() => {
  if (days.value === undefined) {
    return {};
  }
  return burnDaysClass(days.value);
});

const daysText = computed(() => {
  if (days.value === undefined) {
    return undefined;
  }
  return formatBurnDays(days.value);
});

const production = computed(() => getPlanetProduction(siteId));
const prodTotals = computed(() => {
  const prod = production.value;
  if (!prod || prod.production.length === 0) {
    return undefined;
  }
  return {
    orders: sumBy(prod.production, x => x.orders.length),
    capacity: sumBy(prod.production, x => x.capacity),
  };
});
const prodBgClass = computed(() => {
  const totals = prodTotals.value;
  if (!totals) {
    return {};
  }
  return {
    [C.Workforces.daysMissing]: totals.orders < totals.capacity,
    [C.Workforces.daysSupplied]: totals.orders >= totals.capacity,
  };
});

const prodText = computed(() => {
  const totals = prodTotals.value;
  if (!totals) {
    return undefined;
  }
  return totals.orders >= totals.capacity ? '✓' : '∅';
});

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
    return undefined;
  }
  return String(Math.floor(age));
});

const storageAlarm = computed(() => getStorageAlarmLevel(siteId));
const fillDaysText = computed(() =>
  storageAlarm.value?.days !== undefined ? fixed1(storageAlarm.value.days) : undefined,
);
// The yellow alarm carries its own badge, which owns the tooltip. Only the
// red alarm, which has no badge, puts the reason on the bar itself.
const barAlarmReason = computed(() =>
  storageAlarm.value?.level === 'red' ? storageAlarm.value.reason : undefined,
);

const pickupAlarm = computed(() => getPickupAlarm(siteId));

const warehouse = computed(() => warehousesStore.getByEntityNaturalId(naturalId));
const warehouseStore = computed(() =>
  storagesStore
    .getByAddressableId(warehouse.value?.warehouseId)
    ?.find(x => x.type === 'WAREHOUSE_STORE'),
);
</script>

<template>
  <tr :class="$style.row">
    <td
      :class="$style.planetCell"
      @contextmenu.prevent="planetContextMenu.showMenu($event, naturalId)">
      <PrunLink inline :command="`BS ${naturalId}`" :class="$style.planetLink">
        {{ planetName }}
      </PrunLink>
    </td>
    <td v-if="showCmds" :class="$style.cmdCell">
      <PrunButton dark inline>CMDS&nbsp;▶</PrunButton>
      <div :class="$style.expandedButtons">
        <PrunButton dark inline @click="showBuffer(`BBL ${siteId}`)">BUILDINGS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`BBC ${naturalId}`)">CONSTRUCT</PrunButton>
        <PrunButton dark inline @click="showBuffer(`WF ${siteId}`)">WORKFORCE</PrunButton>
        <PrunButton dark inline @click="showBuffer(`EXP ${siteId}`)">EXPERTS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`BRA ${naturalId}`)">BRA</PrunButton>
        <PrunButton dark inline @click="showBuffer('HQ')">HQ</PrunButton>
      </div>
    </td>
    <td v-if="showBurn" :class="$style.statusCell">
      <div :class="[$style.statusContent, burnBgClass]">
        <span :class="$style.statusNum" @click="onBurnDaysClick">{{ daysText ?? '-' }}</span>
        <PrunButton dark inline @click="showBuffer(`XIT BURNACT ${naturalId}`)">RES</PrunButton>
      </div>
    </td>
    <td v-if="showProd" :class="$style.statusCell">
      <div :class="[$style.statusContent, prodBgClass]">
        <span :class="$style.statusNum" @click="showBuffer(`XIT PROD ${naturalId}`)">
          {{ prodText ?? '-' }}
        </span>
        <PrunButton dark inline @click="showBuffer(`XIT PROD ${naturalId}`)">PROD</PrunButton>
      </div>
    </td>
    <td v-if="showRepair" :class="$style.statusCell">
      <div :class="[$style.statusContent, repairBgClass]">
        <span :class="$style.statusNum" @click="showBuffer(`XIT REP ${naturalId}`)">
          {{ repairDaysText ?? '-' }}
        </span>
        <PrunButton dark inline @click="showBuffer(`XIT REPAIRACT ${naturalId}`)">REP</PrunButton>
      </div>
    </td>
    <td v-if="showInv" :class="$style.invCell">
      <div :class="$style.invCellContent">
        <InvBar
          :store-id="storeId"
          :natural-id="naturalId"
          :on-click-cmd="`INV ${storeId.substring(0, 8)}`"
          :alarm-level="storageAlarm?.level"
          :alarm-reason="barAlarmReason" />
        <div
          v-if="storageAlarm?.level === 'yellow'"
          :class="[C.ProgressBar.progress, $style.fillWarningBox, C.Workforces.daysWarning]"
          :data-tooltip="storageAlarm.reason"
          data-tooltip-position="top">
          <span :class="$style.statusNum">{{ fillDaysText }}</span>
        </div>
        <div
          v-if="pickupAlarm"
          :class="[C.ProgressBar.progress, $style.pickupBox, C.Workforces.daysSupplied]"
          :data-tooltip="pickupAlarm.reason"
          data-tooltip-position="top">
          <span :class="fa.solid">{{ '\uf135' }}</span>
        </div>
      </div>
    </td>
    <td v-if="showWar" :class="$style.invCell">
      <InvBar
        v-if="warehouseStore"
        :store-id="warehouseStore.id"
        :on-click-cmd="`INV ${warehouseStore.id.substring(0, 8)}`" />
    </td>
  </tr>
  <tr v-if="showBurn && isBurnExpanded && burn">
    <td :colspan="columnCount" :class="$style.burnExpandCell">
      <table :class="$style.burnExpandTable">
        <thead>
          <tr>
            <th />
            <th>Inv</th>
            <th>Burn</th>
            <th>Need</th>
            <th>Days</th>
            <th>CMD</th>
          </tr>
        </thead>
        <tbody>
          <MaterialList :burn="burn" />
        </tbody>
      </table>
    </td>
  </tr>
</template>

<style module>
.planetCell {
  max-width: 30ch;
  font-weight: bold;
  font-size: 12px;
}

.planetLink {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: inherit;
}

.cmdCell {
  position: relative;
  overflow: visible;
  white-space: nowrap;
  width: 0;
}

.expandedButtons {
  display: none;
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
  padding: 0 4px;
  white-space: nowrap;
}

.cmdCell:hover .expandedButtons {
  display: flex;
}

.row:has(.cmdCell:hover) .statusCell > *,
.row:has(.cmdCell:hover) .invCell > * {
  visibility: hidden;
}

.row {
  border-bottom: 1px solid #2b485a;
}

.statusCell {
  width: 0;
  white-space: nowrap;
  padding: 2px;
  text-align: center;
}

.statusContent {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  vertical-align: middle;
  padding: 2px 4px;
}

.statusNum {
  min-width: 3ch;
  text-align: center;
}

.invCell {
  min-width: 60px;
  padding: 2px;
}

.invCellContent {
  display: flex;
  align-items: center;
  gap: 2px;
}

.fillWarningBox {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 13px;
  padding: 0 1px;
}

/* padding: 0 cancels the game's [data-tooltip] rule (`padding: 0 4px 0`), which
   would otherwise widen the box beyond the glyph it centres. */
.pickupBox {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 13px;
  padding: 0;
  margin: 0;
  font-size: 10px;
  line-height: 1;
}

.burnExpandCell {
  padding: 0 4px 4px 24px;
}

.burnExpandTable {
  border-collapse: collapse;
}
</style>

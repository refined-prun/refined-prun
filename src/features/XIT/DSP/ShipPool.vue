<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import type { DispatchBaseConfig, DispatchShip } from '@src/features/XIT/DSP/utils';

const { ships, baseConfigs } = defineProps<{
  ships: DispatchShip[];
  baseConfigs: Record<string, DispatchBaseConfig>;
}>();

const assignedShipIds = computed(() => {
  const ids = new Set<string>();
  for (const config of Object.values(baseConfigs)) {
    if (config.ship) {
      ids.add(config.ship);
    }
  }
  return ids;
});

const sections = computed(() => [
  {
    label: 'Unassigned',
    ships: ships.filter(x => !assignedShipIds.value.has(x.ship.id)).sort(byShipLabel),
  },
  {
    label: 'Assigned',
    ships: ships.filter(x => assignedShipIds.value.has(x.ship.id)).sort(byShipLabel),
  },
]);

function shipLabel(entry: DispatchShip) {
  return entry.ship.name ?? entry.ship.registration;
}

function byShipLabel(a: DispatchShip, b: DispatchShip) {
  return shipLabel(a).localeCompare(shipLabel(b));
}

function onDragStart(event: DragEvent, shipId: string) {
  event.dataTransfer?.setData('text/plain', shipId);
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copyMove';
  }
  const button = _$(event.currentTarget as HTMLElement, 'button');
  if (button && event.dataTransfer) {
    event.dataTransfer.setDragImage(button, button.offsetWidth / 2, button.offsetHeight / 2);
  }
}
</script>

<template>
  <div :class="$style.pool">
    <table :class="$style.table">
      <thead>
        <tr>
          <th>Ships</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="section in sections" :key="section.label">
          <tr v-if="section.ships.length > 0" :class="$style.labelRow">
            <td :class="$style.labelCell">{{ section.label }}</td>
          </tr>
          <tr v-for="entry in section.ships" :key="entry.ship.id" :class="$style.shipRow">
            <td :class="$style.shipCell">
              <!-- Tooltip disabled: it bled into the drag image. -->
              <div
                :class="$style.shipWrap"
                draggable="true"
                @dragstart="onDragStart($event, entry.ship.id)">
                <PrunButton primary :class="$style.shipButton">
                  <span :class="$style.shipLabel">{{ shipLabel(entry) }}</span>
                </PrunButton>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style module>
/* Share the cap with .shipLabel to keep long names inside the pool.
   Use px because the pool and label have different font sizes. */
.pool {
  --poolMaxWidth: 110px;
  width: max-content;
  min-width: 10ch;
  max-width: var(--poolMaxWidth);
  flex: 0 0 auto;
  border-left: 1px solid #2b485a;
  box-sizing: border-box;
}

.table {
  border-collapse: collapse;
  width: 100%;
}

.table thead tr {
  border-bottom: 1px solid #2b485a;
  box-sizing: border-box;
}

.table thead th {
  text-align: center;
}

.shipRow {
  height: 24px;
  box-sizing: border-box;
  border-bottom: 1px solid #2b485a;
}

.shipCell {
  padding: 3px 2px;
  height: 24px;
  box-sizing: border-box;
}

.shipWrap {
  width: 100%;
  height: 100%;
  cursor: grab;
}

/* Middle alignment removes baseline descender space that would enlarge the 24px row. */
.shipButton {
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  padding: 0 4px;
  font-size: 11px;
  pointer-events: none;
  vertical-align: middle;
  box-sizing: border-box;
}

/* Truncate inside the button to preserve padding and avoid clipped glyphs.
   Subtract 1px pool border + 4px cell padding + 8px button padding to stay within the pool cap. */
.shipLabel {
  display: block;
  width: 100%;
  max-width: calc(var(--poolMaxWidth) - 13px);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.labelRow {
  height: 24px;
  box-sizing: border-box;
  border-bottom: 1px solid #2b485a;
}

.labelCell {
  font-size: 11px;
  color: #888;
  text-align: center;
  padding: 0 4px;
  height: 24px;
  vertical-align: middle;
  box-sizing: border-box;
}
</style>

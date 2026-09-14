<script setup lang="ts">
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
  isStationLine,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import RadioItem from '@src/components/forms/RadioItem.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import InvBar from '@src/components/InvBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { planetContextMenu } from '@src/components/planet-context-menu/planet-context-menu';
import { useTileState } from './tile-state';
import fa from '@src/utils/font-awesome.module.css';

type InvType = 'BASE' | 'SHIP' | 'WAREHOUSE' | 'CX';

const TYPE_ORDER: Record<InvType, number> = { CX: 0, BASE: 1, SHIP: 2, WAREHOUSE: 3 };
const TYPE_LABELS: Record<InvType, string> = {
  BASE: 'BS',
  SHIP: 'SHP',
  WAREHOUSE: 'WAR',
  CX: 'CX',
};

interface InvRow {
  storeId: string;
  type: InvType;
  label: string;
  warehousePlanetId?: string;
  contextMenuId?: string;
  onClickCmd: string;
}

const showBase = useTileState('showBase');
const showShip = useTileState('showShip');
const showWarehouse = useTileState('showWarehouse');
const showCx = useTileState('showCx');
const showBaseWar = useTileState('showBaseWar');
const locationFilter = ref('');

const basePlanetIds = computed(() => {
  const sites = sitesStore.all.value;
  if (!sites) {
    return new Set<string>();
  }
  return new Set(
    sites
      .map(site => getEntityNaturalIdFromAddress(site.address))
      .filter((id): id is string => !!id),
  );
});

const allRows = computed<InvRow[] | undefined>(() => {
  const stores = storagesStore.nonFuelStores.value;
  const sites = sitesStore.all.value;
  const ships = shipsStore.all.value;
  const warehouses = warehousesStore.all.value;

  if (!stores || !sites || !ships || !warehouses) {
    return undefined;
  }

  const rows: InvRow[] = [];

  for (const store of stores) {
    if (store.type === 'STORE') {
      const site = sitesStore.getById(store.addressableId);
      if (!site) {
        continue;
      }
      const naturalId = getEntityNaturalIdFromAddress(site.address);
      if (!naturalId) {
        continue;
      }
      rows.push({
        storeId: store.id,
        type: 'BASE',
        label: getEntityNameFromAddress(site.address) ?? naturalId,
        contextMenuId: naturalId,
        onClickCmd: `INV ${store.id.substring(0, 8)}`,
      });
    } else if (store.type === 'SHIP_STORE') {
      const ship = shipsStore.getByStoreId(store.id);
      if (!ship) {
        continue;
      }
      rows.push({
        storeId: store.id,
        type: 'SHIP',
        label: ship.name || ship.registration,
        onClickCmd: `SHPI ${ship.registration}`,
      });
    } else if (store.type === 'WAREHOUSE_STORE') {
      const warehouse = warehouses.find(w => w.storeId === store.id);
      if (!warehouse) {
        continue;
      }
      const locationLine = getLocationLineFromAddress(warehouse.address);
      const isCx = isStationLine(locationLine);
      const naturalId = getEntityNaturalIdFromAddress(warehouse.address);
      const label = getEntityNameFromAddress(warehouse.address) ?? naturalId ?? 'Unknown';
      rows.push({
        storeId: store.id,
        type: isCx ? 'CX' : 'WAREHOUSE',
        label,
        warehousePlanetId: isCx ? undefined : naturalId,
        contextMenuId: isCx ? undefined : (naturalId ?? undefined),
        onClickCmd: `INV ${store.id.substring(0, 8)}`,
      });
    }
  }

  rows.sort((a, b) => {
    const typeOrder = TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
    if (typeOrder !== 0) {
      return typeOrder;
    }
    return a.label.localeCompare(b.label);
  });

  return rows;
});

const filteredRows = computed(() => {
  const rows = allRows.value;
  if (!rows) {
    return undefined;
  }

  const query = locationFilter.value.trim().toUpperCase();

  return rows.filter(row => {
    if (row.type === 'BASE' && !showBase.value) {
      return false;
    }
    if (row.type === 'SHIP' && !showShip.value) {
      return false;
    }
    if (row.type === 'WAREHOUSE' && !showWarehouse.value) {
      return false;
    }
    if (row.type === 'CX' && !showCx.value) {
      return false;
    }
    if (!showBaseWar.value && row.type === 'WAREHOUSE' && row.warehousePlanetId) {
      if (basePlanetIds.value.has(row.warehousePlanetId)) {
        return false;
      }
    }
    if (query && !row.label.toUpperCase().includes(query)) {
      return false;
    }
    return true;
  });
});
</script>

<template>
  <LoadingSpinner v-if="!filteredRows" />
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <RadioItem v-model="showCx" horizontal>CX</RadioItem>
      <RadioItem v-model="showBase" horizontal>BS</RadioItem>
      <RadioItem v-model="showShip" horizontal>SHP</RadioItem>
      <RadioItem v-model="showWarehouse" horizontal>WAR</RadioItem>
      <div :class="$style.separator" />
      <RadioItem v-model="showBaseWar" horizontal>BASE WAR</RadioItem>
      <div :class="$style.spacer" />
      <div :class="$style.searchContainer">
        Location:&nbsp;
        <TextInput v-model="locationFilter" :class="C.forms.input" />
        <PrunButton
          v-if="locationFilter"
          dark
          :class="[fa.solid, $style.clearButton]"
          @click="locationFilter = ''">
          {{ '\uf00d' }}
        </PrunButton>
      </div>
    </div>
    <table :class="$style.table">
      <thead>
        <tr>
          <th :class="$style.nameCol">Name</th>
          <th :class="$style.typeCol">Type</th>
          <th :class="$style.barCol">Inventory</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredRows" :key="row.storeId" :class="$style.row">
          <td
            :class="$style.nameCell"
            @contextmenu.prevent="
              row.contextMenuId && planetContextMenu.showMenu($event, row.contextMenuId)
            ">
            <span :class="$style.nameText" @click="showBuffer(row.onClickCmd)">
              {{ row.label }}
            </span>
          </td>
          <td :class="$style.typeCell">{{ TYPE_LABELS[row.type] }}</td>
          <td :class="$style.barCell">
            <InvBar :store-id="row.storeId" :on-click-cmd="row.onClickCmd" />
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module>
.separator {
  width: 1px;
  align-self: stretch;
  background-color: #2b485a;
  margin: 0 0.25rem;
}

.spacer {
  flex: 1;
}

.searchContainer {
  display: flex;
  align-items: center;
}

.clearButton {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2px;
  width: 18px;
  height: 18px;
  font-size: 11px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.nameCol {
  padding: 4px 6px;
}

.typeCol {
  width: 0;
  white-space: nowrap;
}

.barCol {
  min-width: 80px;
}

.row {
  border-bottom: 1px solid #2b485a;
}

.nameCell {
  width: 1px;
  padding: 4px 6px;
}

.nameText {
  display: block;
  max-width: 200px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.typeCell {
  padding: 4px 6px;
  font-size: 11px;
  opacity: 0.7;
  text-align: center;
  white-space: nowrap;
  width: 0;
}

.barCell {
  padding: 2px 2px 0;
}
</style>

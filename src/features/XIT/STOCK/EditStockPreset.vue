<script setup lang="ts">
import Header from '@src/components/Header.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Commands from '@src/components/forms/Commands.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import RenameStockPreset from '@src/features/XIT/STOCK/RenameStockPreset.vue';
import removeArrayElement from '@src/utils/remove-array-element';
import { objectId } from '@src/utils/object-id';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

const { preset } = defineProps<{ preset: UserData.StockPresetData }>();

function paramName(name: string) {
  return name.split(' ').join('_');
}

function resolvedPlanetName(planet: UserData.StockPlanetData) {
  const site = sitesStore.find(planet.planet);
  return site ? getEntityNameFromAddress(site.address) : undefined;
}

function planetTitle(planet: UserData.StockPlanetData) {
  return resolvedPlanetName(planet) ?? (planet.planet || 'New planet');
}

function isPlanetInvalid(planet: UserData.StockPlanetData) {
  return planet.planet.length > 0 && resolvedPlanetName(planet) === undefined;
}

function isTickerInvalid(item: UserData.StockItemData) {
  return (
    item.ticker.length > 0 && materialsStore.getByTicker(item.ticker.toUpperCase()) === undefined
  );
}

function onAddPlanetClick() {
  preset.planets.push({ planet: '', items: [] });
}

function onRemovePlanetClick(planet: UserData.StockPlanetData) {
  removeArrayElement(preset.planets, planet);
}

function onAddItemClick(planet: UserData.StockPlanetData) {
  planet.items.push({ ticker: '', max: 0 });
}

function onRemoveItemClick(planet: UserData.StockPlanetData, item: UserData.StockItemData) {
  removeArrayElement(planet.items, item);
}

function onRenameClick(ev: Event) {
  showTileOverlay(ev, RenameStockPreset, {
    name: preset.name,
    onRename: name => {
      preset.name = name;
      showBuffer(`XIT STOCK_EDIT_${paramName(name)}`);
    },
  });
}

function onOpenClick() {
  showBuffer(`XIT STOCK_${paramName(preset.name)}`);
}
</script>

<template>
  <Header :class="$style.header">{{ preset.name }}</Header>
  <template v-for="planet in preset.planets" :key="objectId(planet)">
    <SectionHeader>{{ planetTitle(planet) }}</SectionHeader>
    <form>
      <Active label="Planet" :error="isPlanetInvalid(planet)">
        <TextInput v-model="planet.planet" />
      </Active>
      <template v-for="(item, i) in planet.items" :key="objectId(item)">
        <Active :label="`Ticker #${i + 1}`" :error="isTickerInvalid(item)">
          <TextInput v-model="item.ticker" />
        </Active>
        <Active :label="`Max #${i + 1}`">
          <NumberInput v-model="item.max" />
        </Active>
        <Active :label="`Warehouse #${i + 1}`">
          <RadioItem v-model="item.warehouse" horizontal>Include warehouse</RadioItem>
        </Active>
        <Commands :label="`Item #${i + 1}`">
          <PrunButton dark @click="onRemoveItemClick(planet, item)">REMOVE ITEM</PrunButton>
        </Commands>
      </template>
      <Commands>
        <PrunButton primary @click="onAddItemClick(planet)">ADD ITEM</PrunButton>
        <PrunButton dark @click="onRemovePlanetClick(planet)">REMOVE PLANET</PrunButton>
      </Commands>
    </form>
  </template>
  <form :class="$style.sectionCommands">
    <Commands label="Planet">
      <PrunButton primary @click="onAddPlanetClick">ADD PLANET</PrunButton>
    </Commands>
  </form>
  <SectionHeader>Commands</SectionHeader>
  <form>
    <Commands label="Rename">
      <PrunButton primary @click="onRenameClick">RENAME</PrunButton>
    </Commands>
    <Commands label="Open">
      <PrunButton primary @click="onOpenClick">OPEN</PrunButton>
    </Commands>
  </form>
</template>

<style module>
.header {
  margin-left: 4px;
}

.sectionCommands {
  margin-top: 0.75rem;
}
</style>

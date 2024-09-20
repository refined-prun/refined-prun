<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import SET from '@src/features/XIT/SET/SET.vue';
import FIN from '@src/features/XIT/SET/FIN.vue';

xit.add({
  command: ['SET', 'SETTINGS'],
  name: 'REFINED PRUN SETTINGS',
  component: parameters => (parameters[1] === 'FIN' ? FIN : SET),
});
</script>

<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Tooltip from '@src/components/Tooltip.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Active from '@src/components/forms/Active.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import { showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import { initialUserData, resetAllData, userData } from '@src/store/user-data';
import { exportUserData, importUserData } from '@src/infrastructure/storage/user-data-serializer';
import { exportNotes, importNotes } from '@src/infrastructure/storage/notes-serializer';
import {
  exportFinancialHistory,
  importFinancialHistory,
} from '@src/infrastructure/storage/balance-serializer';

function addSidebarButton() {
  userData.settings.sidebar.push(['SET', 'XIT SET']);
}

function deleteSidebarButton(index: number) {
  userData.settings.sidebar.splice(index, 1);
}

function confirmResetSidebar(ev: Event) {
  showConfirmationOverlay(ev, () => {
    userData.settings.sidebar = [...initialUserData.settings.sidebar].map(x => [...x]);
  });
}

function confirmResetAllData(ev: Event) {
  showConfirmationOverlay(ev, resetAllData);
}
</script>

<template>
  <SectionHeader>Burn Settings</SectionHeader>
  <form>
    <Active
      label="Red"
      tooltip="Thresholds for red consumable level in burn calculations (in days)">
      <NumberInput v-model="userData.settings.burn.red" />
    </Active>
    <Active
      label="Yellow"
      tooltip="Thresholds for yellow consumable level in burn calculations (in days)">
      <NumberInput v-model="userData.settings.burn.yellow" />
    </Active>
    <Active label="Resupply" tooltip="TODO: Add a proper tooltip">
      <NumberInput v-model="userData.settings.burn.resupply" />
    </Active>
  </form>
  <SectionHeader>
    Left Sidebar Buttons
    <Tooltip
      :class="$style.tooltip"
      tooltip="Create hotkeys on the left sidebar.
         The first value is what will be displayed,
          the second is the command." />
  </SectionHeader>
  <form>
    <Active v-for="(button, i) in userData.settings.sidebar" :key="i" :label="`Button ${i + 1}`">
      <div :class="$style.sidebarInputPair">
        <TextInput v-model="button[0]" :class="$style.sidebarInput" />
        <TextInput v-model="button[1]" :class="$style.sidebarInput" />
        <PrunButton danger @click="deleteSidebarButton(i)">x</PrunButton>
      </div>
    </Active>
    <Commands>
      <PrunButton primary @click="confirmResetSidebar">RESET</PrunButton>
      <PrunButton primary @click="addSidebarButton">ADD NEW</PrunButton>
    </Commands>
  </form>
  <SectionHeader>Import/Export</SectionHeader>
  <form>
    <Commands>
      <PrunButton primary @click="importUserData">Import User Data</PrunButton>
      <PrunButton primary @click="exportUserData">Export User Data</PrunButton>
    </Commands>
    <Commands>
      <PrunButton primary @click="importFinancialHistory">Import Finances</PrunButton>
      <PrunButton primary @click="exportFinancialHistory">Export Finances</PrunButton>
    </Commands>
    <Commands>
      <PrunButton primary @click="importNotes">Import Notes</PrunButton>
      <PrunButton primary @click="exportNotes">Export Notes</PrunButton>
    </Commands>
  </form>
  <SectionHeader>Danger Zone</SectionHeader>
  <form>
    <Commands>
      <PrunButton danger @click="confirmResetAllData">Reset All Data</PrunButton>
    </Commands>
  </form>
</template>

<style module>
.tooltip {
  float: revert;
  font-size: 12px;
  margin-top: -4px;
}

.sidebarInputPair {
  display: flex;
  justify-content: flex-end;
  column-gap: 10px;
}

.sidebarInput {
  width: 40%;
}

.sidebarInput input {
  width: 100%;
}
</style>

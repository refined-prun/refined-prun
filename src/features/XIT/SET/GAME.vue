<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Tooltip from '@src/components/Tooltip.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Active from '@src/components/forms/Active.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import { showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import { initialUserData, userData } from '@src/store/user-data';
import {
  downloadBackup,
  exportUserData,
  importUserData,
  resetUserData,
  restoreBackup,
  saveUserData,
} from '@src/infrastructure/storage/user-data-serializer';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { objectId } from '@src/utils/object-id';
import {
  deleteUserDataBackup,
  getUserDataBackups,
  UserDataBackup,
} from '@src/infrastructure/storage/user-data-backup';
import { ddmmyyyy, hhForXitSet, hhmm } from '@src/utils/format';
import dayjs from 'dayjs';
import { vDraggable } from 'vue-draggable-plus';
import { useGrip } from '@src/components/grip/use-grip';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';
import GripCell from '@src/components/grip/GripCell.vue';
import GripChar from '@src/components/grip/GripChar.vue';
import grip from '@src/components/grip/grip.module.css';

const isDefault24 = computed(() => {
  return hhForXitSet.value(dayjs.duration(12, 'hours').asMilliseconds()) === '13';
});

const timeFormats = computed(() => {
  return [
    {
      label: isDefault24.value ? 'Default (24h)' : 'Default (12h)',
      value: 'DEFAULT',
    },
    {
      label: '24h',
      value: '24H',
    },
    {
      label: '12h',
      value: '12H',
    },
  ] as { label: string; value: UserData.TimeFormat }[];
});

const exchangeChartTypes: { label: string; value: UserData.ExchangeChartType }[] = [
  {
    label: 'Smooth',
    value: 'SMOOTH',
  },
  {
    label: 'Aligned',
    value: 'ALIGNED',
  },
  {
    label: 'Raw',
    value: 'RAW',
  },
];

const currencySettings = computed(() => userData.settings.currency);

const currencyPresets: { label: string; value: UserData.CurrencyPreset }[] = [
  {
    label: 'Default',
    value: 'DEFAULT',
  },
  {
    label: '₳',
    value: 'AIC',
  },
  {
    label: '₡',
    value: 'CIS',
  },
  {
    label: 'ǂ',
    value: 'ICA',
  },
  {
    label: '₦',
    value: 'NCC',
  },
  {
    label: 'Custom',
    value: 'CUSTOM',
  },
];

const currencyPosition: { label: string; value: UserData.CurrencyPosition }[] = [
  {
    label: 'After',
    value: 'AFTER',
  },
  {
    label: 'Before',
    value: 'BEFORE',
  },
];

const currencySpacing: { label: string; value: UserData.CurrencySpacing }[] = [
  {
    label: 'Has space',
    value: 'HAS_SPACE',
  },
  {
    label: 'No space',
    value: 'NO_SPACE',
  },
];

const backups = computed(() => getUserDataBackups());

function addSidebarButton() {
  userData.settings.sidebar.push(['SET', 'XIT SET']);
}

function deleteSidebarButton(index: number) {
  userData.settings.sidebar.splice(index, 1);
}

function confirmResetSidebar(ev: Event) {
  showConfirmationOverlay(ev, () => {
    userData.settings.sidebar = structuredClone(initialUserData.settings.sidebar);
  });
}

function importUserDataAndReload() {
  importUserData(async () => {
    await saveUserData();
    window.location.reload();
  });
}

async function restoreBackupAndReload(ev: Event, backup: UserDataBackup) {
  showConfirmationOverlay(
    ev,
    async () => {
      restoreBackup(backup);
      await saveUserData();
      window.location.reload();
    },
    {
      message:
        'Are you sure you want to restore this backup? This will overwrite your current data.',
    },
  );
}

function confirmDeleteBackup(ev: Event, backup: UserDataBackup) {
  showConfirmationOverlay(ev, () => deleteUserDataBackup(backup));
}

function confirmResetAllData(ev: Event) {
  showConfirmationOverlay(ev, async () => {
    resetUserData();
    await saveUserData();
    window.location.reload();
  });
}

const sidebarGrip = useGrip();
</script>

<template>
  <SectionHeader>Appearance</SectionHeader>
  <form>
    <Active label="Time format">
      <SelectInput v-model="userData.settings.time" :options="timeFormats" />
    </Active>
    <Active label="Default CX Chart Type">
      <SelectInput v-model="userData.settings.defaultChartType" :options="exchangeChartTypes" />
    </Active>
  </form>
  <SectionHeader>
    Currency Symbol
    <Tooltip
      :class="$style.tooltip"
      tooltip="Currency symbol used when displaying money values.
       Only shown in UI added by Refined PrUn." />
  </SectionHeader>
  <form>
    <Active label="Symbol">
      <SelectInput v-model="currencySettings.preset" :options="currencyPresets" />
    </Active>
    <Active v-if="currencySettings.preset === 'CUSTOM'" label="Custom symbol">
      <TextInput v-model="currencySettings.custom" />
    </Active>
    <Active v-if="currencySettings.preset !== 'DEFAULT'" label="Position">
      <SelectInput v-model="currencySettings.position" :options="currencyPosition" />
    </Active>
    <Active
      v-if="currencySettings.preset !== 'DEFAULT'"
      label="Spacing"
      tooltip="The space between symbol and value.">
      <SelectInput v-model="currencySettings.spacing" :options="currencySpacing" />
    </Active>
  </form>
  <SectionHeader>Burn Settings</SectionHeader>
  <form>
    <Active
      label="Red"
      tooltip="Threshold for red consumable level in burn calculations (in days).">
      <NumberInput v-model="userData.settings.burn.red" />
    </Active>
    <Active
      label="Yellow"
      tooltip="Threshold for yellow consumable level in burn calculations (in days).">
      <NumberInput v-model="userData.settings.burn.yellow" />
    </Active>
    <Active
      label="Resupply"
      tooltip="Target amount of supplied days for the 'Need' column in XIT BURN.">
      <NumberInput v-model="userData.settings.burn.resupply" />
    </Active>
  </form>
  <SectionHeader>
    Left Sidebar Buttons
    <Tooltip
      :class="$style.tooltip"
      tooltip="Create hotkeys on the left sidebar.
         The first value is what will be displayed, the second is the command." />
  </SectionHeader>
  <form
    v-draggable="[userData.settings.sidebar, sidebarGrip.draggable]"
    :class="sidebarGrip.rootClass">
    <Active
      v-for="(button, i) in userData.settings.sidebar"
      :key="objectId(button)"
      :label="`Button ${i + 1}`"
      :class="$style.sidebarRow">
      <div :class="$style.sidebarInputPair">
        <GripChar :class="[$style.grip, grip.grip]" />
        <TextInput v-model="button[0]" :class="$style.sidebarInput" />
        <TextInput v-model="button[1]" :class="$style.sidebarInput" />
        <PrunButton danger @click="deleteSidebarButton(i)">x</PrunButton>
      </div>
    </Active>
  </form>
  <form>
    <Commands>
      <PrunButton primary @click="confirmResetSidebar">RESET</PrunButton>
      <PrunButton primary @click="addSidebarButton">ADD NEW</PrunButton>
    </Commands>
  </form>
  <SectionHeader>Import/Export</SectionHeader>
  <form>
    <Commands>
      <PrunButton primary @click="importUserDataAndReload">Import User Data</PrunButton>
      <PrunButton primary @click="exportUserData">Export User Data</PrunButton>
    </Commands>
  </form>
  <template v-if="backups.length > 0">
    <SectionHeader>Backups</SectionHeader>
    <form>
      <Commands
        v-for="backup in backups"
        :key="backup.timestamp"
        :label="ddmmyyyy(backup.timestamp) + ' ' + hhmm(backup.timestamp)">
        <PrunButton primary @click="downloadBackup(backup.data, backup.timestamp)">
          Export
        </PrunButton>
        <PrunButton primary @click="restoreBackupAndReload($event, backup.data)">
          Restore
        </PrunButton>
        <PrunButton danger @click="confirmDeleteBackup($event, backup)">Delete</PrunButton>
      </Commands>
    </form>
  </template>
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

.grip {
  cursor: move;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}

.sidebarRow:hover .grip {
  opacity: 1;
}
</style>

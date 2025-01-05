<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunButton from '@src/components/PrunButton.vue';
import Commands from '@src/components/forms/Commands.vue';
import {
  importPmmgActions,
  importPmmgFinancialHistory,
  importPmmgNotes,
  importPmmgSettings,
  importPmmgCommandLists,
} from '@src/infrastructure/storage/pmmg-import';
</script>

<template>
  <SectionHeader>Import PMMG files</SectionHeader>
  <form>
    <Commands label="pmmg-settings.json">
      <PrunButton primary @click="importPmmgSettings">Import Settings</PrunButton>
    </Commands>
    <Commands label="pmmg-finance.json">
      <PrunButton primary @click="importPmmgFinancialHistory">Import Finances</PrunButton>
    </Commands>
    <Commands label="pmmg-notes.json">
      <PrunButton primary @click="importPmmgNotes">Import Notes</PrunButton>
    </Commands>
    <Commands label="pmmg-action.json">
      <PrunButton primary @click="importPmmgActions">Import Actions</PrunButton>
    </Commands>
    <Commands label="pmmg-lists.json">
      <PrunButton primary @click="importPmmgCommandLists">Import Command Lists</PrunButton>
    </Commands>
  </form>
</template>

<style scoped></style>

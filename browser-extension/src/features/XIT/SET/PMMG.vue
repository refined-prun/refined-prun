<script setup lang="ts">
import { importPmmgSettings } from '@src/infrastructure/storage/user-data-serializer';
import { importPmmgFinancialHistory } from '@src/infrastructure/storage/balance-serializer';
import { importPmmgNotes } from '@src/infrastructure/storage/notes-serializer';
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunButton from '@src/components/PrunButton.vue';
import Commands from '@src/components/forms/Commands.vue';
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
      <PrunButton primary disabled>Import Actions (Not Implemented)</PrunButton>
    </Commands>
    <Commands label="pmmg-lists.json">
      <PrunButton primary disabled>Import Lists (Not Implemented)</PrunButton>
    </Commands>
  </form>
</template>

<style scoped></style>

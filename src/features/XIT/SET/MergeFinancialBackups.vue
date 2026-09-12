<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunButton from '@src/components/PrunButton.vue';
import Commands from '@src/components/forms/Commands.vue';
import Active from '@src/components/forms/Active.vue';
import { uploadJson, downloadJson } from '@src/utils/json-file';
import { ddmmyyyy, hhmm } from '@src/utils/format';
import {
  BackupFile,
  mergeUserDataBackups,
  validateBackup,
} from '@src/infrastructure/storage/user-data-finmerge';

const backupA = shallowRef<BackupFile>();
const backupB = shallowRef<BackupFile>();

function uploadBackup(target: 'A' | 'B') {
  uploadJson(json => {
    if (!validateBackup(json)) {
      alert('Invalid backup file.');
      return;
    }
    if (target === 'A') {
      backupA.value = json;
    } else {
      backupB.value = json;
    }
  });
}

const merge = computed(() => {
  if (!backupA.value || !backupB.value) {
    return undefined;
  }
  return mergeUserDataBackups(backupA.value, backupB.value);
});

function formatTimestamp(timestamp: number) {
  return timestamp === 0 ? 'no data' : `${ddmmyyyy(timestamp)} ${hhmm(timestamp)}`;
}

function download() {
  if (!merge.value) {
    return;
  }
  downloadJson(merge.value.result, `rp-user-data-finmerge-${Date.now()}.json`);
}
</script>

<template>
  <SectionHeader>Merge Financial Backups</SectionHeader>
  <form>
    <Commands label="Backup A">
      <PrunButton
        primary
        data-tooltip="A backup is a user data file saved with Export User Data on the Gameplay tab in XIT SET."
        data-tooltip-position="left"
        @click="uploadBackup('A')">
        Upload
      </PrunButton>
    </Commands>
    <Commands label="Backup B">
      <PrunButton
        primary
        data-tooltip="A backup is a user data file saved with Export User Data on the Gameplay tab in XIT SET."
        data-tooltip-position="left"
        @click="uploadBackup('B')">
        Upload
      </PrunButton>
    </Commands>
  </form>
  <template v-if="merge">
    <SectionHeader>Report</SectionHeader>
    <form>
      <Active label="Base backup">{{ merge.report.base }}</Active>
      <Active label="Base latest day">{{ formatTimestamp(merge.report.baseLatest) }}</Active>
      <Active label="Other latest day">{{ formatTimestamp(merge.report.otherLatest) }}</Active>
      <Active label="Days added (v1)">
        {{
          merge.report.v1Mismatch
            ? `skipped, data length mismatch (${merge.report.v1Mismatch[0]} vs ${merge.report.v1Mismatch[1]})`
            : merge.report.v1DaysAdded
        }}
      </Active>
      <Active label="Days added (v2)">
        {{
          merge.report.v2Mismatch
            ? `skipped, data length mismatch (${merge.report.v2Mismatch[0]} vs ${merge.report.v2Mismatch[1]})`
            : merge.report.v2DaysAdded
        }}
      </Active>
    </form>
    <form>
      <Commands>
        <PrunButton primary @click="download">Download Merged Backup</PrunButton>
      </Commands>
    </form>
  </template>
</template>

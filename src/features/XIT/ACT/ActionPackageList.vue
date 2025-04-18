<script setup lang="ts">
import ActionBar from '@src/components/ActionBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { showConfirmationOverlay, showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateActionPackage from '@src/features/XIT/ACT/CreateActionPackage.vue';
import ImportActionPackage from '@src/features/XIT/ACT/ImportActionPackage.vue';
import Quickstart from '@src/features/XIT/ACT/Quickstart.vue';
import { userData } from '@src/store/user-data';
import PrunLink from '@src/components/PrunLink.vue';
import removeArrayElement from '@src/utils/remove-array-element';
import { objectId } from '@src/utils/object-id';

const showQuickstart = computed(() => userData.actionPackages.length === 0);

function onQuickstartClick(ev: Event) {
  showTileOverlay(ev, Quickstart);
}

function onCreateClick(ev: Event) {
  showTileOverlay(ev, CreateActionPackage, {
    onCreate: name => {
      userData.actionPackages.push({
        global: { name },
        groups: [],
        actions: [],
      });
      showBuffer('XIT ACT_EDIT_' + name.split(' ').join('_'));
    },
  });
}

function onImportClick(ev: Event) {
  showTileOverlay(ev, ImportActionPackage, {
    onImport: json => {
      const existing = userData.actionPackages.find(x => x.global.name === json.global.name);
      if (existing) {
        const index = userData.actionPackages.indexOf(existing);
        userData.actionPackages[index] = json;
      } else {
        userData.actionPackages.push(json);
      }
    },
  });
}

function onDeleteClick(ev: Event, pkg: UserData.ActionPackageData) {
  showConfirmationOverlay(ev, () => removeArrayElement(userData.actionPackages, pkg), {
    message: `Are you sure you want to delete the action package "${pkg.global.name}"?`,
    confirmLabel: 'DELETE',
  });
}

function friendlyName(pkg: UserData.ActionPackageData) {
  return pkg.global.name.split('_').join(' ');
}

function paramName(pkg: UserData.ActionPackageData) {
  return pkg.global.name.split(' ').join('_');
}
</script>

<template>
  <ActionBar>
    <div v-if="showQuickstart">Click here if you don't<br />know what to do!</div>
    <div v-if="showQuickstart">→</div>
    <PrunButton v-if="showQuickstart" primary @click="onQuickstartClick">QUICKSTART</PrunButton>
    <PrunButton primary @click="onCreateClick">CREATE NEW</PrunButton>
    <PrunButton primary @click="onImportClick">IMPORT</PrunButton>
  </ActionBar>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Execute</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody v-if="userData.actionPackages.length === 0">
      <tr>
        <td>No action packages.</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="pkg in userData.actionPackages" :key="objectId(pkg)">
        <td>
          <PrunLink :command="`XIT ACT_${paramName(pkg)}`">
            {{ friendlyName(pkg) }}
          </PrunLink>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT ACT_${paramName(pkg)}`)">
            EXECUTE
          </PrunButton>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT ACT_EDIT_${paramName(pkg)}`)">
            EDIT
          </PrunButton>
        </td>
        <td>
          <PrunButton dark inline @click="onDeleteClick($event, pkg)">delete</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

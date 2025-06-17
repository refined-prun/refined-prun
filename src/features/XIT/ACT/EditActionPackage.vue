<script setup lang="ts">
import Header from '@src/components/Header.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showConfirmationOverlay, showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import removeArrayElement from '@src/utils/remove-array-element';
import { objectId } from '@src/utils/object-id';
import { act } from '@src/features/XIT/ACT/act-registry';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import EditMaterialGroup from '@src/features/XIT/ACT/EditMaterialGroup.vue';
import EditAction from '@src/features/XIT/ACT/EditAction.vue';
import { downloadJson } from '@src/utils/json-file';
import { deepToRaw } from '@src/utils/deep-to-raw';

const { pkg } = defineProps<{ pkg: UserData.ActionPackageData }>();

function onAddMaterialGroupClick(e: Event) {
  const group: UserData.MaterialGroupData = {
    name: '',
    type: 'Resupply',
  };
  showTileOverlay(e, EditMaterialGroup, {
    add: true,
    group,
    onSave: () => pkg.groups.push(group),
  });
}

function onEditMaterialGroupClick(e: Event, group: UserData.MaterialGroupData) {
  showTileOverlay(e, EditMaterialGroup, { group });
}

function onDeleteMaterialGroupClick(e: Event, group: UserData.MaterialGroupData) {
  showConfirmationOverlay(e, () => removeArrayElement(pkg.groups, group), {
    message: `Are you sure you want to delete the material group "${group.name || '--'}"?`,
    confirmLabel: 'DELETE',
  });
}

function onAddActionClick(e: Event) {
  const action: UserData.ActionData = {
    name: '',
    type: 'MTRA',
  };
  showTileOverlay(e, EditAction, {
    add: true,
    action,
    pkg,
    onSave: () => pkg.actions.push(action),
  });
}

function onEditActionClick(e: Event, action: UserData.ActionData) {
  showTileOverlay(e, EditAction, { action, pkg });
}

function onDeleteActionClick(e: Event, action: UserData.ActionData) {
  showConfirmationOverlay(e, () => removeArrayElement(pkg.actions, action), {
    message: `Are you sure you want to delete the action "${action.name || '--'}"?`,
    confirmLabel: 'DELETE',
  });
}

function getMaterialGroupDescription(group: UserData.MaterialGroupData) {
  const info = act.getMaterialGroupInfo(group.type);
  return info ? info.description(group) : '--';
}

function getActionDescription(action: UserData.ActionData) {
  const info = act.getActionInfo(action.type);
  return info ? info.description(action) : '--';
}

function onExecuteClick() {
  showBuffer(`XIT ACT_${pkg.global.name.replace(' ', '_')}`);
}

function onExportClick() {
  const json = deepToRaw(pkg);
  downloadJson(json, `${pkg.global.name.replace(' ', '_')}-${Date.now()}.json`);
}
</script>

<template>
  <Header>{{ pkg.global.name }}</Header>
  <SectionHeader>Material Groups</SectionHeader>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Name</th>
        <th>Content</th>
        <th />
      </tr>
    </thead>
    <tbody v-if="pkg.groups.length === 0">
      <tr>
        <td colspan="4" :class="$style.emptyRow">No groups yet.</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="group in pkg.groups" :key="objectId(group)">
        <td>{{ group.type }}</td>
        <td>{{ group.name || '--' }}</td>
        <td>{{ getMaterialGroupDescription(group) }}</td>
        <td>
          <PrunButton dark inline @click="onEditMaterialGroupClick($event, group)">
            edit
          </PrunButton>
          <PrunButton dark inline @click="onDeleteMaterialGroupClick($event, group)">
            delete
          </PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
  <form :class="$style.sectionCommands">
    <Commands>
      <PrunButton primary @click="onAddMaterialGroupClick">ADD</PrunButton>
    </Commands>
  </form>
  <SectionHeader>Actions</SectionHeader>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Name</th>
        <th>Content</th>
        <th />
      </tr>
    </thead>
    <tbody v-if="pkg.actions.length === 0">
      <tr>
        <td colspan="4" :class="$style.emptyRow">No actions yet.</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="action in pkg.actions" :key="objectId(action)">
        <td>{{ action.type }}</td>
        <td>{{ action.name || '--' }}</td>
        <td>{{ getActionDescription(action) }}</td>
        <td>
          <PrunButton dark inline @click="onEditActionClick($event, action)">edit</PrunButton>
          <PrunButton dark inline @click="onDeleteActionClick($event, action)">delete</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
  <form :class="$style.sectionCommands">
    <Commands>
      <PrunButton primary @click="onAddActionClick">ADD</PrunButton>
    </Commands>
  </form>
  <SectionHeader>Commands</SectionHeader>
  <form>
    <Commands label="Execute">
      <PrunButton primary @click="onExecuteClick">EXECUTE</PrunButton>
    </Commands>
    <Commands label="Export">
      <PrunButton primary @click="onExportClick">EXPORT</PrunButton>
    </Commands>
    <Commands label="Help">
      <PrunButton primary @click="showBuffer('XIT HELP ACTION')">HELP</PrunButton>
    </Commands>
  </form>
</template>

<style module>
.emptyRow {
  text-align: center;
}

.sectionCommands {
  margin-top: 0.75rem;
}
</style>

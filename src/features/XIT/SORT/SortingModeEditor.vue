<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { objectId } from '@src/utils/object-id';

const { onSave, sorting, storeId } = defineProps<{
  onSave: (sorting: UserData.SortingMode) => void;
  sorting?: UserData.SortingMode;
  storeId: string;
}>();

const storage = computed(() => storagesStore.getById(storeId));

const label = ref(sorting?.label ?? '');
const categories = ref(
  sorting?.categories.map(x => ({ name: x.name, materials: x.materials.join(', ') })) ?? [
    createCategory(),
  ],
);
const burn = ref(sorting?.burn ?? false);
const zero = ref(sorting?.zero ?? false);

const canRemoveCategory = computed(() => categories.value.length > 1);

function addCategory() {
  categories.value.push(createCategory());
}

function removeCategory() {
  if (canRemoveCategory.value) {
    categories.value.pop();
  }
}

function createCategory() {
  return { name: '', materials: '' };
}

const emit = defineEmits<{ (e: 'close'): void }>();

function onSaveClick() {
  if (!label.value) {
    return;
  }
  onSave({
    label: label.value,
    storeId: storeId,
    categories: categories.value.map(x => ({
      name: x.name,
      materials: x.materials.replaceAll(' ', '').split(','),
    })),
    burn: burn.value,
    zero: zero.value,
  });
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>Sorting Mode</SectionHeader>
    <form>
      <Active
        label="Label"
        tooltip="The label showing at the top of the inventory (ABC, CAT, etc.).">
        <TextInput v-model="label" style="width: 80%" />
      </Active>
      <Active label="Category 1 Name" tooltip="The name of the first category for materials.">
        <TextInput v-model="categories[0].name" style="width: 80%" />
      </Active>
      <Active
        label="Category 1 MATs"
        tooltip="A list of materials in the first category. Separate tickers by a comma. (RAT, DW, etc.).">
        <TextInput v-model="categories[0].materials" style="width: 80%" />
      </Active>
      <template v-for="(category, i) in categories.slice(1)" :key="objectId(category)">
        <Active :label="`Category ${i + 2} Name`">
          <TextInput v-model="category.name" style="width: 80%" />
        </Active>
        <Active :label="`Category ${i + 2} MATs`">
          <TextInput v-model="category.materials" style="width: 80%" />
        </Active>
      </template>
      <Active
        v-if="storage?.type === 'STORE'"
        label="Burn Sorting"
        tooltip="Add burn sorting as a secondary sorting method. Burn categories will show under the categories defined above.">
        <RadioItem v-model="burn">add burn</RadioItem>
      </Active>
      <Active label="Show Zeros" tooltip="Show item icons that have zero quantity.">
        <RadioItem v-model="zero">show zero</RadioItem>
      </Active>
      <Commands>
        <PrunButton primary @click="addCategory">ADD CATEGORY</PrunButton>
        <PrunButton
          :primary="canRemoveCategory"
          :disabled="!canRemoveCategory"
          @click="removeCategory">
          REMOVE CATEGORY
        </PrunButton>
        <PrunButton primary @click="onSaveClick">SAVE</PrunButton>
      </Commands>
    </form>
  </div>
</template>

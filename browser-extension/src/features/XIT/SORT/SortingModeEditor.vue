<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { computed, PropType, ref } from 'vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
  onSave: {
    type: Function as PropType<(sortingMode: UserData.SortingMode) => void>,
    required: true,
  },
  sortingMode: {
    type: Object as PropType<UserData.SortingMode | undefined>,
    default: undefined,
  },
});

const storage = computed(() => storagesStore.getById(props.storeId));

const sortingMode = props.sortingMode;
const label = ref(sortingMode?.label ?? '');
const categories = ref(
  sortingMode?.categories.map(x => ({ name: x.name, materials: x.materials.join(', ') })) ?? [
    createCategory(),
  ],
);
const burn = ref(sortingMode?.burn ?? false);
const zero = ref(sortingMode?.zero ?? false);

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
  props.onSave({
    label: label.value,
    storeId: props.storeId,
    categories: categories.value.map(x => ({
      name: x.name,
      materials: x.materials.replace(' ', '').split(','),
    })),
    burn: burn.value,
    zero: zero.value,
  });
  emit('close');
}
</script>

<template>
  <div :class="PrunCss.DraftConditionEditor.form">
    <SectionHeader>Sorting Mode</SectionHeader>
    <form>
      <Active
        label="Label"
        tooltip="The label showing at the top of the inventory (ABC, CAT, etc.)">
        <TextInput v-model="label" style="width: 80%" />
      </Active>
      <Active label="Category 1 Name" tooltip="The name of the first category for materials">
        <TextInput v-model="categories[0].name" style="width: 80%" />
      </Active>
      <Active
        label="Category 1 MATs"
        tooltip="A list of materials in the first category. Separate tickers by a comma. (RAT, DW, etc.)">
        <TextInput v-model="categories[0].materials" style="width: 80%" />
      </Active>
      <template v-for="(category, i) in categories.slice(1)" :key="i">
        <Active :label="`Category ${i + 1} Name`">
          <TextInput v-model="category.name" style="width: 80%" />
        </Active>
        <Active :label="`Category ${i + 1} MATs`">
          <TextInput v-model="category.materials" style="width: 80%" />
        </Active>
      </template>
      <Active
        v-if="storage?.type === 'STORE'"
        label="Burn Sorting"
        tooltip="Add burn sorting as a secondary sorting method. Burn categories will show under the categories defined above.">
        <RadioItem v-model="burn">add burn</RadioItem>
      </Active>
      <Active label="Show Zeros" tooltip="Show item icons that have zero quantity">
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

<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import Tooltip from '@src/components/Tooltip.vue';
import { PropType, ref } from 'vue';

const props = defineProps({
  onCreate: {
    type: Function as PropType<(name: string) => void>,
    required: true,
  },
});

const emit = defineEmits<{ (e: 'close'): void }>();

const name = ref('');

function onCreateClick() {
  if (name.value.length === 0) {
    return;
  }
  props.onCreate(name.value);
  emit('close');
}
</script>

<template>
  <div :class="PrunCss.DraftConditionEditor.form">
    <div :class="[PrunCss.SectionHeader.container, PrunCss.fonts.fontRegular]">New Note</div>
    <form>
      <div
        :class="[
          PrunCss.FormComponent.containerActive,
          PrunCss.forms.active,
          PrunCss.forms.formComponent,
        ]">
        <label
          :class="[
            PrunCss.FormComponent.label,
            PrunCss.fonts.fontRegular,
            PrunCss.type.typeRegular,
          ]">
          <span>Note Name</span>
          <Tooltip
            position="right"
            tooltip="The name of the note. The command to access will be XIT NOTE_{name}" />
        </label>
        <div :class="[PrunCss.FormComponent.input, PrunCss.forms.input]">
          <div :class="[PrunCss.DynamicInput.dynamic, PrunCss.forms.dynamic]">
            <div>
              <input
                v-model="name"
                type="text"
                autocomplete="off"
                data-1p-ignore="true"
                data-lpignore="true" />
            </div>
          </div>
        </div>
      </div>
      <div
        :class="[
          PrunCss.FormComponent.containerCommand,
          PrunCss.forms.cmd,
          PrunCss.forms.formComponent,
        ]">
        <label
          :class="[
            PrunCss.FormComponent.label,
            PrunCss.fonts.fontRegular,
            PrunCss.type.typeRegular,
          ]">
          <span>CMD</span>
        </label>
        <div :class="[PrunCss.FormComponent.input, PrunCss.forms.input]">
          <button :class="[PrunCss.Button.primary, PrunCss.Button.btn]" @click="onCreateClick">
            <span>Create</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

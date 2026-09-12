<script setup lang="ts">
import { ComponentPublicInstance } from 'vue';
import PrunButton from '@src/components/PrunButton.vue';
import { clamp } from '@src/utils/clamp';
import { MaterialEntry } from './parsers';
import { DraggedStack, QuickAmount, getDraggedStacks, quickAmounts } from './drag';
import { parseDisplayedInteger } from './numbers';

const materials = defineModel<MaterialEntry[]>({ required: true });

const dragHover = ref<DraggedStack[] | undefined>();

// AMT opens a local prompt, prefilled with the stack quantity.
const amountPrompt = ref<DraggedStack | undefined>();
const promptAmount = ref('');

// Focus only when the prompt opens.
let promptNeedsFocus = false;
let dragDepth = 0;
const hoveredOption = ref<number | undefined>();

// Block the game's dragover handler from resetting dropEffect to none.
const acceptDrag = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy';
  }
};

const onZoneDragEnter = (e: DragEvent) => {
  acceptDrag(e);
  dragDepth++;
  // A new drag supersedes any amount prompt still open from the last drop.
  amountPrompt.value = undefined;
  if (!dragHover.value) {
    const stacks = getDraggedStacks();
    dragHover.value = stacks.length > 0 ? stacks : undefined;
  }
};

const onZoneDragOver = (e: DragEvent) => acceptDrag(e);

const onZoneDragLeave = (e: DragEvent) => {
  e.preventDefault();
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) {
    dragHover.value = undefined;
    hoveredOption.value = undefined;
  }
};

const onZoneDrop = (e: DragEvent) => {
  e.preventDefault();
  dragDepth = 0;
  dragHover.value = undefined;
  hoveredOption.value = undefined;
};

// Dragover tracks the current quantity choice.
const onOptionDragOver = (e: DragEvent, index: number) => {
  acceptDrag(e);
  hoveredOption.value = index;
};

const onOptionDrop = (e: DragEvent, option: QuickAmount) => {
  e.preventDefault();
  e.stopPropagation();
  dragDepth = 0;
  const stacks = dragHover.value;
  dragHover.value = undefined;
  hoveredOption.value = undefined;
  if (!stacks) {
    return;
  }
  if (option.prompt) {
    amountPrompt.value = stacks[0];
    promptAmount.value = String(stacks[0].quantity);
    promptNeedsFocus = true;
    return;
  }
  for (const stack of stacks) {
    const amount = option.resolve(stack);
    if (amount >= 1) {
      materials.value.push({ ticker: stack.ticker, amount });
    }
  }
};

const confirmPrompt = () => {
  const stack = amountPrompt.value;
  if (!stack) {
    return;
  }
  const typed = parseDisplayedInteger(promptAmount.value);
  if (typed === undefined) {
    return;
  }
  const amount = clamp(typed, 1, stack.quantity);
  materials.value.push({ ticker: stack.ticker, amount });
  amountPrompt.value = undefined;
};

const onPromptKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Enter' && e.key !== 'Escape') {
    return;
  }
  // Keep Enter/Escape away from the game's own document-level handlers.
  e.stopPropagation();
  if (e.key === 'Enter') {
    confirmPrompt();
  } else {
    amountPrompt.value = undefined;
  }
};

const focusPrompt = (el: Element | ComponentPublicInstance | null) => {
  if (!promptNeedsFocus || el === null) {
    return;
  }
  promptNeedsFocus = false;
  const input = el as HTMLInputElement;
  // Wait for the game's drag-end focus handling.
  setTimeout(() => {
    input.focus();
    input.select();
  });
};
</script>

<template>
  <div
    :class="[$style.dropZone, dragHover && $style.dropZoneHover]"
    @dragenter="onZoneDragEnter"
    @dragover="onZoneDragOver"
    @dragleave="onZoneDragLeave"
    @drop="onZoneDrop">
    <div v-if="materials.length === 0 && !dragHover && !amountPrompt" :class="$style.dropZoneHint">
      Drag a material stack here from another inventory
    </div>
    <div v-for="(material, index) in materials" :key="index" :class="$style.materialRow">
      <span :class="[$style.materialTicker, C.type.typeSmall]">{{ material.ticker }}</span>
      <input
        type="number"
        :class="$style.amountInput"
        :value="material.amount"
        @input="material.amount = Number(($event.target as HTMLInputElement).value)" />
      <PrunButton dark inline @click="materials.splice(index, 1)">x</PrunButton>
    </div>
    <div v-if="amountPrompt" :class="$style.materialRow">
      <span :class="[$style.materialTicker, C.type.typeSmall]">{{ amountPrompt.ticker }}</span>
      <input
        :ref="focusPrompt"
        v-model="promptAmount"
        type="text"
        inputmode="numeric"
        :class="$style.amountInput"
        @keydown="onPromptKeydown" />
      <PrunButton dark inline @click="confirmPrompt">add</PrunButton>
      <PrunButton dark inline @click="amountPrompt = undefined">x</PrunButton>
    </div>
    <div v-if="dragHover" :class="$style.dropOverlay">
      <div :class="[$style.dropOverlayLabel, C.type.typeSmall]">
        {{ dragHover.map(x => x.ticker).join(', ') }}
      </div>
      <div
        v-for="(option, index) in quickAmounts(
          Math.max(...dragHover.map(x => x.quantity)),
          dragHover.length === 1,
        )"
        :key="option.label"
        :class="$style.overlayCell"
        @dragover="onOptionDragOver($event, index)"
        @drop="onOptionDrop($event, option)">
        <div
          :class="[
            C.DropTargetView.item,
            $style.overlaySquare,
            hoveredOption === index && C.DropTargetView.isOver,
          ]">
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.dropZone {
  min-height: 80px;
  width: 100%;
  position: relative;
  border: 1px dashed rgb(141, 100, 17);
  background: rgba(66, 54, 29, 0.4);
  padding: 4px;
}

.dropZoneHover {
  border-color: rgb(247, 166, 0);
}

/* Match the textarea placeholder font and color. */
.dropZoneHint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  text-align: center;
  font: 13.3333px monospace;
  color: rgb(136, 136, 136);
}

.materialRow {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
}

.materialTicker {
  width: 40px;
}

.amountInput {
  width: 80px;
  background: rgb(66, 54, 29);
  color: rgb(187, 187, 187);
  border: none;
  border-bottom: 1px solid rgb(141, 100, 17);
  font-family: monospace;
  padding: 1px 4px 2px;
}

.amountInput:focus {
  border-bottom-color: rgb(247, 166, 0);
  outline: none;
}

/* Wrap quantity choices into equal columns with centered squares. */
.dropOverlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
}

/* Keep the stack label above the quantity choices. */
.dropOverlayLabel {
  flex: 1 0 100%;
  text-align: center;
  color: rgb(136, 136, 136);
}

.overlayCell {
  flex: 1 1 auto;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlaySquare {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Handle drops on the whole cell, not just the square. */
  pointer-events: none;
}

/* Allow a second row of quantity choices in narrow buffers. */
@container (max-width: 360px) {
  .dropZone {
    min-height: 100px;
  }
}
</style>

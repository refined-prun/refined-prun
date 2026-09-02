<script setup lang="ts">
import { PriceSide, setFlowPriceOverride } from '@src/core/flow';
import { formatPrice } from '@src/features/XIT/FLOW/format';

const {
  ticker,
  side,
  price,
  override,
  tooltipPosition = 'bottom',
} = defineProps<{
  ticker: string;
  side: PriceSide;
  price: number | undefined;
  override: boolean;
  tooltipPosition?: 'top' | 'bottom';
}>();

const editing = ref(false);
const draft = ref('');
const input = useTemplateRef<HTMLInputElement>('input');

const text = computed(() =>
  price === undefined ? '--' : formatPrice(price) + (override ? '*' : ''),
);

const tooltip = computed(() =>
  override ? 'Override. Click to edit, clear to reset.' : 'Click to override.',
);

function startEditing() {
  if (editing.value) {
    return;
  }
  draft.value = override && price !== undefined ? price.toString() : '';
  editing.value = true;
  nextTick(() => input.value?.focus());
}

function commit() {
  if (!editing.value) {
    return;
  }
  editing.value = false;
  const value = draft.value.trim();
  if (value === '') {
    setFlowPriceOverride(ticker, side, undefined);
    return;
  }
  const parsed = Number(value);
  if (!isFinite(parsed) || parsed < 0) {
    return;
  }
  setFlowPriceOverride(ticker, side, parsed);
}

function cancel() {
  editing.value = false;
}
</script>

<template>
  <td :class="$style.cell" @click="startEditing">
    <span
      :class="{ [$style.text]: editing }"
      :data-tooltip="editing ? undefined : tooltip"
      :data-tooltip-position="tooltipPosition">
      {{ text }}
    </span>
    <div v-if="editing" :class="[C.forms.input, $style.input]">
      <div>
        <input
          ref="input"
          v-model="draft"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
          @keydown.enter="commit"
          @keydown.esc="cancel"
          @blur="commit" />
      </div>
    </div>
  </td>
</template>

<style module>
.cell {
  position: relative;
  cursor: pointer;
  white-space: nowrap;
}

/* The text keeps sizing the cell while the editor is open. */
.text {
  visibility: hidden;
}

/* Overlay the editor on the cell so opening it never changes the table layout. */
.input {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;

  & > div {
    display: flex;
    width: 100%;
  }

  & input {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    text-align: right;
  }
}
</style>

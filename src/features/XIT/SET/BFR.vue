<script setup lang="ts">
import ActionBar from '@src/components/ActionBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import { vDraggable } from 'vue-draggable-plus';
import TextInput from '@src/components/forms/TextInput.vue';
import { useGrip } from '@src/components/grip/use-grip';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';
import GripCell from '@src/components/grip/GripCell.vue';
import Tooltip from '@src/components/Tooltip.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import { objectId } from '@src/utils/object-id';
import InlineFlex from '@src/components/InlineFlex.vue';

const $style = useCssModule();

const picking = ref(false);

const overlay = useTemplateRef<HTMLElement>('overlay');

const pickedBuffer = ref(null as Element | null | undefined);

const overlayCursor = computed(() => (pickedBuffer.value ? 'pointer' : 'default'));

function onOverlayMouseMove(e: MouseEvent) {
  if (!picking.value) {
    return;
  }

  const lastPickedBuffer = pickedBuffer.value;
  pickedBuffer.value = getBufferUnderCursor(e);
  lastPickedBuffer?.classList.remove($style.highlight);
  pickedBuffer.value?.classList.add($style.highlight);
}

async function onOverlayMouseClick(e: MouseEvent) {
  const buffer = getBufferUnderCursor(e);
  pickedBuffer.value?.classList.remove($style.highlight);
  pickedBuffer.value = null;
  picking.value = false;
  if (!buffer) {
    return;
  }

  const cmd = await $(buffer, C.TileFrame.cmd);
  if (!cmd.textContent) {
    return;
  }

  const body = await $(buffer, C.Window.body);
  const width = parseInt(body.style.width.replace('px', ''), 10);
  const height = parseInt(body.style.height.replace('px', ''), 10);
  userData.settings.buffers.unshift([cmd.textContent, width, height]);
}

function getBufferUnderCursor(e: MouseEvent) {
  const element = getElementUnderCursor(e);
  if (!element) {
    return undefined;
  }
  const window = element.closest(`.${C.Window.window}`);
  if (!window) {
    return undefined;
  }

  const cmd = _$(window, C.TileFrame.cmd);
  if (!cmd) {
    return undefined;
  }

  return window;
}

function getElementUnderCursor(e: MouseEvent) {
  overlay.value!.style.pointerEvents = 'none';
  const element = document.elementFromPoint(e.clientX, e.clientY);
  overlay.value!.style.pointerEvents = 'all';
  return element;
}

function addNewRule() {
  userData.settings.buffers.unshift(['', 450, 300]);
}

function deleteRule(rule: [string, number, number]) {
  removeArrayElement(userData.settings.buffers, rule);
}

const grip = useGrip();
</script>

<template>
  <SectionHeader>
    Override Default Buffer Sizes
    <Tooltip
      position="bottom"
      :class="$style.tooltip"
      tooltip="The first matched rule will be used. If no rules match, the default buffer size will be used.
        You can reorganize the rules by dragging them up and down." />
  </SectionHeader>
  <ActionBar>
    <template v-if="picking">
      <PrunButton neutral>
        {{ pickedBuffer ? 'CLICK TO PICK THIS BUFFER' : 'CLICK ANYWHERE TO CANCEL' }}
      </PrunButton>
    </template>
    <template v-else>
      <PrunButton primary @click="picking = true">PICK BUFFER</PrunButton>
      <PrunButton primary @click="addNewRule">ADD NEW RULE</PrunButton>
    </template>
  </ActionBar>
  <table>
    <thead>
      <tr>
        <GripHeaderCell />
        <th />
        <th>
          <InlineFlex>
            Command
            <Tooltip
              position="right"
              tooltip="Can be a full command, a part of it, or a regular expression. Case-insensitive." />
          </InlineFlex>
        </th>
        <th>Width</th>
        <th>Height</th>
        <th />
      </tr>
    </thead>
    <tbody v-if="userData.settings.buffers.length === 0">
      <tr>
        <td colspan="5">Nothing here yet.</td>
      </tr>
    </tbody>
    <template v-else>
      <tbody v-draggable="[userData.settings.buffers, grip.draggable]" :class="grip.rootClass">
        <tr v-for="rule in userData.settings.buffers" :key="objectId(rule)">
          <GripCell />
          <td :class="$style.commandCell">
            <div :class="[C.forms.input, $style.inline]">
              <TextInput v-model="rule[0]" />
            </div>
          </td>
          <td :class="$style.sizeCell">
            <div :class="[C.forms.input, $style.inline]">
              <NumberInput v-model="rule[1]" />
            </div>
          </td>
          <td :class="$style.sizeCell">
            <div :class="[C.forms.input, $style.inline]">
              <NumberInput v-model="rule[2]" />
            </div>
          </td>
          <td>
            <PrunButton danger @click="deleteRule(rule)">DELETE</PrunButton>
          </td>
        </tr>
      </tbody>
    </template>
  </table>
  <Teleport to="body">
    <div
      v-if="picking"
      ref="overlay"
      :class="$style.overlay"
      :style="{ cursor: overlayCursor }"
      @click="onOverlayMouseClick"
      @mousemove="onOverlayMouseMove" />
  </Teleport>
</template>

<style module>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999999;
}

.highlight {
  z-index: 999998 !important;
}

.highlight:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(63, 162, 222, 0.3);
  z-index: 999998;
}

.inline {
  display: inline-block;
}

.commandCell * {
  width: 100%;
}

.sizeCell {
  width: 60px;

  input {
    width: 60px;
    text-align: left;
  }
}

.tooltip {
  float: revert;
  font-size: 12px;
  margin-top: -4px;
}
</style>

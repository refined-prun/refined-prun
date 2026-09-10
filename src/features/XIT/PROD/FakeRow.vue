<script setup lang="ts">
import IconCell from './IconCell.vue';
import BuildingIcon from '@src/components/BuildingIcon.vue';
import InlineFlex from '@src/components/InlineFlex.vue';
import Tooltip from '@src/components/Tooltip.vue';
import PrunButton from '@src/components/PrunButton.vue';

// Hidden row that forces consistent column widths across all tbody sections.
// Without this, columns shift when sections are collapsed/expanded because
// each tbody independently sizes its columns.
</script>

<template>
  <tbody :class="$style.fakeRow">
    <tr>
      <IconCell>
        <BuildingIcon size="inline-table" ticker="RIG" />
      </IconCell>
      <td>▶ INFO</td>
      <td>
        <InlineFlex>
          100%
          <Tooltip position="bottom" tooltip="" />
        </InlineFlex>
      </td>
      <td>00/00</td>
      <td>
        <div :class="$style.buttons">
          <PrunButton dark inline>CO</PrunButton>
          <PrunButton dark inline>Q</PrunButton>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<style module>
.fakeRow {
  visibility: collapse;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}
</style>

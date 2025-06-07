<script setup lang="ts">
import SelectCX from '@src/features/XIT/VAR/SelectCX.vue';
import SelectMAT from '@src/features/XIT/VAR/SelectMAT.vue';
import SelectBS from '@src/features/XIT/VAR/SelectBS.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { isEmpty } from 'ts-extras';

const parameters = useXitParameters();
const parameter = ref(parameters[0]?.toUpperCase());
</script>

<template>
  <div v-if="isEmpty(parameters)">
    Add a type to the end of this command (e.g. to select Commodity Exchanges use XIT VAR CX):
    <ul>
      <li><strong>CX</strong>: Commodity Exchanges</li>
      <li><strong>MAT</strong>: Materials</li>
      <li><strong>BS</strong>: Bases</li>
    </ul>
  </div>
  <SelectCX v-if="parameter == 'CX'" />
  <SelectMAT v-if="parameter == 'MAT'" />
  <SelectBS v-if="parameter == 'BS'" />
</template>

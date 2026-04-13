<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/actions/cx-buy/config';

const { config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const exchanges = ['AI1', 'CI1', 'IC1', 'NC1', 'CI2', 'NC2'];

config.exchange ??= exchanges[0];
</script>

<template>
  <form>
    <Active label="Exchange">
      <SelectInput v-model="config.exchange" :options="exchanges" />
    </Active>
  </form>
</template>

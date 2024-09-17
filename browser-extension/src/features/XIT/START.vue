<script lang="ts">
import xit from '@src/features/XIT/xit-registry';
import START from '@src/features/XIT/START.vue';

xit.add({
  command: 'START',
  name: 'PMMG INTRODUCTION',
  component: () => START,
});

export default {};
</script>

<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
</script>

<template>
  <div :class="$style.container">
    <h1 class="rp-XIT-title" :style="{ paddingLeft: '0' }">
      Thank you for using <s>PMMG Extended</s> Refined PrUn!
    </h1>
    <p>This is a short tutorial on how to get the most out of the extension.</p>
    <p>
      Details on what PMMG offers can be found here:&nbsp;
      <PrunLink inline href="https://sites.google.com/view/pmmgextended/home?authuser=0">
        PMMG Extended
      </PrunLink>
    </p>
    <p>
      You can find a list of all of the PMMG commands using&nbsp;
      <PrunLink inline command="XIT HELP" />
    </p>
    <p>
      PMMG&apos;s settings can be accessed using&nbsp;
      <PrunLink inline command="XIT SETTINGS" />
    </p>
    <p>
      To get PMMG to show you data about your space empire, you need to &apos;scan in&apos; your
      bases by refreshing the page, then opening each of your production lines. You can check how
      much data has been scanned in using the XIT HEALTH buffer.
    </p>
    <p>
      Once you have scanned in your data, one of the biggest PMMG features is in the XIT FIN buffer.
      It tracks your finances more accurately than the in game FIN buffer.
    </p>
    <p>Contact PiBoy314 in game or on Discord if you have questions.</p>
  </div>
</template>

<style module>
.container {
  font-size: 12px;
  padding-left: 4px;
}
</style>

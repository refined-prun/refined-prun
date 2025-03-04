<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { userData } from '@src/store/user-data';
import { store } from './market-contextmenu';

const exchanges: UserData.Exchange[] = ['AI1', 'CI1', 'CI2', 'IC1', 'NC1', 'NC2'];
const buttons: [string, string][] = [
  ['Info', 'CXP'],
  ['Chart', 'CXPC'],
  ['Orders', 'CXOB'],
  ['Trade', 'CXPO'],
  ['CXM', 'CXM'],
];
</script>

<template>
  <div id="market_contextmenu" :class="$style.contextMenu" :style="store.menuStyle">
    <div v-if="store.materialID">
      <div>
        <div :class="[C.Frame.toggle, $style.exchangeHover]">
          <span
            :class="[
              C.Frame.toggleLabel,
              C.type.typeRegular,
              C.fonts.fontRegular,
              $style.exchangeSelect,
            ]"
            >{{ userData.settings.contextMenuExchange }}</span
          >
          <span
            :class="[
              C.Frame.toggleLabel,
              C.type.typeRegular,
              C.fonts.fontRegular,
              $style.exchangeIcon,
            ]"
            >🞂</span
          >
          <div :class="[$style.exchangeList, $style.contextMenu]">
            <PrunButton
              v-for="exchange in exchanges"
              :key="exchange"
              :dark="userData.settings.contextMenuExchange !== exchange"
              :primary="userData.settings.contextMenuExchange === exchange"
              :class="$style.prunButton"
              @click="userData.settings.contextMenuExchange = exchange">
              {{ exchange }}
            </PrunButton>
          </div>
        </div>
      </div>
      <div>
        <PrunButton
          v-for="cmd in buttons"
          :key="cmd[1]"
          :dark="true"
          :class="$style.prunButton"
          @click="store.showBuffer(cmd[1])">
          {{ cmd[0] }}
        </PrunButton>
      </div>
    </div>
  </div>
</template>

<style module>
.exchangeHover:hover {
  .exchangeList {
    display: block;
  }
}

.exchangeHover {
  font-weight: normal;
}

.exchangeList {
  position: absolute;
  display: none;
  top: 0%;
  left: 100%;
}

.exchangeSelect {
  width: 3em;
  text-wrap: nowrap;
  display: flex;
  justify-content: center;
}

.exchangeIcon {
  padding-left: 0;
}

.market_contextmenu_divider {
  border-bottom: 2px solid currentColor;
}

.prunButton {
  display: block;
  margin-bottom: 0;
  margin-left: 0 !important;
  font-size: 10px;
  line-height: 11px;
  font-weight: bold;
  text-transform: none;
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 6px;
  padding-right: 6px;
  width: 100%;
}

.contextMenu {
  background: rgb(38, 38, 38);
  border: 2px solid rgb(196, 132, 0);
  border-radius: 4px;
  color: rgb(238, 238, 238);
  position: absolute;
  z-index: 99998;
}
</style>

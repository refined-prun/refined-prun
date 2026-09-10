<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import PrunButton from '@src/components/PrunButton.vue';
import { CSSProperties } from 'vue';

const { materialID, menuStyle, selectedExchange, onCommand, onExchangeChange } = defineProps<{
  materialID: string;
  menuStyle: CSSProperties;
  selectedExchange: UserData.Exchange;
  onCommand: (cmd: string) => void;
  onExchangeChange: (exchange: UserData.Exchange) => void;
}>();

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
  <div id="market_contextmenu" :class="$style.contextMenu" :style="menuStyle">
    <div v-if="materialID">
      <div>
        <PrunButton
          v-for="cmd in buttons"
          :key="cmd[1]"
          :dark="true"
          :class="$style.prunButton"
          @click="onCommand(cmd[1])">
          {{ cmd[0] }}
        </PrunButton>
      </div>
      <div>
        <div :class="[C.Frame.toggle, $style.exchangeHover]">
          <span
            :class="[
              C.Frame.toggleLabel,
              C.type.typeRegular,
              C.fonts.fontRegular,
              $style.exchangeSelect,
            ]">
            {{ selectedExchange }}
          </span>
          <span
            :class="[
              C.Frame.toggleLabel,
              C.type.typeRegular,
              C.fonts.fontRegular,
              $style.exchangeIcon,
              fa.solid,
            ]">
            {{ '\uf0da' }}
          </span>
          <div :class="[$style.exchangeList, $style.contextMenu]">
            <PrunButton
              v-for="exchange in exchanges"
              :key="exchange"
              :dark="selectedExchange !== exchange"
              :primary="selectedExchange === exchange"
              :class="$style.prunButton"
              @click="onExchangeChange(exchange)">
              {{ exchange }}
            </PrunButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.exchangeHover:hover {
  .exchangeList {
    display: block;
  }

  > span {
    color: #ddd;
  }
}

.exchangeHover {
  border-top: 1px solid rgb(196, 132, 0);
  margin-bottom: 0;
}

.exchangeHover span {
  font-size: 10px;
  line-height: 11px;
}

.exchangeList {
  position: absolute;
  display: none;
  top: 0;
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

.prunButton {
  display: block;
  margin-left: 0 !important;
  font-size: 10px;
  line-height: 11px;
  text-transform: none;
  padding: 1px 6px;
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

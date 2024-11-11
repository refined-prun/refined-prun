<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { ddmm, hhmm } from '@src/utils/format';
import { useXitParameters } from '@src/hooks/useXitParameters';

interface FioChatMessage {
  MessageTimestamp: number;
  MessageType: 'CHAT' | 'JOINED' | 'LEFT';
  UserName: string;
  MessageText: string;
}

const parameters = useXitParameters();
const parameter = parameters[0];

const isLoaded = ref(false);
const messages = ref([] as FioChatMessage[]);
watchEffect(() => {
  if (!parameter) {
    return;
  }
  fetch(`https://rest.fnar.net/chat/display/${parameter}`)
    .then(response => response.json())
    .then(data => {
      isLoaded.value = true;
      messages.value = data;
    });
});
</script>

<template>
  <div v-if="!parameter">Error! Not Enough Parameters!</div>
  <LoadingSpinner v-else-if="!isLoaded" />
  <div v-else :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }">
    <div class="title">{{ parameter }} Global Site Owners</div>
    <div v-for="(message, i) in messages" :key="i" :class="$style.line">
      <div>
        <div :class="$style.date">{{ ddmm(message.MessageTimestamp) }}</div>
        <div :class="$style.date" :style="{ color: '#999999' }">
          {{ hhmm(message.MessageTimestamp) }}
        </div>
      </div>
      <template v-if="message.MessageType === 'CHAT'">
        <div :class="$style.name">{{ message.UserName }}</div>
        <div :class="$style.message">{{ message.MessageText }}</div>
      </template>
      <template v-if="message.MessageType === 'JOINED'">
        <div :class="$style.name">{{ message.UserName }}</div>
        <div :class="$style.message" :style="{ fontStyle: 'italic' }">
          {{ message.UserName }} joined.
        </div>
      </template>
      <template v-if="message.MessageType === 'LEFT'">
        <div :class="$style.name" />
        <div :class="$style.message" :style="{ fontStyle: 'italic' }">
          {{ message.UserName }} left.
        </div>
      </template>
    </div>
  </div>
</template>

<style module>
.line {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(8em, 1fr) minmax(8em, 4fr) minmax(8em, 15fr);
  grid-column-gap: 1px;
  font-size: 11px;
  line-height: 1.1;
}

.date {
  color: #444444;
  display: inline-block;
  padding: 2px 5px;
  padding-right: 0px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
}

.name {
  display: inline-block;
  text-align: right;
  color: #999999;
  text-overflow: ellipsis;
  padding: 2px 5px;
  border-right: 1px solid #999999;
}

.message {
  display: inline-block;
  text-align: left;
  color: #bbbbbb;
  word-break: break-word;
  padding: 2px 5px;
}
</style>

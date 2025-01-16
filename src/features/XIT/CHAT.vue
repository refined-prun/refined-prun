<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { ddmm, hhmm } from '@src/utils/format';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { objectId } from '@src/utils/object-id';

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
    <div :class="$style.title">{{ parameter }} Global Site Owners</div>
    <div
      v-for="message in messages"
      :key="objectId(message)"
      :class="[C.Message.message, C.type.typeRegular, C.fonts.fontRegular]">
      <div :class="C.Message.timestamp">
        <div :class="C.Message.date">{{ ddmm(message.MessageTimestamp) }}</div>
        <div :class="C.Message.time" :style="{ color: '#999999' }">
          {{ hhmm(message.MessageTimestamp) }}
        </div>
      </div>
      <template v-if="message.MessageType === 'CHAT'">
        <div :class="C.Message.name">
          <div :class="[C.Sender.container, C.type.typeRegular, C.fonts.fontRegular]">
            <div :class="[C.Sender.name, $style.name]">
              {{ message.UserName }}
            </div>
          </div>
        </div>
        <div :class="C.Message.controlsAndText">
          <div :class="C.Message.text">
            {{ message.MessageText }}
          </div>
        </div>
      </template>
      <template v-if="message.MessageType === 'JOINED'">
        <div :class="C.Message.name" />
        <div :class="C.Message.controlsAndText">
          <div :class="[C.Message.text, C.Message.system]">{{ message.UserName }} joined.</div>
        </div>
      </template>
      <template v-if="message.MessageType === 'LEFT'">
        <div :class="C.Message.name" />
        <div :class="C.Message.controlsAndText">
          <div :class="[C.Message.text, C.Message.system]">{{ message.UserName }} left.</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style module>
.title {
  font-weight: bold;
  display: block;
  font-size: 16px;
  padding-left: 5px;
}

.name {
  cursor: text;
}
</style>

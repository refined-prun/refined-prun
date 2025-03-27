import $style from './hide-system-chat-messages.module.css';
import css from '@src/utils/css-utils.module.css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import SelectButton from '@src/features/advanced/hide-system-chat-messages/SelectButton.vue';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';

function onTileReady(tile: PrunTile) {
  const state = computed(() =>
    userData.systemMessages.find(x => x.chat.toUpperCase() === tile.fullCommand.toUpperCase()),
  );
  const hideJoined = computed(() => state.value?.hideJoined ?? true);
  const hideDeleted = computed(() => state.value?.hideDeleted ?? true);
  const hideTimestamp = computed(() => state.value?.hideTimestamp ?? true);

  function setState(set: (state: UserData.SystemMessages) => void) {
    let newState = state.value;
    if (!newState) {
      newState = {
        chat: tile.fullCommand,
        hideJoined: true,
        hideDeleted: true,
        hideTimestamp: true,
      };
    }
    set(newState);
    const shouldSave = !newState.hideJoined || !newState.hideDeleted || !newState.hideTimestamp;
    if (shouldSave && !state.value) {
      userData.systemMessages.push(newState);
    }
    if (!shouldSave && state.value) {
      removeArrayElement(userData.systemMessages, state.value);
    }
  }

  subscribe($$(tile.anchor, C.Channel.controls), controls => {
    createFragmentApp(
      SelectButton,
      reactive({
        label: 'hide joined',
        selected: hideJoined,
        set: (value: boolean) => setState(state => (state.hideJoined = value)),
      }),
    ).appendTo(controls);
    createFragmentApp(
      SelectButton,
      reactive({
        label: 'hide deleted',
        selected: hideDeleted,
        set: (value: boolean) => setState(state => (state.hideDeleted = value)),
      }),
    ).appendTo(controls);
    createFragmentApp(
      SelectButton,
      reactive({
        label: 'hide timestamps',
        selected: hideTimestamp,
        set: (value: boolean) => setState(state => (state.hideTimestamp = value)),
      }),
    ).appendTo(controls);
  });

  subscribe($$(tile.anchor, C.MessageList.messages), messages => {
    watchEffectWhileNodeAlive(messages, () => {
      messages.classList.toggle($style.hideJoined, hideJoined.value ?? false);
      messages.classList.toggle($style.hideDeleted, hideDeleted.value ?? false);
      messages.classList.toggle($style.hideTimestamp, hideTimestamp.value ?? false);
    });
    subscribe($$(messages, C.Message.message), processMessage);
  });
}

function processMessage(message: HTMLElement) {
  observeDescendantListChanged(message, () => {
    const system = _$(message, C.Message.system);
    const name = _$(message, C.Message.name);
    if (!system || !name) {
      return;
    }
    if (name.children.length > 0) {
      message.classList.add($style.deleted);
    } else {
      message.classList.add($style.joined);
    }
  });
  const timestamp = _$(message, C.Message.timestamp)!;
  timestamp.classList.add($style.timestamp);
}

function init() {
  tiles.observe(['COMG', 'COMP', 'COMU'], onTileReady);
  applyCssRule(`.${$style.hideJoined} .${$style.joined}`, css.hidden);
  applyCssRule(`.${$style.hideDeleted} .${$style.deleted}`, css.hidden);
  applyCssRule(`.${$style.hideTimestamp} .${$style.timestamp}`, css.hidden);
  applyCssRule(`.${$style.hideTimestamp} .${C.Message.message}`, $style.message);
  applyCssRule(`.${$style.hideTimestamp} .${C.Message.name}`, $style.messageName);
}

features.add(import.meta.url, init, 'Hides system messages in chats.');

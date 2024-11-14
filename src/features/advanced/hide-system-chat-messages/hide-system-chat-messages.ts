import classes from './hide-system-chat-messages.module.css';
import css from '@src/utils/css-utils.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import SelectButton from '@src/features/advanced/hide-system-chat-messages/SelectButton.vue';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';

function onTileReady(tile: PrunTile) {
  const state = computed(() =>
    userData.systemMessages.find(x => x.chat.toUpperCase() === tile.fullCommand.toUpperCase()),
  );
  const hideJoined = computed(() => state.value?.hideJoined ?? true);
  const hideDeleted = computed(() => state.value?.hideDeleted ?? true);

  function setState(set: (state: UserData.SystemMessages) => void) {
    let newState = state.value;
    if (!newState) {
      newState = {
        chat: tile.fullCommand,
        hideJoined: true,
        hideDeleted: true,
      };
    }
    set(newState);
    const shouldSave = !newState.hideJoined || !newState.hideDeleted;
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
  });

  subscribe($$(tile.anchor, C.MessageList.messages), messages => {
    watchEffectWhileNodeAlive(messages, () => {
      messages.classList.remove(classes.hideJoined, classes.hideDeleted);
      if (hideJoined.value) {
        messages.classList.add(classes.hideJoined);
      }
      if (hideDeleted.value) {
        messages.classList.add(classes.hideDeleted);
      }
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
      message.classList.add(classes.deleted);
    } else {
      message.classList.add(classes.joined);
    }
  });
}

function init() {
  tiles.observe(['COMG', 'COMP', 'COMU'], onTileReady);
  applyCssRule(`.${classes.hideJoined} .${classes.joined}`, css.hidden);
  applyCssRule(`.${classes.hideDeleted} .${classes.deleted}`, css.hidden);
}

features.add(import.meta.url, init, 'Hides system messages in chats.');

import $style from './chat-filters.module.css';
import css from '@src/utils/css-utils.module.css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import SelectButton from '@src/features/advanced/chat-filters/SelectButton.vue';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import TileControlsButton from '@src/components/TileControlsButton.vue';
import fa from '@src/utils/font-awesome.module.css';

function onTileReady(tile: PrunTile) {
  const state = computed(() =>
    userData.systemMessages.find(x => x.chat.toUpperCase() === tile.fullCommand.toUpperCase()),
  );
  const hideFilterBar = computed(() => state.value?.hideFilterBar ?? false);
  const hideJoined = computed(() => state.value?.hideJoined ?? false);
  const hideDeleted = computed(() => state.value?.hideDeleted ?? false);
  const hideTimestamp = computed(() => state.value?.hideTimestamp ?? false);

  function setState(set: (state: UserData.SystemMessages) => void) {
    let newState = state.value;
    if (!newState) {
      newState = {
        chat: tile.fullCommand,
        hideFilterBar: false,
        hideJoined: false,
        hideDeleted: false,
        hideTimestamp: false,
      };
    }
    set(newState);
    const shouldSave =
      newState.hideFilterBar ||
      newState.hideJoined ||
      newState.hideDeleted ||
      newState.hideTimestamp;
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
        label: 'joined',
        selected: hideJoined,
        set: (value: boolean) => setState(state => (state.hideJoined = value)),
      }),
    ).appendTo(controls);
    createFragmentApp(
      SelectButton,
      reactive({
        label: 'deleted',
        selected: hideDeleted,
        set: (value: boolean) => setState(state => (state.hideDeleted = value)),
      }),
    ).appendTo(controls);
    createFragmentApp(
      SelectButton,
      reactive({
        label: 'timestamps',
        selected: hideTimestamp,
        set: (value: boolean) => setState(state => (state.hideTimestamp = value)),
      }),
    ).appendTo(controls);

    const channelControls = _$(tile.frame, C.Channel.controls);
    watchEffect(() => {
      channelControls?.classList.toggle(css.hidden, hideFilterBar.value);
    });

    createFragmentApp(() => (
      <>
        <div style={{ flexGrow: '1' }} />
        <div
          class={[
            $style.channelControlsHideButton,
            C.ContextControls.item,
            C.fonts.fontRegular,
            C.type.typeSmall,
          ]}
          onClick={() => setState(state => (state.hideFilterBar = true))}>
          <i class={[fa.solid]}>{'\uf00d'}</i>
        </div>
      </>
    )).appendTo(controls);

    const tileControls = _$(tile.frame, C.TileFrame.controls)!;
    createFragmentApp(() =>
      hideFilterBar.value ? (
        <TileControlsButton
          icon={'\uf0b0'}
          marginTop={4}
          onClick={() => setState(state => (state.hideFilterBar = false))}
        />
      ) : null,
    ).before(tileControls.children[0]);
  });

  subscribe($$(tile.anchor, C.MessageList.messages), messages => {
    watchEffectWhileNodeAlive(messages, () => {
      messages.classList.toggle($style.hideJoined, hideJoined.value);
      messages.classList.toggle($style.hideDeleted, hideDeleted.value);
      messages.classList.toggle($style.hideTimestamp, hideTimestamp.value);
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

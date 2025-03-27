import $style from './align-chat-delete-button.module.css';

function init() {
  applyCssRule(`.${C.Message.controlsAndText}`, $style.container);
  applyCssRule(`.${C.Message.controls}`, $style.delete);
  applyCssRule(
    `.${C.Message.message}:has(.${C.Message.controlsAndText} .${C.Message.controls}) .${C.Sender.name}`,
    $style.username,
  );
}

features.add(
  import.meta.url,
  init,
  'Moves the "delete" button to prevent chat message layout shift.',
);

import classes from './align-chat-delete-button.module.css';

function init() {
  applyCssRule(`.${C.Message.controlsAndText}`, classes.container);
  applyCssRule(`.${C.Message.controls}`, classes.delete);
  applyCssRule(
    `.${C.Message.message}:has(.${C.Message.controlsAndText} .${C.Message.controls}) .${C.Sender.name}`,
    classes.username,
  );
}

features.add(
  import.meta.url,
  init,
  'Moves the "delete" button to prevent chat message layout shift.',
);

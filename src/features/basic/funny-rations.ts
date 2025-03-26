import classes from './funny-rations.module.css';
import css from '@src/utils/css-utils.module.css';

function applyFunny() {
  const today = new Date();
  if (today.getDate() === 1 && today.getMonth() === 3) {
    document.body.classList.add(classes.funny);
  } else {
    document.body.classList.remove(classes.funny);
  }
}

function init() {
  setInterval(applyFunny, 60000);

  applyCssRule(`.${classes.funny} .rp-ticker-RAT.${C.ColoredIcon.container}:before`, css.hidden);
  applyCssRule(`.${classes.funny} .rp-ticker-RAT .${C.ColoredIcon.label}`, css.hidden);
  applyCssRule(
    `.${classes.funny} .rp-ticker-RAT .${C.ColoredIcon.labelContainer}:after`,
    classes.rat,
  );
}

features.add(import.meta.url, init, "I've heard a squeak.");

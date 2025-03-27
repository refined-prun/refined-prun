import $style from './funny-rations.module.css';
import css from '@src/utils/css-utils.module.css';

function applyFunny() {
  const today = new Date();
  if (today.getDate() === 1 && today.getMonth() === 3) {
    document.body.classList.add($style.funny);
  } else {
    document.body.classList.remove($style.funny);
  }
}

function init() {
  setInterval(applyFunny, 60000);

  applyCssRule(`.${$style.funny} .rp-ticker-RAT.${C.ColoredIcon.container}:before`, css.hidden);
  applyCssRule(`.${$style.funny} .rp-ticker-RAT .${C.ColoredIcon.label}`, css.hidden);
  applyCssRule(
    `.${$style.funny} .rp-ticker-RAT .${C.ColoredIcon.labelContainer}:after`,
    $style.rat,
  );
}

features.add(import.meta.url, init, "I've heard a squeak.");

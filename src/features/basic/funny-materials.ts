import $style from './funny-materials.module.css';
import { timestampEachMinute } from '@src/utils/dayjs';

const isFunny = computed(() => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date(timestampEachMinute.value));
  const get = (type: string) => Number(parts.find(x => x.type === type)?.value);
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  // 22:00 to 22:00 LA covers the world okay-ish, and allows for a simultaneous launch across the globe.
  return (month === 3 && day === 31 && hour >= 22) || (month === 4 && day === 1 && hour < 22);
});

let checked = new WeakSet<Element>();

function maybeBoost(container: Element) {
  if (checked.has(container)) {
    return;
  }
  checked.add(container);
  if (Math.random() >= 0.01) {
    return;
  }
  void (async () => {
    const coloredIcon = await $(container, C.ColoredIcon.container);
    coloredIcon.classList.add('rp-icon-boost');
  })();
}

function unboost() {
  for (const container of _$$(document.body, C.ColoredIcon.container)) {
    container.classList.remove('rp-icon-boost');
  }
  checked = new WeakSet();
}

function init() {
  applyCssRule(`.rp-icon-boost.${C.ColoredIcon.container}`, $style.iconBoost);
  applyCssRule(`.rp-icon-boost.${C.ColoredIcon.container}:before`, $style.hideIcon);
  applyCssRule(`.rp-icon-boost .${C.ColoredIcon.label}:before`, $style.hideIcon);

  subscribe($$(document, C.MaterialIcon.container), container => {
    if (!isFunny.value) {
      return;
    }
    maybeBoost(container);
  });

  watch(isFunny, funny => {
    if (!funny) {
      unboost();
      return;
    }
    for (const container of _$$(document.body, C.MaterialIcon.container)) {
      maybeBoost(container);
    }
  });
}

features.add(import.meta.url, init, 'Improves material icon rendering.');

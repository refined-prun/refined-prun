import { refValue } from '@src/utils/reactive-dom';
import { fixed0, fixed01, fixed02 } from '@src/utils/format';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Leaderboard.leaderboardTypeSelect), () => {
    const selects = _$$(tile.anchor, 'select');
    const typeSelect = selects.find(select => select.name === 'type');
    const rangeSelect = selects.find(select => select.name === 'range');
    if (!typeSelect || !rangeSelect) {
      return;
    }
    const appliedType = ref(typeSelect.value);
    const buttons = _$$(tile.anchor, 'button');
    for (const button of buttons) {
      button.addEventListener('click', () => (appliedType.value = typeSelect.value));
    }
    const rangeValue = refValue(rangeSelect);
    const range = computed(() => {
      if (appliedType.value !== 'PRODUCTION') {
        return undefined;
      }
      return parseInt(rangeValue.value.replace('DAYS_', ''), 10);
    });
    subscribe($$(tile.anchor, 'table'), table => {
      subscribe($$(table, 'thead'), thead => {
        subscribe($$(thead, 'tr'), tr => {
          if (tr.children.length < 2) {
            return;
          }
          const th = document.createElement('th');
          th.textContent = 'Per Day';
          watchEffectWhileNodeAlive(tr, () => {
            if (appliedType.value === 'PRODUCTION') {
              tr.children[1].after(th);
            } else {
              th.remove();
            }
          });
        });
      });
      subscribe($$(table, 'tbody'), tbody => {
        subscribe($$(tbody, 'tr'), tr => {
          const scoreColumn = tr.children[1] as HTMLTableCellElement;
          const span = scoreColumn?.children[0] as HTMLSpanElement;
          if (span === undefined) {
            return;
          }

          if (range.value === undefined) {
            return;
          }

          const score = parseInt(span.textContent ?? '', 10);
          span.textContent = fixed0(score);
          const perDay = score / range.value;
          if (!isFinite(perDay)) {
            return;
          }
          const perDayColumn = document.createElement('td');
          perDayColumn.style.backgroundColor = scoreColumn.style.backgroundColor;
          scoreColumn.after(perDayColumn);
          const abs = Math.abs(perDay);
          perDayColumn.textContent =
            abs >= 1000 ? fixed0(abs) : abs >= 100 ? fixed01(abs) : fixed02(abs);
        });
      });
    });
  });
}

function init() {
  tiles.observe('LEAD', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'LEAD: Adds a "Per Day" column to the "Commodity Production" leaderboard.',
);

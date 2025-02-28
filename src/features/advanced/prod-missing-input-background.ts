import {
  applyScopedClassCssRule,
  applyScopedCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import classes from './prod-missing-input-background.module.css';

let cmdSpecifics = {};

async function onTileReady(tile: PrunTile) {
  const options = cmdSpecifics[tile.command];
  const errorWatch = await $(tile.anchor, options[1]);
  subscribe($$(errorWatch, options[2]), errorElement => {
    const errorContainer =
      options[0] === 3
        ? (errorElement.parentElement?.parentElement?.parentElement ?? null)
        : (errorElement.parentElement?.parentElement ?? null);
    if (errorContainer) {
      watchEffectWhileNodeAlive(errorElement, onCleanup => {
        errorContainer.classList.add(options[3]);
        onCleanup(() => {
          errorContainer.classList.remove(options[3]);
        });
      });
    }
  });
}

function init() {
  //Error '(intermediate value).SiteProductionLines is undefined' if cmdSpecifics is declared outside of init()
  cmdSpecifics = {
    PROD: [3, C.SiteProductionLines.column, C.OrderStatus.error, classes.orderSlotContainer],
    PRODQ: [2, C.ProductionQueue.table, C.OrderStatus.error, classes.productionQueue],
    PRODCO: [
      3,
      C.InputsOutputsView.inputMaterials,
      C.InputsOutputsView.amountMissing,
      classes.inputsOutputsViewAmountMissing,
    ],
  };
  applyScopedClassCssRule(['PROD', 'PRODQ'], C.OrderStatus.error, css.hidden);
  applyScopedCssRule('PRODQ', `.${classes.productionQueue} > td`, classes.productionQueueData);
  applyScopedCssRule(
    'PRODQ',
    `.${classes.productionQueue}:hover > td`,
    classes.productionQueueDataHover,
  );
  tiles.observe(['PROD', 'PRODQ', 'PRODCO'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'PROD: Replaces missing input label with red background coloring',
);

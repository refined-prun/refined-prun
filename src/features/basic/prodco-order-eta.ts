import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { observeChildListChanged } from '@src/utils/mutation-observer';

function onTileReady(tile: PrunTile) {
  const line = computed(() => productionStore.getById(tile.parameter)!);
  subscribe($$(tile.anchor, C.ProductionLine.form), form => {
    const template = ref<PrunApi.ProductionTemplate>();
    const templateField = form.children[5];
    const dropDownItem = _$(templateField, C.DropDownBox.currentItem)!;
    observeChildListChanged(dropDownItem, () => {
      // The ProductionLine.template element is re-created each time
      // a new template in the drop-down box is selected.
      const templateElement = _$(dropDownItem, C.ProductionLine.template);
      if (templateElement) {
        template.value = parseTemplate(line.value, templateElement);
      }
    });

    const orderSizeField = form.children[6];
    const orderSizeSlider = _$(orderSizeField, 'rc-slider-handle')!;
    const sliderValue = refAttributeValue(orderSizeSlider, 'aria-valuenow');
    const orderSize = computed(() => Number(sliderValue.value));
    const completion = computed(() => {
      if (!template.value) {
        return undefined;
      }
      return ` (${formatEta(Date.now(), calcCompletionDate(line.value, template.value, orderSize.value))})`;
    });

    const durationField = form.children[8];
    const durationLabel = _$(durationField, C.StaticInput.static)!;
    durationLabel.append(createReactiveSpan(durationLabel, completion));
  });
}

function parseTemplate(line: PrunApi.ProductionLine, templateElement: HTMLElement) {
  const inputs: [string, number][] = [];
  const outputs: [string, number][] = [];
  // The structure of the template element looks like this:
  // MaterialIcon[], ⇨, MaterialIcon[], duration
  // First, we grab all inputs, and then on ⇨ flip to grabbing outputs.
  let input = true;
  for (const materials of Array.from(templateElement.children)) {
    if (!materials.classList.contains(C.MaterialIcon.container)) {
      input = false;
      continue;
    }
    const ticker = _$(materials, C.ColoredIcon.label)?.textContent ?? '';
    const count = Number(_$(materials, C.MaterialIcon.indicator)?.textContent ?? 0);
    if (input) {
      inputs.push([ticker, count]);
    } else {
      outputs.push([ticker, count]);
    }
  }

  for (const template of line.productionTemplates) {
    const templateInputs = template.inputFactors;
    const templateOutputs = template.outputFactors;
    if (templateInputs.length !== inputs.length || templateOutputs.length !== outputs.length) {
      continue;
    }

    const inputsMatch = inputs.every(x => findFactor(templateInputs, x[0], x[1]));
    const outputsMatch = outputs.every(x => findFactor(templateOutputs, x[0], x[1]));
    if (inputsMatch && outputsMatch) {
      return template;
    }
  }
  return undefined;
}

function findFactor(factors: PrunApi.ProductionFactor[], ticker: string, factor: number) {
  return factors.find(x => x.material.ticker === ticker && x.factor === factor);
}

function calcCompletionDate(
  line: PrunApi.ProductionLine,
  template: PrunApi.ProductionTemplate,
  orderSize: number,
): number {
  const templateDuration = template.duration.millis * orderSize;
  if (line.orders.length < line.capacity) {
    return templateDuration;
  }

  const queue: number[] = [];
  for (const lineOrder of line.orders) {
    if (lineOrder.completion) {
      queue.push(lineOrder.completion.timestamp);
    } else if (queue.length < line.capacity) {
      queue.push(Date.now() + lineOrder.duration!.millis);
    } else {
      queue.sort();
      queue.push(queue.shift()! + lineOrder.duration!.millis);
    }
  }
  queue.sort();
  return queue.shift()! + templateDuration;
}

function init() {
  tiles.observe('PRODCO', onTileReady);
}

features.add(import.meta.url, init, 'PRODCO: Adds a finish ETA label to orders.');

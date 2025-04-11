import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  const line = computed(() => productionStore.getById(tile.parameter)!);
  subscribe($$(tile.anchor, C.ProductionLine.form), form => {
    const template = ref<PrunApi.ProductionTemplate>();
    const templateField = form.children[5];
    const dropDownItem = _$(templateField, C.DropDownBox.currentItem)!;
    // In some edge cases C.ProductionLine.template is not re-created
    // on template change. So, instead of using observeChildListChanged
    // on the dropDownItem, we'll watch its textContent, as it always
    // reflects the template change.
    const templateText = refTextContent(dropDownItem);
    watchEffectWhileNodeAlive(dropDownItem, () => {
      // Touch reactive value.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = templateText.value;
      // The ProductionLine.template element is re-created each time
      // a new template in the drop-down box is selected.
      const templateElement = _$(dropDownItem, C.ProductionLine.template);
      template.value = parseTemplate(line.value, templateElement);
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

function getMaterialsFromElements(elements: Element[] | undefined) {
  const result: [string, number][] = [];
  for (const material of elements ?? []) {
    const ticker = _$(material, C.ColoredIcon.label)?.textContent ?? '';
    const count = Number(_$(material, C.MaterialIcon.indicator)?.textContent ?? 0);
    result.push([ticker, count]);
  }
  return result;
}

function parseTemplate(line: PrunApi.ProductionLine, templateElement: HTMLElement | undefined) {
  if (!templateElement) {
    return undefined;
  }
  // The structure of the template element looks like this:
  // C.ProductionLine.inputs, ⇨, MaterialIcon[], duration.
  const inputMaterials = Array.from(_$(templateElement, C.ProductionLine.inputs)?.children ?? []);
  const inputs: [string, number][] = getMaterialsFromElements(inputMaterials);

  const templateElements = Array.from(templateElement.children);
  // Remove the inputs div, arrow div, and duration div to leave just outputs.
  const outputElements = templateElements.slice(2, -1);
  const outputs: [string, number][] = getMaterialsFromElements(outputElements);

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

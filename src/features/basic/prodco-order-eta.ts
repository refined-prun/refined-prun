import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';
import { createReactiveSpan } from '@src/utils/reactive-element';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ProductionLine.form), form => {
    const productionTemplateField = form.children[5];
    const durationField = form.children[8];

    const dropDownBoxItem = refTextContent(_$(productionTemplateField, C.DropDownBox.currentItem)!);
    const rcSlider = refAttributeValue(_$(form, 'rc-slider-handle')!, 'aria-valuenow');
    const line = computed(() => productionStore.getById(tile.parameter)!);
    let template: PrunApi.ProductionTemplate;

    function getCompletion(needTemplate: boolean = true) {
      if (needTemplate || !template) {
        template = getTemplateFromForm(line.value.productionTemplates, form)!;
      }
      return ` (${formatEta(Date.now(), calcCompletionDate(line.value, template, Number(rcSlider.value)))})`;
    }

    const completionText = ref(getCompletion());
    watch(dropDownBoxItem, () => {
      completionText.value = getCompletion();
    });
    watch(line, () => {
      completionText.value = getCompletion(false);
    });
    watch(rcSlider, () => {
      completionText.value = getCompletion(false);
    });

    const durationLabel = _$(durationField, C.StaticInput.static)!;
    durationLabel.append(createReactiveSpan(durationLabel, completionText));
  });
}

function getTemplateFromForm(templates: PrunApi.ProductionTemplate[], form: HTMLElement) {
  const template = _$(form, C.ProductionLine.template);
  const inputs: [string, number][] = [];
  const outputs: [string, number][] = [];
  // The structure of the template element looks like this:
  // MaterialIcon[], ⇨, MaterialIcon[], duration
  // First, we grab all inputs, and then on ⇨ flip to grabbing outputs.
  let input = true;
  for (const materials of Array.from(template!.children)) {
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

  for (const template of templates) {
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

import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';
import { createReactiveDiv } from '@src/utils/reactive-element';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.ProductionLine.form), form => {
    const staticInputDuration = form.children[8].children[1].children[0];
    const staticInputTime = refTextContent(staticInputDuration.children[0]);
    const rcSlider = refAttributeValue(_$(form, 'rc-slider-handle')!, 'aria-valuenow');
    const line = computed(() =>
      productionStore.all.value?.find(line => line.id.substring(0, 8) === tile.parameter),
    );

    function getCompletion() {
      if (!line.value) return '';
      const template = getTemplateFromForm(line.value.productionTemplates, form);
      if (!template) return '';
      const orderSize = Number(rcSlider.value);
      const completion = calcCompletionDate(line.value, template, orderSize);
      return `(${formatEta(Date.now(), completion)})`;
    }

    const completionText = ref(getCompletion());
    watch(staticInputTime, () => (completionText.value = getCompletion()));
    watch(line, () => (completionText.value = getCompletion()));
    staticInputDuration.append(createReactiveDiv(staticInputDuration, completionText));
  });
}

function getTemplateFromForm(templates: PrunApi.ProductionTemplate[], form: HTMLElement) {
  const template = _$(form, C.ProductionLine.template);
  const inputs: [string, number][] = [];
  const outputs: [string, number][] = [];
  let input = true;
  Array.from(template!.children).forEach(mat => {
    if (!mat.classList.contains(C.MaterialIcon.container)) {
      input = false;
      return;
    }
    const indicator = Number(_$(mat, C.MaterialIcon.indicator)!.textContent ?? 0);
    const ticker = _$(mat, C.ColoredIcon.label)!.textContent ?? '';
    if (input) {
      inputs.push([ticker, indicator]);
    } else {
      outputs.push([ticker, indicator]);
    }
  });

  for (const template of templates) {
    if (
      template.inputFactors.length !== inputs.length ||
      template.outputFactors.length !== outputs.length
    )
      continue;

    const allInputsMatch = template.inputFactors.every(inputT =>
      inputs.some(input => input[0] === inputT.material.ticker && input[1] === inputT.factor),
    );
    if (!allInputsMatch) continue;

    const allOutputsMatch = template.outputFactors.every(outputT =>
      outputs.some(output => output[0] === outputT.material.ticker && output[1] === outputT.factor),
    );
    if (allOutputsMatch) return template;
  }
  return undefined;
}

function calcCompletionDate(
  line: PrunApi.ProductionLine,
  template: PrunApi.ProductionTemplate,
  orderSize: number,
): number {
  const templateDuration = template.duration.millis * orderSize;
  if (line.orders.length < line.capacity) return templateDuration;

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

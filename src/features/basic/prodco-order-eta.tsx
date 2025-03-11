import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';
import { createReactiveDiv } from '@src/utils/reactive-element';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.ProductionLine.form), form => {
    const staticInput = form.children[8].children[1].children[0];
    if (!staticInput) return;
    const staticInputTime = refTextContent(staticInput.children[0]);
    if (!staticInputTime) return;
    const rcSlider = refAttributeValue(
      form.children[6].children[1].children[0].children[0].children[0].children[3],
      'aria-valuenow',
    );
    if (!rcSlider) return;
    const line = computed(() =>
      productionStore.all.value?.find(line => line.id.substring(0, 8) === tile.parameter),
    );
    if (!line.value) return;

    function getCompletion() {
      if (!line.value) return '';
      const template = getTemplateFromForm(line.value.productionTemplates, form);
      if (!template) return '';
      const orderSize = Number(rcSlider.value);
      if (!orderSize) return '';
      const completion = calcCompletionDate(line.value, template, orderSize);
      if (!completion) return '';
      return `(${formatEta(Date.now(), completion)})`;
    }

    const completionText = ref(getCompletion());
    watch(staticInputTime, () => (completionText.value = getCompletion()));
    watch(line, () => (completionText.value = getCompletion()));
    staticInput.append(createReactiveDiv(staticInput, completionText));
  });
}

function getTemplateFromForm(templates: PrunApi.ProductionTemplate[], form: HTMLElement) {
  const template = _$(form, C.ProductionLine.template);
  if (!template) return undefined;
  const inputs: string[] = [];
  const outputs: string[] = [];
  let input = true;
  Array.from(template.children).forEach(mat => {
    if (!mat.classList.contains(C.MaterialIcon.container)) {
      input = false;
      return;
    }
    const ticker = _$(mat, C.ColoredIcon.label)!.textContent;
    if (!ticker) return;
    if (input) {
      inputs.push(ticker);
    } else {
      outputs.push(ticker);
    }
  });

  for (const template of templates) {
    if (
      template.inputFactors.length !== inputs.length ||
      template.outputFactors.length !== outputs.length
    )
      continue;

    const allInputsMatch = template.inputFactors.every(input =>
      inputs.includes(input.material.ticker),
    );
    if (!allInputsMatch) continue;

    const allOutputsMatch = template.outputFactors.every(output =>
      outputs.includes(output.material.ticker),
    );
    if (allOutputsMatch) return template;
  }
  return undefined;
}

function calcCompletionDate(
  line: PrunApi.ProductionLine,
  template: PrunApi.ProductionTemplate,
  orderSize: number,
) {
  if (line.capacity === 0) return undefined;
  const templateDuration = template.duration.millis * orderSize;
  if (line.orders.length < line.capacity) return templateDuration;

  const queue: number[] = [];
  for (const lineOrder of line.orders) {
    if (!lineOrder.duration) return;
    if (lineOrder.completion) {
      queue.push(lineOrder.completion.timestamp);
    } else if (queue.length < line.capacity) {
      queue.push(Date.now() + lineOrder.duration.millis);
    } else {
      queue.sort();
      queue.push(queue.shift()! + lineOrder.duration.millis);
    }
  }
  queue.sort();
  return queue.shift()! + templateDuration;
}

function init() {
  tiles.observe('PRODCO', onTileReady);
}

features.add(import.meta.url, init, 'PRODCO: Adds a finish ETA label to orders.');

import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';
import { createReactiveSpan } from '@src/utils/reactive-element';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ProductionLine.form), form => {
    const staticInputDuration = form.children[8].children[1].children[0];
    const dropDownBoxItem = refTextContent(_$(form.children[5], C.DropDownBox.currentItem)!);
    const rcSlider = refAttributeValue(_$(form, 'rc-slider-handle')!, 'aria-valuenow');
    const line = computed(() => {
      return productionStore.all.value!.find(line => line.id.substring(0, 8) === tile.parameter)!;
    });
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
    const eta = createReactiveSpan(staticInputDuration, completionText);
    staticInputDuration.append(eta);
  });
}

function getTemplateFromForm(templates: PrunApi.ProductionTemplate[], form: HTMLElement) {
  const template = _$(form, C.ProductionLine.template);
  const inputs: [string, number][] = [];
  const outputs: [string, number][] = [];
  let input = true;
  const templateMaterials = Array.from(template!.children);
  for (const materials of templateMaterials) {
    if (!materials.classList.contains(C.MaterialIcon.container)) {
      input = false;
      continue;
    }
    const indicator = Number(_$(materials, C.MaterialIcon.indicator)!.textContent ?? 0);
    const ticker = _$(materials, C.ColoredIcon.label)!.textContent ?? '';
    if (input) {
      inputs.push([ticker, indicator]);
    } else {
      outputs.push([ticker, indicator]);
    }
  }

  for (const template of templates) {
    if (
      template.inputFactors.length !== inputs.length ||
      template.outputFactors.length !== outputs.length
    ) {
      continue;
    }

    const allInputsMatch = template.inputFactors.every(inputT => {
      return inputs.some(input => {
        return input[0] === inputT.material.ticker && input[1] === inputT.factor;
      });
    });
    if (!allInputsMatch) {
      continue;
    }

    const allOutputsMatch = template.outputFactors.every(outputT => {
      return outputs.some(output => {
        return output[0] === outputT.material.ticker && output[1] === outputT.factor;
      });
    });
    if (allOutputsMatch) {
      return template;
    }
  }
  // There should be no way to get here.
  return undefined;
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

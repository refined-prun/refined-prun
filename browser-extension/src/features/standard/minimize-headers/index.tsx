import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import { widgetBefore } from '@src/utils/vue-mount';
import MinimizeRow from '@src/features/standard/minimize-headers/MinimizeRow.vue';
import { reactive, ref } from 'vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

async function onBufferCreated(buffer: PrunBuffer) {
  if (companyStore.code === 'KCB') {
    return;
  }
  const header = await descendantPresent(buffer.frame, PrunCss.FormComponent.containerPassive);
  setHeaders(buffer, true);

  const isMinimized = ref(true);

  widgetBefore(
    header,
    MinimizeRow,
    reactive({
      isMinimized,
      onClick: () => {
        isMinimized.value = !isMinimized.value;
        setHeaders(buffer, isMinimized.value);
      },
    }),
  );
}

function setHeaders(buffer: PrunBuffer, isMinimized: boolean) {
  const headers = _$$(PrunCss.FormComponent.containerPassive, buffer.frame);
  for (const header of headers) {
    const label = _$(PrunCss.FormComponent.label, header);
    if (label?.textContent === 'Minimize') {
      continue;
    }
    if (label?.textContent === 'Termination request') {
      const value = _$(PrunCss.FormComponent.input, header);
      if (value?.textContent !== '--') {
        continue;
      }
    }
    header.style.display = isMinimized ? 'none' : 'flex';
  }
}

function init() {
  buffers.observe(['CX', 'CONT', 'LM', 'SYSI'], onBufferCreated);
}

void features.add({
  id: 'minimize-headers',
  init,
});

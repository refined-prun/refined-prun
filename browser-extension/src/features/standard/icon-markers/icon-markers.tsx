import { setSettings } from '@src/util';
import features from '@src/feature-registry';
import system from '@src/system';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import IconMarker from './IconMarker.vue';
import { computed, reactive, ref, watch } from 'vue';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

export async function init() {
  if (companyStore.value?.code === 'KCB') {
    return;
  }
  const result = await system.storage.local.get('PMMG-Markers');
  result['PMMG-Markers'] = result['PMMG-Markers'] ?? {};
  subscribe($$(document, PrunCss.StoreView.container), async container => {
    const invNameElem = await $(container, PrunCss.Link.link);
    const invName = invNameElem.textContent;
    if (!invName) {
      return;
    }

    for (const mat of $$(container, PrunCss.GridItemView.image)) {
      if (mat.children[1]) {
        continue;
      }

      void constructIcon(mat, invName, result);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function constructIcon(mat: HTMLElement, invName: string, storedData: any) {
  const markers = storedData['PMMG-Markers'];
  const matTickerElem = await $(mat, PrunCss.ColoredIcon.label);
  const ticker = matTickerElem.textContent;
  if (!ticker) {
    return;
  }
  mat.style.position = 'relative';
  const id = invName + ticker;
  const icons = ['bookmark', 'star', 'rocket', 'tag', 'trash'];

  const status = ref(markers[id] ?? 0);
  watch(status, x => {
    if (x !== 0) {
      markers[id] = status.value;
    } else {
      delete markers[id];
    }
    setSettings(storedData);
  });
  const marker = computed(() =>
    status.value > 0
      ? system.runtime.getURL(`images/${icons[status.value - 1]}-icon.svg`)
      : undefined,
  );
  const wrapStatus = (value: number) => {
    if (value < 0) {
      return icons.length;
    }
    if (value > icons.length) {
      return 0;
    }
    return value;
  };
  createFragmentApp(
    IconMarker,
    reactive({
      marker,
      onNext: () => (status.value = wrapStatus(status.value + 1)),
      onPrevious: () => (status.value = wrapStatus(status.value - 1)),
    }),
  ).appendTo(mat);
}

void features.add({
  id: 'icon-markers',
  init,
});

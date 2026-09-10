import $style from './clickable-apex-logo.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function init() {
  applyCssRule(`.${C.Frame.logo}`, $style.logo);
  subscribe($$(document, C.Frame.logo), logo => {
    logo.addEventListener('click', e => {
      void showBuffer(`CO ${companyStore.value?.code}`);
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

features.add(
  import.meta.url,
  init,
  'Makes the APEX logo clickable and leading to the user company info screen.',
);

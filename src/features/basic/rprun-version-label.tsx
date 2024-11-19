import classes from './rprun-version-label.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { loadLocalFile } from '@src/util';
import { reloadPage } from '@src/infrastructure/prun-ui/page-functions';

const version = chrome.runtime.getManifest().version;
const updateReady = ref(false);

async function trackUpdates() {
  const manifest = await (await loadLocalFile('manifest.json')).json();
  if (manifest.version && version !== manifest.version) {
    updateReady.value = true;
  }
}

async function onFooterReady(footer: HTMLElement) {
  const userCount = await $(footer, C.UsersOnlineCount.container);

  const containerClass = computed(() => (updateReady.value ? C.HeadItem.link : undefined));
  const indicatorClass = computed(() =>
    updateReady.value
      ? [
          C.HeadItem.indicatorSuccessActive,
          C.effects.shadowSuccess,
          C.HeadItem.indicatorSuccessPulse,
          C.effects.shadowPulseSuccess,
        ]
      : undefined,
  );
  const tooltip = computed(() =>
    updateReady.value ? 'Refined PrUn version. Update ready!' : 'Refined PrUn version.',
  );

  function onClick() {
    if (updateReady.value) {
      reloadPage();
    }
  }

  createFragmentApp(() => (
    <div
      class={[
        classes.container,
        C.HeadItem.container,
        C.fonts.fontRegular,
        C.type.typeRegular,
        containerClass.value,
      ]}
      onClick={onClick}>
      <div class={[C.HeadItem.indicator, C.HeadItem.indicatorSuccess, indicatorClass.value]} />
      <div
        class={[classes.label, C.HeadItem.label]}
        data-tooltip={tooltip.value}
        data-tooltip-position="top">
        v. {version}
      </div>
    </div>
  )).before(userCount);
}

function init() {
  applyCssRule(`.${C.Frame.foot} > span`, classes.grow);
  subscribe($$(document, C.Frame.foot), onFooterReady);
  setInterval(trackUpdates, 60000);
}

features.add(import.meta.url, init, 'Adds a bottom-right "Refined PrUn version" label.');

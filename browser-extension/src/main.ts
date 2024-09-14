import { getSpecial } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import { loadLegacySettings, saveSettings, Settings } from './Settings';
import features from '@src/feature-registry';
import { initializePrunApi, loadGameData } from '@src/infrastructure/prun-api';
import PrunCss, { parsePrunCss } from '@src/infrastructure/prun-ui/prun-css';
import { applyXITParameters } from '@src/features/XIT/xit-commands';

import './refined-prun.css';
import { fetchPrices } from '@src/infrastructure/fio/cx';
import { loadFinHistory, recordFinancials } from '@src/core/financials';
import { loadSettings } from '@src/store/settings';
import dayjs from 'dayjs';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { loadNotes } from '@src/store/notes';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { balance } from '@src/core/balance/balance';
import descendantPresent from '@src/utils/descendant-present';

async function mainRun() {
  initializePrunApi();
  const backgroundTasks = Promise.allSettled([
    loadFinHistory(),
    loadGameData(),
    loadRefinedPrunCss(),
  ]);

  let result: Settings;
  try {
    result = await loadLegacySettings();
    await loadSettings();
    await loadNotes();
  } catch (e) {
    console.error('PMMG: Failed to load settings');
    throw e;
  }

  await parsePrunCss();
  await descendantPresent(document.documentElement, PrunCss.App.container);
  await backgroundTasks;

  if (!result.PMMGExtended.loaded_before) {
    console.log('First Time Loading PMMG');
  }

  const specialTime = getSpecial() && !result['PMMGExtended']['surprises_opt_out'];
  if (
    result['PMMGExtended']['color_scheme'] == 'enhanced' ||
    !result['PMMGExtended']['color_scheme']
  ) {
    appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.enhancedColors);
  } else if (result['PMMGExtended']['color_scheme'] == 'icons') {
    appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.icons);
  }

  if (result['PMMGExtended']['advanced_mode']) {
    appendStyle(RPrunStylesheet.advanced);
  }

  void fetchPrices();
  setInterval(fetchPrices, dayjs.duration(15, 'minutes').asMilliseconds());

  if (
    !result['PMMGExtended']['last_fin_recording'] ||
    Date.now() - result['PMMGExtended']['last_fin_recording'] >
      dayjs.duration(18, 'hours').asMilliseconds()
  ) {
    setTimeout(() => {
      let companyValue = balance.companyValue.value;
      const interval = setInterval(() => {
        // Hacky way to wait until all the financials are loaded.
        if (companyValue !== balance.companyValue.value) {
          companyValue = balance.companyValue.value;
          return;
        }
        clearInterval(interval);
        recordFinancials(result);
      }, 1000);
    }, 5000);
  }
  applyXITParameters(result);
  await features.init();

  if (!result.PMMGExtended.loaded_before) {
    result.PMMGExtended.loaded_before = await showBuffer('XIT START');
    if (result.PMMGExtended.loaded_before) {
      saveSettings(result);
    }
  }
}

void mainRun();

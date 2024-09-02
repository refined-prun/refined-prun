import { ModuleRunner } from './ModuleRunner';
import { getSpecial } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import { loadLegacySettings, Settings } from './Settings';
import features from '@src/feature-registry';
import { initializePrunApi, loadGameData } from '@src/infrastructure/prun-api';
import { parsePrunCss } from '@src/infrastructure/prun-ui/prun-css';
import { applyXITParameters } from '@src/features/XIT/xit-commands';

import './refined-prun.css';
import { fetchPrices } from '@src/infrastructure/fio/cx';
import { loadFinHistory, recordFinancials } from '@src/core/financials';
import { loadSettings } from '@src/store/settings';
import dayjs from 'dayjs';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { loadNotes } from '@src/store/notes';

// The main function that initializes everything
async function mainRun() {
  initializePrunApi();

  let result: Settings;
  try {
    result = await loadLegacySettings();
    await loadSettings();
    await loadNotes();
  } catch (e) {
    console.error('PMMG: Failed to load settings');
    throw e;
  }

  await Promise.allSettled([
    loadFinHistory(),
    loadGameData(),
    loadRefinedPrunCss(),
    waitUntilPrunLoaded(),
  ]);
  parsePrunCss();

  // Detect what date it is for... no reason.
  const specialTime = getSpecial() && !result['PMMGExtended']['surprises_opt_out'];
  // Log if is the first time the user loads PMMG Extended
  if (!result.PMMGExtended.loaded_before) {
    console.log('First Time Loading PMMG');
  }

  const doc = document.querySelector('html');
  if (!doc) {
    return;
  }

  // If enhanced color scheme is selected or no color scheme is selected, appy the enhanced color scheme
  if (
    result['PMMGExtended']['color_scheme'] == 'enhanced' ||
    !result['PMMGExtended']['color_scheme']
  ) {
    appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.enhancedColors);
  }
  // If the icons color scheme is selected, apply it
  else if (result['PMMGExtended']['color_scheme'] == 'icons') {
    // Use allocater's icons
    appendStyle(specialTime ? RPrunStylesheet.oldColors : RPrunStylesheet.icons);
  }

  if (result['PMMGExtended']['advanced_mode'] && doc) {
    appendStyle(RPrunStylesheet.advanced);
  }

  setTimeout(fetchPrices, 1000);
  setInterval(fetchPrices, dayjs.duration(15, 'minutes').asMilliseconds());

  // Do FIN recording
  if (
    !result['PMMGExtended']['last_fin_recording'] ||
    Date.now() - result['PMMGExtended']['last_fin_recording'] > 64800000
  ) {
    // 72000000
    window.setTimeout(() => recordFinancials(result), 5000);
  }
  const modules = [];
  applyXITParameters(result, modules);
  await features.init();
  const runner = new ModuleRunner(modules, result);

  // Start the loop
  runner.loop();
}

async function waitUntilPrunLoaded() {
  await new Promise<void>(resolve => {
    function checkContainer() {
      const container = document.getElementById('container');
      if (container !== null && container.children.length > 0) {
        resolve();
        return;
      }
      requestAnimationFrame(checkContainer);
    }
    checkContainer();
  });
}

void mainRun();

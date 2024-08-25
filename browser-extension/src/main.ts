import { ModuleRunner } from './ModuleRunner';
import { OrderETAs } from '@src/features/OrderETAs';
import { getSpecial } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import { ScreenUnpack } from '@src/features/ScreenUnpack';
import { InventoryOrganizer } from '@src/features/InventoryOrganizer';
import { HeaderMinimizer } from '@src/features/HeaderMinimizer';
import { IconMarkers } from '@src/features/IconMarkers';
import { loadLegacySettings, Settings } from './Settings';
import features from '@src/feature-registry';
import { initializePrunApi, loadGameData } from '@src/prun-api';
import { loadPrunCss } from '@src/prun-ui/prun-css';
import { applyXITParameters } from '@src/XIT/xit-commands';

import './refined-prun.css';
import { fetchPrices } from '@src/fio/cx';
import { loadFinHistory, recordFinancials } from '@src/core/financials';
import { loadSettings } from '@src/store/settings';
import dayjs from 'dayjs';

// The main function that initializes everything
async function mainRun() {
  appendStyle(RPrunStylesheet.refinedPrun);

  initializePrunApi();

  let result: Settings;
  try {
    result = await loadLegacySettings();
    await loadSettings();
  } catch (e) {
    console.error('PMMG: Failed to load settings');
    throw e;
  }

  await Promise.allSettled([loadFinHistory(), loadGameData(), waitUntilPrunLoaded()]);
  loadPrunCss();

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
  const modules = [
    new OrderETAs(),
    new InventoryOrganizer(result),
    new ScreenUnpack(result['PMMGExtended']['unpack_exceptions']),
    new HeaderMinimizer(result['PMMGExtended']['minimize_by_default']),
    new IconMarkers(),
  ];
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

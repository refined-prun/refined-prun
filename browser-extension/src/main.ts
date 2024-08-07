import { ModuleRunner } from './ModuleRunner';
import { OrderETAs } from '@src/features/OrderETAs';
import { getPrices } from './BackgroundRunner';
import { getSpecial } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import { ScreenUnpack } from '@src/features/ScreenUnpack';
import { Sidebar } from '@src/features/Sidebar';
import { InventoryOrganizer } from '@src/features/InventoryOrganizer';
import { HeaderMinimizer } from '@src/features/HeaderMinimizer';
import { PendingContracts } from '@src/features/PendingContracts';
import { CompactUI } from '@src/features/CompactUI';
import { AdvancedMode } from '@src/features/AdvancedMode';
import { IconMarkers } from '@src/features/IconMarkers';
import { PostLM } from '@src/features/PostLM';
import { loadSettings, Settings } from './Settings';
import features from '@src/feature-registry';
import { initializePrunApi, loadGameData } from '@src/prun-api';
import { loadPrunCss } from '@src/prun-ui/prun-css';
import { applyXITParameters } from '@src/XIT/xit-commands';

import './refined-prun.css';
import cx from '@src/prun-api/cx';
import { calculateFinancials } from '@src/financials';

// The main function that initializes everything
async function mainRun() {
  appendStyle(RPrunStylesheet.refinedPrun);

  initializePrunApi();

  let result: Settings;
  try {
    result = await loadSettings();
  } catch (e) {
    console.error('PMMG: Failed to load settings');
    throw e;
  }

  await Promise.allSettled([loadPrunCss(), loadGameData(), waitUntilPrunLoaded()]);

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
  if (result['PMMGExtended']['color_scheme'] == 'enhanced' || !result['PMMGExtended']['color_scheme']) {
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

  // All asynchronous web data put in as keys into this dictionary
  const webData = {};

  // Start the process of getting corp prices via a web app asynchronously
  window.setTimeout(
    () => getPrices(webData, result['PMMGExtended']['fin_spreadsheet'], result['PMMGExtended']['fin_sheet_name']),
    1000,
  );

  setTimeout(cx.fetchPrices, 1000);

  // Do FIN recording
  if (
    result['PMMGExtended']['recording_financials'] != false &&
    (!result['PMMGExtended']['last_fin_recording'] ||
      Date.now() - result['PMMGExtended']['last_fin_recording'] > 64800000)
  ) {
    // 72000000
    window.setTimeout(() => calculateFinancials(webData, result, true), 1000);
  }
  const modules = [
    new OrderETAs(),
    new InventoryOrganizer(result),
    new ScreenUnpack(result['PMMGExtended']['unpack_exceptions']),
    new HeaderMinimizer(result['PMMGExtended']['minimize_by_default']),
    new AdvancedMode(result['PMMGExtended']['advanced_mode']),
    new Sidebar(result['PMMGExtended']['sidebar']),
    new PendingContracts(),
    new CompactUI(result),
    new IconMarkers(),
    new PostLM(),
  ];
  applyXITParameters(result, webData, modules);
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

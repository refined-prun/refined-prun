import { ModuleRunner } from './ModuleRunner';
import { OrderETAs } from '@src/features/OrderETAs';
import { Notifications } from '@src/features/Notifications';
import { getCXPrices, getPrices } from './BackgroundRunner';
import { getSpecial } from './util';
import { appendStyle, RPrunStylesheet } from './Style';
import { ScreenUnpack } from '@src/features/ScreenUnpack';
import { Sidebar } from '@src/features/Sidebar';
import { InventoryOrganizer } from '@src/features/InventoryOrganizer';
import { HeaderMinimizer } from '@src/features/HeaderMinimizer';
import { PendingContracts } from '@src/features/PendingContracts';
import { CompactUI } from '@src/features/CompactUI';
import { calculateFinancials } from './XIT/Finances';
import { AdvancedMode } from '@src/features/AdvancedMode';
import { CXOBHighlighter } from '@src/features/CXOBHighlighter';
import { CXPOOrderBook } from '@src/features/CXPOOrderBook';
import { ChatDeleteButton } from '@src/features/ChatDeleteButton';
import { IconMarkers } from '@src/features/IconMarkers';
import { PostLM } from '@src/features/PostLM';
import { loadSettings, Settings } from './Settings';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import { initializePrunApi, loadGameData } from '@src/prun-api';
import { loadPrunCss } from '@src/prun-ui/prun-css';
import { applyXITParameters } from '@src/features/xit-commands';

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

  // Apply hiding chat delete button if enabled
  if (result['PMMGExtended']['chat_delete_hidden']) {
    appendStyle(RPrunStylesheet.hideChatDelete);
  }

  // Apply hiding join/leave messages if enabled
  if (result['PMMGExtended']['join_leave_hidden']) {
    appendStyle(RPrunStylesheet.hideChatJoinLeave);
  }

  // Introduce an object that will hold and be periodically updated with latest info harvested from server traffic
  const userInfo = {};

  // All asynchronous web data put in as keys into this dictionary
  const webData = {};

  // Start the process of getting corp prices via a web app asynchronously
  window.setTimeout(
    () => getPrices(webData, result['PMMGExtended']['fin_spreadsheet'], result['PMMGExtended']['fin_sheet_name']),
    1000,
  );

  // Get CX Prices
  window.setTimeout(() => getCXPrices(userInfo), 1000);

  // Do FIN recording
  if (
    result['PMMGExtended']['recording_financials'] != false &&
    (!result['PMMGExtended']['last_fin_recording'] ||
      Date.now() - result['PMMGExtended']['last_fin_recording'] > 64800000)
  ) {
    // 72000000
    window.setTimeout(() => calculateFinancials(webData, userInfo, result, true), 1000);
  }
  buffers.track();
  const modules = [
    new OrderETAs(),
    new InventoryOrganizer(userInfo, result),
    new Notifications(userInfo),
    new ScreenUnpack(result['PMMGExtended']['unpack_exceptions']),
    new HeaderMinimizer(result['PMMGExtended']['minimize_by_default']),
    new AdvancedMode(result['PMMGExtended']['advanced_mode']),
    new Sidebar(result['PMMGExtended']['sidebar']),
    new PendingContracts(userInfo),
    new CompactUI(result),
    new CXOBHighlighter(userInfo),
    new CXPOOrderBook(userInfo),
    new ChatDeleteButton(result),
    new IconMarkers(),
    new PostLM(),
  ];
  applyXITParameters(result, userInfo, webData, modules);
  await features.init();
  const runner = new ModuleRunner(modules, result, webData, userInfo);

  // Start the loop
  (function () {
    runner.loop();
    runner.loopUserInfo();
  })();
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

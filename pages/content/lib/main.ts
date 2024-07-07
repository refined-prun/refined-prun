import { FlightETAs } from '@lib/features/FlightETAs';
import { ModuleRunner } from './ModuleRunner';
import { OrderETAs } from '@lib/features/OrderETAs';
import { FleetETAs } from '@lib/features/FleetETAs';
import { QueueLoad } from '@lib/features/QueueLoad';
import { Notifications } from '@lib/features/Notifications';
import { getCXPrices, getPrices } from './BackgroundRunner';
import { getSpecial } from './util';
import { appendStyle, PmmgStylesheet } from './Style';
import { ScreenUnpack } from '@lib/features/ScreenUnpack';
import { Sidebar } from '@lib/features/Sidebar';
import { CommandCorrecter } from '@lib/features/CommandCorrecter';
import { CalculatorButton } from '@lib/features/CalculatorButton';
import { ImageCreator } from '@lib/features/ImageCreator';
import { InventoryOrganizer } from '@lib/features/InventoryOrganizer';
import { HeaderMinimizer } from '@lib/features/HeaderMinimizer';
import { PendingContracts } from '@lib/features/PendingContracts';
import { CompactUI } from '@lib/features/CompactUI';
import { calculateFinancials } from './XIT/Finances';
import { FormulaReplacer } from '@lib/features/FormulaEvaluator';
import { AdvancedMode } from '@lib/features/AdvancedMode';
import { CXOBHighlighter } from '@lib/features/CXOBHighlighter';
import { CXPOOrderBook } from '@lib/features/CXPOOrderBook';
import { ChatDeleteButton } from '@lib/features/ChatDeleteButton';
import { IconMarkers } from '@lib/features/IconMarkers';
import { LocalMarketAds } from '@lib/features/LocalMarketAds';
import { ConsumableTimers } from '@lib/features/ConsumableTimers';
import { ShippingAds } from '@lib/features/ShippingAds';
import { PostLM } from '@lib/features/PostLM';
import { loadSettings, Settings } from './Settings';

// The main function that initializes everything
async function mainRun() {
  let result: Settings;
  try {
    result = await loadSettings();
  } catch (e) {
    console.error('PMMG: Failed to load settings');
    throw e;
  }

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
    appendStyle(specialTime ? PmmgStylesheet.oldColors : PmmgStylesheet.enhancedColors);
  }
  // If the icons color scheme is selected, apply it
  else if (result['PMMGExtended']['color_scheme'] == 'icons') {
    // Use allocater's icons
    appendStyle(specialTime ? PmmgStylesheet.oldColors : PmmgStylesheet.icons);
  }

  if (result['PMMGExtended']['advanced_mode'] && doc) {
    appendStyle(PmmgStylesheet.advanced);
  }

  // Apply hiding chat delete button if enabled
  if (result['PMMGExtended']['chat_delete_hidden']) {
    appendStyle(PmmgStylesheet.hideChatDelete);
  }

  // Apply hiding join/leave messages if enabled
  if (result['PMMGExtended']['join_leave_hidden']) {
    appendStyle(PmmgStylesheet.hideChatJoinLeave);
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
  // Create the object that will run all the features in a loop
  const runner = new ModuleRunner(
    [
      new OrderETAs(),
      new FlightETAs(),
      new FleetETAs(),
      new QueueLoad(),
      new InventoryOrganizer(userInfo, result),
      new Notifications(userInfo),
      new ImageCreator(),
      new ScreenUnpack(result['PMMGExtended']['unpack_exceptions']),
      new HeaderMinimizer(result['PMMGExtended']['minimize_by_default']),
      new AdvancedMode(result['PMMGExtended']['advanced_mode']),
      new CommandCorrecter(),
      new CalculatorButton(),
      new Sidebar(result['PMMGExtended']['sidebar']),
      new PendingContracts(userInfo),
      new CompactUI(result),
      new FormulaReplacer(),
      new CXOBHighlighter(userInfo),
      new CXPOOrderBook(userInfo),
      new ChatDeleteButton(result),
      new IconMarkers(),
      //new InsetFixer(),	// Remove when this PrUN bug is fixed for real
      new ShippingAds(),
      new LocalMarketAds(),
      new PostLM(webData),
      new ConsumableTimers(result['PMMGExtended']['burn_thresholds'], userInfo),
    ],
    result,
    webData,
    userInfo,
  );

  // Start the loop
  (function () {
    runner.loop();
    runner.loopUserInfo();
  })();
}

mainRun();

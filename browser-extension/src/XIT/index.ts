import { FIOInventory } from '@src/XIT/Inventory';
import { FIOChat } from '@src/XIT/Chat';
import { Calculator } from '@src/XIT/Calculator';
import { DataHealth } from '@src/XIT/DataHealth';
import { Burn } from '@src/XIT/Burn';
import { Contracts } from '@src/XIT/Contracts';
import { CommandLists } from '@src/XIT/CommandLists';
import { Debug } from '@src/XIT/Debug';
import { Finances } from '@src/XIT/Finances';
import { Help } from '@src/XIT/Help';
import { Repairs } from '@src/XIT/Repairs';
import { Settings } from '@src/XIT/Settings';
import { Sort } from '@src/XIT/Sort';
import { Start } from '@src/XIT/Start';
import { PrUN, Prosperity, Sheets, Wiki, PrunPlanner, Map } from '@src/XIT/Web';
import { Checklists } from '@src/XIT/Checklists';
import { Execute } from '@src/XIT/Execute';
import { Notes } from '@src/XIT/Notes';

// This is the structure all classes should follow. For some reason extending classes in other files shows XITModule as undefined.
// Not the best solution, but it works. Be careful implementing new modules that they include these functions.
export interface XITModule {
  create_buffer(); // Clear and recreate the buffer
  update_buffer(); // Partially update the buffer
  destroy_buffer(); // Destroys any continuous objects not automatically destroyed on buffer close
  name: string; // Title of the buffer
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const XITClasses: { [key: string]: new (...args: any[]) => XITModule } = {
  INV: FIOInventory,
  CALCULATOR: Calculator,
  CALC: Calculator,
  CHAT: FIOChat,
  HEALTH: DataHealth,
  BURN: Burn,
  CONTS: Contracts,
  CONTRACTS: Contracts,
  LIST: CommandLists,
  LISTS: CommandLists,
  DEBUG: Debug,
  FIN: Finances,
  FINANCE: Finances,
  FINANCES: Finances,
  HELP: Help,
  REPAIRS: Repairs,
  SET: Settings,
  SETTINGS: Settings,
  SORT: Sort,
  START: Start,
  PRUN: PrUN,
  PROSPERITY: Prosperity,
  SHEET: Sheets,
  SHEETS: Sheets,
  WIKI: Wiki,
  PLANNER: PrunPlanner,
  PLAN: PrunPlanner,
  PRUNPLANNER: PrunPlanner,
  CHECK: Checklists,
  CHECKLIST: Checklists,
  CHECKLISTS: Checklists,
  NOTE: Notes,
  NOTES: Notes,
  ACT: Execute,
  ACTION: Execute,
  MAP: Map,
};

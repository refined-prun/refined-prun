import { CHROME } from './env';

const defaultSettings = {
  PMMGExtended: {
    loaded_before: false,
  },
};

export type Settings = typeof defaultSettings & { [key: string]: any };
const settingsKey = 'PMMGExtended';

export async function loadSettings() {
  let data = await loadDataFromStorage();
  if (data[settingsKey] === undefined) {
    data = structuredClone(defaultSettings);
  }

  migrate(data);
  return <Settings>data;
}

function migrate(data: any) {
  const settings = data[settingsKey];
  settings.loaded_before = settings.loaded_before ?? false;
  settings.disabled = settings.disabled ?? ['ScreenUnpack'];
  delete settings.burn_display_settings;
}

export async function saveSettings(settings: Settings) {
  if (CHROME) {
    return await chrome.storage.local.set(settings);
  } else {
    return await browser.storage.local.set(settings);
  }
}

async function loadDataFromStorage() {
  if (CHROME) {
    return await chrome.storage.local.get(settingsKey);
  } else {
    return await browser.storage.local.get(settingsKey);
  }
}

import system from '@src/system';

const defaultSettings = {
  PMMGExtended: {
    loaded_before: false,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrate(data: any) {
  const settings = data[settingsKey];
  settings.loaded_before = settings.loaded_before ?? false;
  settings.disabled = settings.disabled ?? ['ScreenUnpack'];
  delete settings.burn_display_settings;
}

export async function saveSettings(settings: Settings) {
  await system.storage.local.set(settings);
}

async function loadDataFromStorage() {
  return await system.storage.local.get(settingsKey);
}

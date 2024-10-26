import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const apex = 'https://apex.prosperousuniverse.com/*';

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  permissions: ['storage', 'scripting'],
  host_permissions: [
    'https://apex.prosperousuniverse.com/',
    'https://script.google.com/',
    'https://script.googleusercontent.com/',
    'https://rest.fnar.net/',
  ],
  action: {
    default_icon: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
    },
    default_popup: 'popup.html',
  },
  icons: {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
  content_scripts: [
    {
      matches: [apex],
      js: ['refined-prun-prepare.js', 'refined-prun.js'],
      run_at: 'document_start',
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', '*.json', '*.woff2', '*.ttf'],
      matches: [apex],
    },
  ],
};

export default manifest;

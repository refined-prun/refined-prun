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
    default_popup: 'popup.html',
    default_icon: 'icon-34.png',
  },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: [apex],
      js: ['socket-io-proxy-inject.js'],
      run_at: 'document_start',
    },
    {
      matches: [apex],
      js: ['refined-prun.js'],
      css: ['refined-prun.css'],
      run_at: 'document_start',
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.js.map', '*.css', '*.svg', '*.json', 'icon-128.png', 'icon-34.png'],
      matches: [apex],
    },
  ],
};

export default manifest;

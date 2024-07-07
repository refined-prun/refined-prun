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
  permissions: ['storage', 'activeTab', 'scripting', 'tabs'],
  host_permissions: [
    'https://apex.prosperousuniverse.com/',
    'https://script.google.com/',
    'https://script.googleusercontent.com/',
    'https://rest.fnar.net/',
  ],
  background: {
    service_worker: 'service_worker.js',
  },
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
      js: ['document_start.js'],
      run_at: 'document_start',
    },
    {
      matches: [apex],
      js: ['enhanced-prun.js'],
      css: ['enhanced-prun.css'],
      run_at: 'document_end',
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.js', '*.js.map', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: [apex],
    },
  ],
};

export default manifest;

import '@src/index.css';

const clearButton = document.getElementById('clearbutton')!;

clearButton.addEventListener('click', function () {
  OnClear_Click();
});

function OnClear_Click() {
  try {
    browser.storage.local.remove('PMMGExtended');
    browser.storage.local.remove('PMMG-Notes');
    browser.storage.local.remove('PMMG-Lists');
    browser.storage.local.remove('PMMG-Finances');
    browser.storage.local.remove('PMMG-User-Info');
    browser.storage.local.remove('PMMG-Checklists');
    browser.storage.local.remove('PMMG-Markers');
    browser.storage.local.remove('PMMG-Action');
  } catch (err) {
    chrome.storage.local.remove('PMMGExtended');
    chrome.storage.local.remove('PMMG-Notes');
    chrome.storage.local.remove('PMMG-Lists');
    chrome.storage.local.remove('PMMG-Finances');
    chrome.storage.local.remove('PMMG-User-Info');
    chrome.storage.local.remove('PMMG-Checklists');
    chrome.storage.local.remove('PMMG-Markers');
    chrome.storage.local.remove('PMMG-Action');
  }
}

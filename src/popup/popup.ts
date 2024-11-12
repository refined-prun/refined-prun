const clearButton = document.getElementById('clearbutton')!;

clearButton.addEventListener('click', () => {
  OnClear_Click();
});

function OnClear_Click() {
  chrome.storage.local.remove('PMMG-Lists');
  chrome.storage.local.remove('PMMG-Checklists');
}

import './popup.css';
import system from '@src/system';

const clearButton = document.getElementById('clearbutton')!;

clearButton.addEventListener('click', () => {
  OnClear_Click();
});

function OnClear_Click() {
  system.storage.local.remove('PMMG-Lists');
  system.storage.local.remove('PMMG-Checklists');
  system.storage.local.remove('PMMG-Markers');
  system.storage.local.remove('PMMG-Action');
}

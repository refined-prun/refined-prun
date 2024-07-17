import './popup.css';
import system from '@src/system';

const clearButton = document.getElementById('clearbutton')!;

clearButton.addEventListener('click', function () {
  OnClear_Click();
});

function OnClear_Click() {
  system.storage.local.remove('PMMGExtended');
  system.storage.local.remove('PMMG-Notes');
  system.storage.local.remove('PMMG-Lists');
  system.storage.local.remove('PMMG-Finances');
  system.storage.local.remove('PMMG-User-Info');
  system.storage.local.remove('PMMG-Checklists');
  system.storage.local.remove('PMMG-Markers');
  system.storage.local.remove('PMMG-Action');
}

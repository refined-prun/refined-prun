import { Module } from '../ModuleRunner';
import { getBuffersFromList, cleanPlanetName, createTextSpan, genericCleanup } from '../util';
import { Selector } from '../Selector';

export class AdvancedMode implements Module {
  private tag = 'pb-advanced';

  private enabled;

  constructor(enabled) {
    this.enabled = enabled;
  }

  cleanup() {
    genericCleanup('pb-cleanup');
  }

  run(allBuffers) {
    if (!this.enabled) {
      return;
    } // Must be enabled to run

    // Clean Fleet Buffers
    let buffers = getBuffersFromList('FLT', allBuffers);
    buffers.forEach(buffer => {
      cleanFleet(buffer, this.tag);
    });

    // Clean INV Buffers
    buffers = getBuffersFromList('INV', allBuffers);
    buffers.forEach(buffer => {
      cleanInv(buffer, this.tag);
    });

    // Clean CXOS Buffers
    buffers = getBuffersFromList('CXOS', allBuffers);
    buffers.forEach(buffer => {
      cleanCXOS(buffer);
    });

    // Clean COGCPEX Buffers
    buffers = getBuffersFromList('COGCPEX ', allBuffers);
    buffers.forEach(buffer => {
      cleanCOGCPEX(buffer, this.tag);
    });

    // Clean SHPF Buffers
    buffers = getBuffersFromList('SHPF', allBuffers);
    buffers.forEach(buffer => {
      cleanSHPF(buffer);
    });
  }
}

function cleanInv(buffer, tag) {
  // Only clean INV buffers with no other parameters
  const bufferHeaders = buffer.querySelector(Selector.BufferHeader);
  if (!bufferHeaders) {
    return;
  }

  const parameters = (bufferHeaders as HTMLElement).textContent;
  if (!parameters || parameters != 'INV') {
    return;
  }

  // Shorten planet names
  const links = buffer.querySelectorAll(Selector.BufferLink);
  links.forEach(link => {
    if (link.textContent) {
      // Prevent duplicate processing
      if (link.classList.contains(tag)) {
        return;
      }
      link.classList.add(tag);
      link.textContent = cleanPlanetName(link.textContent);
    }
  });

  const rows = buffer.querySelectorAll('tr');
  rows.forEach(row => {
    if (row.classList.contains(tag)) {
      return;
    }
    row.classList.add(tag);
    if (
      row.firstChild &&
      row.firstChild.firstChild &&
      row.firstChild.firstChild.textContent &&
      cleanINVNames[row.firstChild.firstChild.textContent]
    ) {
      row.firstChild.firstChild.textContent = cleanINVNames[row.firstChild.firstChild.textContent];
    }
  });
}

const cleanINVNames = {
  'Cargo hold': 'Ship',
  'Base storage': 'Base',
  'Warehouse unit': 'WAR',
  'STL fuel tank': 'STL tank',
  'FTL fuel tank': 'FTL tank',
};

function cleanFleet(buffer, tag) {
  // Remove first column
  const rows = buffer.querySelectorAll('tr');
  rows.forEach(row => {
    if (row.classList.contains(tag)) {
      return;
    }
    row.classList.add(tag);
    if (row.firstChild) {
      row.firstChild.style.display = 'none';
    }
    if (
      row.children &&
      row.children[2] &&
      row.children[2].firstChild &&
      row.children[2].firstChild.children &&
      row.children[2].firstChild.children[2]
    ) {
      let text = row.children[2].textContent || '';
      text = text
        .replace('m³', '')
        .replace('t', '')
        .replace(/1,000/g, '1k')
        .replace(/2,000/g, '2k')
        .replace(/3,000/g, '3k')
        .replace(/1.000/g, '1k')
        .replace(/2.000/g, '2k')
        .replace(/3.000/g, '3k');
      row.children[2].firstChild.children[2].textContent = text;
    }
  });

  // Shorten planet names
  const links = buffer.querySelectorAll(Selector.BufferLink);
  links.forEach(link => {
    if (link.textContent) {
      // Prevent duplicate processing
      if (link.classList.contains(tag)) {
        return;
      }
      link.classList.add(tag);
      link.textContent = cleanPlanetName(link.textContent);
    }
  });

  // Shorten Status
  const tableEntries = buffer.querySelectorAll('td');
  tableEntries.forEach(entry => {
    if (entry.textContent) {
      if (Object.keys(shipStatus).includes(entry.textContent)) {
        //entry.textContent = shipStatus[entry.textContent];
        entry.style.textAlign = 'center';
        entry.style.fontSize = '0';
        const statusIndicator = createTextSpan(shipStatus[entry.textContent], 'pb-cleanup');
        statusIndicator.title = entry.textContent;
        statusIndicator.style.fontSize = '11px';
        entry.appendChild(statusIndicator);
      }
    }
    entry.style.padding = '2px 4px';
  });
}

const shipStatus = {
  'taking off': '↑',
  departing: '↗',
  charging: '±',
  jumping: '⟿',
  approaching: '↘',
  landing: '↓',
  stationary: '⦁',
  'in transit': '⟶',
  Abflug: '↗',
  Sprung: '⟿',
  stationär: '⦁',
};

function cleanCXOS(buffer) {
  // Remove first column
  const rows = buffer.querySelectorAll('tr');
  rows.forEach(row => {
    if (row.firstChild) {
      row.firstChild.style.display = 'none';
    }
  });
}

function cleanCOGCPEX(buffer, tag) {
  const links = buffer.querySelectorAll(Selector.BufferLink);
  links.forEach(link => {
    if (link.textContent) {
      // Prevent duplicate processing
      if (link.classList.contains(tag)) {
        return;
      }
      link.classList.add(tag);
      link.textContent = link.textContent.replace('Advertising Campaign: ', '');
      link.textContent = link.textContent.replace('Education Events: ', '');
    }
  });

  const buttons = buffer.querySelectorAll(Selector.SmallButton);
  buttons.forEach(button => {
    if (button.textContent) {
      // Prevent duplicate processing
      if (button.classList.contains(tag)) {
        return;
      }
      button.classList.add(tag);
      button.textContent = 'vote';
    }
  });
}

function cleanSHPF(buffer) {
  // Remove the sort options
  const bufferInventorySortOptions = buffer.querySelectorAll(Selector.InventorySortOptions);
  bufferInventorySortOptions?.forEach(value => (value.style.display = 'none'));
  // Remove the "Weight" and "Volume" Labels
  const storeViewName = buffer.querySelectorAll(Selector.StoreViewName);
  storeViewName?.forEach(value => (value.style.display = 'none'));
}

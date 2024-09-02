import { setSettings } from '@src/util';
import { Selector } from '@src/Selector';
import features from '@src/feature-registry';
import system from '@src/system';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';

const tag = 'pb-marker';

export async function init() {
  if (companyStore.code === 'KCB') {
    return;
  }
  const result = await system.storage.local.get('PMMG-Markers');
  result['PMMG-Markers'] = result['PMMG-Markers'] ?? {};
  observeReadyElementsByClassName(PrunCss.StoreView.container, container => {
    const invNameElem = _$(PrunCss.Link.link, container);
    const invName = invNameElem?.textContent;
    if (!invName) {
      return;
    }

    const mats = _$$(PrunCss.GridItemView.image, container);
    for (const mat of mats) {
      if (mat.children[1]) {
        continue;
      }

      constructIcon(mat, invName, result);
    }
  });
}

function constructIcon(mat, invName, storedData) {
  let status = 0;
  const matTickerElem = mat.querySelector(Selector.MaterialText);
  if (!matTickerElem || !matTickerElem.textContent) {
    return;
  }

  const icons = ['bookmark', 'star', 'rocket', 'tag', 'trash'];
  const getIconPath = () => system.runtime.getURL(`images/${icons[status - 1]}-icon.svg`);
  const ticker = matTickerElem.textContent;

  const iconContainer = document.createElement('div');
  mat.appendChild(iconContainer);
  iconContainer.classList.add(tag);

  const icon = document.createElement('div');
  iconContainer.appendChild(icon);
  mat.style.position = 'relative';

  const svgContainer = document.createElement('div');
  const img = document.createElement('img');
  svgContainer.appendChild(img);
  icon.appendChild(svgContainer);

  // Set style depending on previously stored settings
  if (storedData['PMMG-Markers'][invName + ticker]) {
    status = storedData['PMMG-Markers'][invName + ticker];
    if (status) {
      img.src = getIconPath();
      icon.style.display = 'block';
    }
  }

  // Move the style forward to the next one
  iconContainer.addEventListener('click', e => {
    e.preventDefault();
    if (!status) {
      status = 1;
      img.src = getIconPath();
      icon.style.display = 'block';
      storedData['PMMG-Markers'][invName + ticker] = status;
    } else if (status == icons.length) {
      img.src = '';
      icon.style.removeProperty('display');
      status = 0;
      delete storedData['PMMG-Markers'][invName + ticker];
    } else {
      status++;
      img.src = getIconPath();
      icon.style.display = 'block';
      storedData['PMMG-Markers'][invName + ticker] = status;
    }

    setSettings(storedData);
  });

  // Move the style back to the last one
  iconContainer.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (!status) {
      status = icons.length;
      img.src = getIconPath();
      icon.style.display = 'block';
      storedData['PMMG-Markers'][invName + ticker] = status;
    } else if (status == 1) {
      img.src = '';
      icon.style.removeProperty('display');
      status = 0;
      delete storedData['PMMG-Markers'][invName + ticker];
    } else {
      status--;
      img.src = getIconPath();
      icon.style.display = 'block';
      storedData['PMMG-Markers'][invName + ticker] = status;
    }

    setSettings(storedData);
  });
}

void features.add({
  id: 'icon-markers',
  init,
});

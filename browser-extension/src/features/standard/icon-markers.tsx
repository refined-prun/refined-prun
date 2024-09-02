import { setSettings } from '@src/util';
import { Selector } from '@src/Selector';
import features from '@src/feature-registry';
import system from '@src/system';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';

const tag = 'pb-marker';
const storedData: { unchanged?: boolean } = { unchanged: true };

export async function init() {
  if (companyStore.code === 'KCB') {
    return;
  }
  const result = await system.storage.local.get('PMMG-Markers');
  setStorage(result);
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

      constructIcon(mat, invName);
    }
  });
}

function setStorage(gatheredData) {
  storedData['PMMG-Markers'] = {};
  if (gatheredData['PMMG-Markers']) {
    Object.keys(gatheredData['PMMG-Markers']).forEach(identifier => {
      storedData['PMMG-Markers'][identifier] = gatheredData['PMMG-Markers'][identifier];
    });
  }
  delete storedData.unchanged;
}

function constructIcon(mat, invName) {
  let status = 0;
  const matTickerElem = mat.querySelector(Selector.MaterialText);
  if (!matTickerElem || !matTickerElem.textContent) {
    return;
  }

  const ticker = matTickerElem.textContent;

  const iconContainer = document.createElement('div');
  mat.appendChild(iconContainer);
  iconContainer.classList.add(tag);

  const icon = document.createElement('div');
  iconContainer.appendChild(icon);
  mat.style.position = 'relative';

  const svgContainer = document.createElement('div');
  icon.appendChild(svgContainer);

  // Set style depending on previously stored settings
  if (storedData['PMMG-Markers'][invName + ticker]) {
    status = storedData['PMMG-Markers'][invName + ticker];
    if (status) {
      svgContainer.innerHTML = icons[status - 1];
      icon.style.display = 'block';
    }
  }

  // Move the style forward to the next one
  iconContainer.addEventListener('click', e => {
    e.preventDefault();
    if (!status) {
      status = 1;
      svgContainer.innerHTML = icons[status - 1];
      icon.style.display = 'block';
      storedData['PMMG-Markers'][invName + ticker] = status;
    } else if (status == icons.length) {
      svgContainer.innerHTML = '';
      icon.style.removeProperty('display');
      status = 0;
      delete storedData['PMMG-Markers'][invName + ticker];
    } else {
      status++;
      svgContainer.innerHTML = icons[status - 1];
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
      svgContainer.innerHTML = icons[status - 1];
      icon.style.display = 'block';
      storedData['PMMG-Markers'][invName + ticker] = status;
    } else if (status == 1) {
      svgContainer.innerHTML = '';
      icon.style.removeProperty('display');
      status = 0;
      delete storedData['PMMG-Markers'][invName + ticker];
    } else {
      status--;
      svgContainer.innerHTML = icons[status - 1];
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

const icons = [
  `<?xml version="1.0" encoding="utf-8"?>

<!-- Bookmark Icon created by pixelbazaar -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="12px" height="12px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g>
	<path fill="#000000" d="M52,63.999c-1.039,0-2.062-0.406-2.828-1.172L32,45.655L14.828,62.827
		c-1.148,1.145-2.863,1.488-4.359,0.867C8.973,63.077,8,61.616,8,59.999v-56c0-2.211,1.789-4,4-4h40c2.211,0,4,1.789,4,4v56
		c0,1.617-0.973,3.078-2.469,3.695C53.035,63.901,52.516,63.999,52,63.999z M32,35.999c1.023,0,2.047,0.391,2.828,1.172L48,50.343
		V7.999H16v42.344l13.172-13.172C29.953,36.39,30.977,35.999,32,35.999z"/>
	<path fill="#cc210e" d="M32,35.999c1.023,0,2.047,0.391,2.828,1.172L48,50.343V7.999H16v42.344l13.172-13.172
		C29.953,36.39,30.977,35.999,32,35.999z"/>
</g>
</svg>`,

  `<?xml version="1.0" encoding="utf-8"?>
<!-- Star Icon created by pixelbazaar -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="12px" height="12px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g>
	<path fill="#000000" d="M49.302,63.999c-0.664,0-1.332-0.164-1.938-0.5l-15.365-8.498l-15.366,8.498
		c-1.344,0.742-2.993,0.652-4.243-0.23c-1.25-0.883-1.891-2.403-1.645-3.915l2.981-18.261L1.138,28.185
		c-1.047-1.074-1.406-2.641-0.93-4.063c0.477-1.422,1.707-2.457,3.188-2.684l17.237-2.633L28.376,2.31
		c0.661-1.407,2.071-2.301,3.622-2.301s2.961,0.895,3.622,2.301l7.743,16.495l17.237,2.633c1.48,0.227,2.711,1.262,3.188,2.684
		c0.477,1.423,0.117,2.989-0.93,4.063L50.271,41.093l2.98,18.261c0.246,1.512-0.395,3.032-1.645,3.915
		C50.919,63.753,50.11,63.999,49.302,63.999z M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119
		c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712
		L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119
		l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"/>
	<path fill="#f7a600" d="M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119
		c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712
		L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119
		l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"/>
</g>
</svg>`,

  `<?xml version="1.0" encoding="utf-8"?>
<!-- Rocket Icon created by pixelbazaar -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="12px" height="12px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g>
	<path fill="#0a8dbf" d="M56,56H8v-1.07l12-6.855V32c0-7.496,4.492-15.586,12-21.992C39.508,16.414,44,24.504,44,32v16.074
		l11.824,6.754c0.062,0.039,0.121,0.078,0.176,0.117V56z"/>
	<g>
		<path fill="#000000" d="M60,48l-8-4.57c0-4.027,0-8.047,0-11.43c0-12-8-24-20-32C20,8,12,20,12,32c0,3.383,0,7.402,0,11.43L4,48
			c-2.426,1.27-4,2.977-4,5.188V60c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4v-6.812C64,50.977,62.125,49.375,60,48z M56,56H8
			v-1.07l12-6.855V32c0-7.496,4.492-15.586,12-21.992C39.508,16.414,44,24.504,44,32v16.074l11.824,6.754
			c0.062,0.039,0.121,0.078,0.176,0.117V56z"/>
		<circle fill="#000000" cx="32" cy="28" r="4"/>
	</g>
</g>
</svg>`,

  `<?xml version="1.0" encoding="utf-8"?>
<!-- Price Tag Icon created by pixelbazaar -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="12px" height="12px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g>
	<polygon fill="#c9c9c9" points="8,30.344 32,54.344 54.344,32 30.344,8 8,8 	"/>
	<g>
		<path fill="#000000" d="M62.828,29.172l-28-28C34.078,0.422,33.062,0,32,0H4C1.789,0,0,1.789,0,4v28
			c0,1.062,0.422,2.078,1.172,2.828l28,28C29.953,63.609,30.977,64,32,64s2.047-0.391,2.828-1.172l28-28
			C64.391,33.266,64.391,30.734,62.828,29.172z M32,54.344l-24-24V8h22.344l24,24L32,54.344z"/>
		<circle fill="#000000" cx="20" cy="20" r="4"/>
	</g>
</g>
</svg>`,

  `<?xml version="1.0" encoding="utf-8"?>
<!-- Trash Icon created by pixelbazaar -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="12px" height="12px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g>
	<g>
		<path fill="#000000" d="M12,60c0,2.211,1.789,4,4,4h32c2.211,0,4-1.789,4-4V16H12V60z M20,24h24v32H20V24z"/>
		<path fill="#000000" d="M56,4H40c0-2.211-1.789-4-4-4h-8c-2.211,0-4,1.789-4,4H8C5.789,4,4,5.789,4,8s1.789,4,4,4h48
			c2.211,0,4-1.789,4-4S58.211,4,56,4z"/>
	</g>
	<rect x="20" y="24" fill="#3a8019" width="24" height="32"/>
</g>
</svg>`,
];

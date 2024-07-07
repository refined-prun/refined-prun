import { setSettings } from './util';

// Get corp prices asynchronously
// "prices" will contain the prices after the end of the web request
export function getPrices(webData, sheetURL, sheetName) {
  // Return if the web app ID is missing
  if (!sheetURL || !sheetName) {
    return;
  }

  // Create a new XML Http Request
  const xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    console.log('PMMG: Custom Prices Timeout');
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        webData['custom_prices'] = {};

        console.log('PMMG: Retreived Custom Prices');

        // Try to parse data received into prices
        const priceData = JSON.parse(xhr.responseText);
        if (priceData.error) {
          console.log('PMMG: Custom Prices ' + priceData.error);
          return;
        } else if (!priceData.prices) {
          console.log('PMMG: No Data from Custom Prices');
        }

        // Copy data into prices array, preserving the original object
        priceData.prices.forEach(price => {
          webData['custom_prices'][price[0]] = price[1];
        });
        console.log(webData['custom_prices']);
      } catch (SyntaxError) {
        console.log('PMMG: Bad Data from Custom Prices');
      }
    }

    return;
  };

  // Parse the URL
  const sheetID = sheetURL.match(/\/d\/([^/]+)/);
  if (!sheetID || !sheetID[1]) {
    return;
  }

  // Make the request
  const address =
    'https://script.google.com/macros/s/AKfycbwdxGx-OBVslFeXSSv-F_d55X_BTPs20vTMNiT8D9eIAkbcckXh9XAkX9fdBMIv1XrY/exec?id=' +
    sheetID[1] +
    '&sheet=' +
    sheetName;
  xhr.timeout = 10000;

  xhr.open('GET', address, true);
  xhr.send(null);

  return;
}

// Get CX prices asynchronously
// "cxPrices" will contain the prices at the end of the web request
export function getCXPrices(userInfo) {
  // Create a new XML Http Request
  const xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    console.log('PMMG: CX Price Timeout');
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        // Parse the results
        console.log('PMMG: Retreived CX Prices');
        const priceData = JSON.parse(xhr.responseText);

        // The data points for each CX to pull
        const wantedResults = ['AskPrice', 'BidPrice', 'Average', 'AskAvail', 'BidAvail'];
        const CXs = ['AI1', 'CI1', 'CI2', 'IC1', 'NC1', 'NC2']; // All the CXs

        userInfo['PMMG-User-Info']['cx_prices'] = {};

        CXs.forEach(CX => {
          userInfo['PMMG-User-Info']['cx_prices'][CX] = {};
          wantedResults.forEach(wanted => {
            userInfo['PMMG-User-Info']['cx_prices'][CX][wanted] = {};
            priceData.forEach(mat => {
              userInfo['PMMG-User-Info']['cx_prices'][CX][wanted][mat['Ticker']] = mat[CX + '-' + wanted];
            });
          });
        });

        // Date the data
        userInfo['PMMG-User-Info']['cx_prices']['Age'] = Date.now();
        setSettings(userInfo);
      } catch (SyntaxError) {
        console.log('PMMG: Bad Data from Rain Prices');
      }
    }

    return;
  };

  // Send the request
  xhr.timeout = 10000;
  xhr.open('GET', 'https://rest.fnar.net' + '/rain/prices', true);
  xhr.send(null);

  return;
}

// Get FIO burn asynchronously
// "burn" will contain the burn at the end of the web request
export function getBurn(webData, username, apikey) {
  if (!webData['burn']) {
    webData['burn'] = {};
  }

  // If API key or username is missing, abort
  if (!apikey || !username) {
    return;
  }
  webData['burn'][username] = [];

  // Create an XML Http Request
  const xhr = new XMLHttpRequest();

  // On timeout, try again
  xhr.ontimeout = function () {
    console.log('PMMG: FIO Burn Timeout');
    webData['burn'][username] = undefined;
    //getBurn(burn, username, apikey);
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        // Parse the results
        console.log('PMMG: Retreived Burn from FIO');
        const burnData = JSON.parse(xhr.responseText);

        // Copy the data into the burn variable
        burnData.forEach(data => {
          webData['burn'][username].push(data);
        });
      } catch (SyntaxError) {
        console.log('PMMG: Bad Data from FIO');
        webData['burn'][username] = undefined;
      }
    }

    return;
  };

  // Send the request
  xhr.timeout = 20000;
  const address = 'https://rest.fnar.net' + '/fioweb/burn/user/' + username;
  xhr.open('GET', address, true);
  xhr.setRequestHeader('Authorization', apikey);
  xhr.send(null);

  return;
}

// Get FIO group burn asynchronously
// "burn" will contain the burn at the end of the web request
export function getGroupBurn(webData, groupid, apikey) {
  if (!webData['burn']) {
    webData['burn'] = {};
  }
  if (!apikey || !groupid) {
    return;
  }

  // Create an XML Http Request
  const xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    console.log('PMMG: FIO Burn Timeout');
    webData['burn'][groupid] = undefined;
    //getGroupBurn(burn, groupid, apikey);
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        // Parse the results
        console.log('PMMG: Retreived Group Burn from FIO');
        const burnData = JSON.parse(xhr.responseText);
        webData['burn'][groupid] = [];

        // Copy the results to the burn array
        burnData.forEach(data => {
          webData['burn'][groupid].push(data);
        });
      } catch (SyntaxError) {
        console.log('PMMG: Bad Data from FIO');
        webData['burn'][groupid] = undefined;
      }
    }

    return;
  };

  // Send the request
  xhr.timeout = 20000;
  const address = 'https://rest.fnar.net' + '/fioweb/burn/group/' + groupid;
  xhr.open('GET', address, true);
  xhr.setRequestHeader('Authorization', apikey);
  xhr.send(null);

  return;
}

// Get FIO burn settings asynchronously
// "burnSettings" will contain the settings at the end of the web request
export function getBurnSettings(webData, username, apikey) {
  webData['burn_settings'] = [];

  // Push a temporary value to the array to allow for easier parsing
  webData['burn_settings'].push('loading');

  if (!apikey || !username) {
    return;
  }

  // Create an XML Http Request
  const xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    console.log('PMMG: FIO Burn Settings Timeout');
    //getBurnSettings(burnSettings, username, apikey);
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        // Parse the results
        console.log('PMMG: Retreived Burn Settings from FIO');
        webData['burn_settings'][0] = 'loaded';

        const burnData = JSON.parse(xhr.responseText);

        // Copy the settings data
        burnData.forEach(data => {
          webData['burn_settings'].push(data);
        });
      } catch (SyntaxError) {
        console.log('PMMG: Bad Data from FIO');
      }
    }

    return;
  };

  // Send the request
  xhr.timeout = 10000;

  const address = 'https://rest.fnar.net' + '/usersettings/burnrate/' + username;

  xhr.open('GET', address, true);
  xhr.setRequestHeader('Authorization', apikey);
  xhr.send(null);

  return;
}

// Get CXOS asynchronously
// "cxos" will contain the settings at the end of the web request
export function getCXOS(webData, username, apikey) {
  if (!apikey || !username) {
    return;
  }

  // Create an XML Http Request
  const xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    console.log('PMMG: FIO CXOS Timeout');
    //getBurnSettings(burnSettings, username, apikey);
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        // Parse the results
        console.log('PMMG: Retreived CXOS from FIO');
        const cxosData = JSON.parse(xhr.responseText);
        webData['cxos'] = [];

        // Copy the settings data
        cxosData.forEach(data => {
          webData['cxos'].push(data);
        });
      } catch (SyntaxError) {
        console.log('PMMG: Bad Data from FIO');
      }
    }

    return;
  };

  // Send the request
  xhr.timeout = 10000;

  const address = 'https://rest.fnar.net' + '/cxos/' + username;

  xhr.open('GET', address, true);
  xhr.setRequestHeader('Authorization', apikey);
  xhr.send(null);

  return;
}

// Get FIO contract data
// "burnSettings" will contain the settings at the end of the web request
export function getContracts(webData, username, apikey) {
  if (!webData['contracts']) {
    webData['contracts'] = {};
  }

  if (!apikey || !username) {
    // If API key or username is missing, abort
    return;
  }

  webData['contracts'][username] = [];

  // Create an XML Http Request
  const xhr = new XMLHttpRequest();

  // On timeout, try again
  xhr.ontimeout = function () {
    console.log('PMMG: FIO Contract Timeout');
    webData['contracts'][username] = undefined;
    //getContracts(contracts, username, apikey);
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        // Parse the results
        console.log('PMMG: Retreived Contracts from FIO');
        const burnData = JSON.parse(xhr.responseText);

        // Copy the data into the contract variable
        burnData.forEach(data => {
          webData['contracts'][username].push(data);
        });
      } catch (SyntaxError) {
        console.log('PMMG: Bad Data from FIO');
        webData['contracts'][username] = undefined;
      }
    }

    return;
  };

  // Send the request
  xhr.timeout = 20000;

  const address = 'https://rest.fnar.net' + '/contract/allcontracts';

  xhr.open('GET', address);
  xhr.setRequestHeader('Authorization', apikey);
  xhr.send(null);

  return;
}

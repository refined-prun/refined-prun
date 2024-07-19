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

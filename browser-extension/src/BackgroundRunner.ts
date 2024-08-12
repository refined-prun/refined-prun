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
          console.log(`PMMG: Custom Prices ${priceData.error}`);
          return;
        } else if (!priceData.prices) {
          console.log('PMMG: No Data from Custom Prices');
        }

        // Copy data into prices array, preserving the original object
        priceData.prices.forEach(price => {
          webData['custom_prices'][price[0]] = price[1];
        });
        console.log(webData['custom_prices']);
      } catch {
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
  const address = `https://script.google.com/macros/s/AKfycbwdxGx-OBVslFeXSSv-F_d55X_BTPs20vTMNiT8D9eIAkbcckXh9XAkX9fdBMIv1XrY/exec?id=${
    sheetID[1]
  }&sheet=${sheetName}`;
  xhr.timeout = 10000;

  xhr.open('GET', address, true);
  xhr.send(null);

  return;
}

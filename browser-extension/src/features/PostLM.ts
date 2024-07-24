import { Module } from '../ModuleRunner';
import { Selector } from '../Selector';
import { CurrencySymbols } from '../GameProperties';
import { createTextSpan, genericCleanup } from '../util';
import prun from '@src/prun-api/prun';

export class PostLM implements Module {
  private cleanups: Array<() => void> = [];

  private tag = 'pb-post-lm-price';

  cleanup() {
    this.cleanups.forEach((f, i) => {
      f();
      delete this.cleanups[i];
    });
    genericCleanup(this.tag);
  }

  run() {
    Array.from(document.querySelectorAll(Selector.LMPostForm)).forEach(form => {
      const type = Array.from(form.getElementsByClassName('StaticInput__static___Vpn1u0n forms__static___a4biDi4'));
      let shipping = false;
      for (const elem of type) {
        if (elem.textContent == 'SHIPPING') {
          shipping = true;
          break;
        }
      }

      const commodity = document.evaluate(
        "div[label/span[text()='Commodity']]//input",
        form,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLInputElement;

      const amountInput = document.evaluate(
        "div[label/span[text()='Amount']]//input",
        form,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLInputElement;

      const totalPriceInput = document.evaluate(
        "div[label/span[text()='Total price']]//input",
        form,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLInputElement;

      const currencyInput = document.evaluate(
        "div[label/span[text()='Currency']]//select",
        form,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLInputElement;

      const displayElement = createTextSpan('--', this.tag);

      if (shipping && commodity.value != '') {
        totalPriceInput.parentNode!.insertBefore(displayElement, totalPriceInput);
        const calculatePricePerUnit = () => {
          const amount = parseInt(amountInput.value);
          const total = parseFloat(totalPriceInput.value);
          const ticker = prun.materials.getTickerByName(commodity.value);
          if (ticker === undefined) {
            return;
          }
          const matInfo = prun.materials.get(ticker);
          if (matInfo === undefined) {
            return;
          }
          const currency = currencyInput.value;
          let currencySymbol;
          if (currency != undefined) {
            currencySymbol = CurrencySymbols[currency];
          } else {
            currencySymbol = '';
          }
          if (currencySymbol == undefined) {
            currencySymbol = '';
          }
          const unit = matInfo.weight >= matInfo.volume ? 't' : 'm³';
          const weightvolume = Math.max(matInfo.weight, matInfo.volume);

          if (isNaN(weightvolume) || isNaN(total)) {
            displayElement.textContent = '-- t | ' + currencySymbol + '-- / t';
          } else {
            displayElement.textContent =
              (amount * weightvolume).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) +
              ' ' +
              unit +
              ' | ' +
              currencySymbol +
              (total / (amount * weightvolume)).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) +
              ' / ' +
              unit;
          }
        };
        calculatePricePerUnit();
      }
    });
  }
}

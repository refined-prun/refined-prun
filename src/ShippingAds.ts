import { Module } from "./ModuleRunner";
import { Selector } from "./Selector";
import { createTextSpan, genericCleanup } from "./util";
import { CurrencySymbols } from "./GameProperties";

// Adds the rate per unit ton or m^3 to LM ads
export class ShippingAds implements Module {
  private tag = "pb-shipping-ads";

  cleanup() {
    genericCleanup(this.tag);
  }

  run() {
    // Get the text element of every LM ad
    const elements = document.querySelectorAll(Selector.LMCommodityAdText);

    // For each of them, test if it matches a shipping ad then modify it
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const text = element.textContent;
      const matches = text && text.match(/(?:SHIPPING)\s([\d,.]+)t\s\/\s([\d,.]+)m³\s@\s([\d,.]+)\s[A-Z]+\sfrom/);	// Test if the text matches that of a shipping ad

      if (matches && matches.length > 3) {	// If it does...
        const totalCost = matches[3];	// Find the total cost
        const tonnage = parseFloat(matches[1].replace(/[,.]/g, "")) / 100;	// Find the tons, converting it into a float
        const size = parseFloat(matches[2].replace(/[,.]/g, "")) / 100;	// Find the m^3, converting it into a float

        var unit;
        var count;
        if (tonnage > size) {	// Determine whether the price per ton or m^3 is greater, and show that one
          unit = "t";
          count = tonnage;
        } else {
          unit = "m³";
          count = size;
        }

        // Create and add the price per ton/m^3 to the ad
        const totalCents = parseInt(totalCost.replace(/[,.]/g, ""));
        const perItem = (totalCents / count / 100).toLocaleString(undefined, { maximumFractionDigits: 2 });
        var priceSpan;	// No longer actually a span, just a text node we insert the price after
        Array.from(element.childNodes).forEach(node => {
          if (node.nodeValue && node.nodeValue.slice(1) in CurrencySymbols) {
            priceSpan = node;
          }
        });
        if (!priceSpan) {
          return;
        }
        priceSpan.after(createTextSpan(` (${perItem}/${unit})`, this.tag));
      }
    }
    return;
  }
}

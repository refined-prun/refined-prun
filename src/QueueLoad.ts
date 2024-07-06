import { Module } from "./ModuleRunner";
import { Selector } from "./Selector";
import { createTextSpan, genericCleanup, parseDuration } from "./util";

export class QueueLoad implements Module {
  private tag = "pb-queue-load";

  cleanup() {
    genericCleanup(this.tag);
  }

  run() {
    this.calculateQueueLoad();
  }

  /**
   * Find the ETA in a row
   * @param row
   * @private
   */
  private getEtaFromRow(row: Element) {
    const etaCell = row.querySelectorAll("td").item(5);
    if (etaCell) {
      const etaSpan = etaCell.querySelector("span");
      if (etaSpan) {
        const eta = parseDuration(etaSpan.textContent);
        return eta;
      }
    }
    return 0;
  }

  /**
   * Parse all ProdQ orders
   * @private
   */
  private calculateQueueLoad() {
    const tables = Array.from(document.querySelectorAll(Selector.ProdQueueTable));
    tables.forEach(table => {
      const rows = Array.from(table.querySelectorAll("tbody:nth-of-type(2) > tr"));
      const totalTime = rows.reduce<number>((total, row) => {
        const n = this.getEtaFromRow(row);
        return total + n;
      }, 0);
      if (totalTime > 0) {
        rows.forEach(row => {
          const eta = this.getEtaFromRow(row);
          const percent = (eta / totalTime * 100).toLocaleString(undefined, { maximumFractionDigits: 2 });
          const textField = row.querySelectorAll("td").item(6);
          if (textField && eta > 0) {
            const span = createTextSpan(` ${percent}%`, this.tag);
            textField.appendChild(span);
          }
        });
      }
    });
  }
}

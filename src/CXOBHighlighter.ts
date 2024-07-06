import { Module } from "./ModuleRunner";
import { getBuffersFromList } from "./util";

export class CXOBHighlighter implements Module {
  private tag = "pb-cxob-highlight";

  private userInfo;

  constructor(userInfo) {
    this.userInfo = userInfo;
  }


  cleanup() {
    // Nothing to clean up
  }

  run(allBuffers) {
    if (this.userInfo["PMMG-User-Info"] && this.userInfo["PMMG-User-Info"]["company-name"]) {
      const buffers = getBuffersFromList("CXOB ", allBuffers);
      buffers.forEach(buffer => {
        highlightNames(buffer, this.userInfo, this.tag);
      });
    }
  }

}

function highlightNames(buffer, userInfo, tag) {
  const rows = buffer.querySelectorAll("tr");

  rows.forEach(row => {
    if (row.classList.contains(tag)) {
      return;
    }
    row.classList.add(tag);

    if (row.firstChild && row.firstChild.textContent && row.firstChild.textContent == userInfo["PMMG-User-Info"]["company-name"]) {
      Array.from(row.children as HTMLElement[]).forEach(child => {
        child.style.background = "rgba(255, 255, 255, 0.15)";
      });

    }
  });
}

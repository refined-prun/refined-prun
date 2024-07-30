import { Module } from '../ModuleRunner';
import { getBuffersFromList, createTextSpan } from '../util';
import { Selector } from '../Selector';
import { WithStyles, Style } from '../Style';
import { Exchanges } from '../GameProperties';

export class CompactUI implements Module {
  private tag = 'pb-compactui';
  //private username;
  private pmmgSettings;

  //private contracts;
  constructor(pmmgSettings) {
    this.pmmgSettings = pmmgSettings;
    //this.username = username;
  }

  cleanup() {
    //genericCleanup(this.tag);
    //genericUnhide(this.tag);
  }

  run(allBuffers) {
    let buffers = getBuffersFromList('BBL', allBuffers);
    //console.log("Clearning Buildings");
    if (buffers) {
      buffers.forEach(buffer => {
        ClearBuildingLists(buffer, this.pmmgSettings, this.tag);
      });
    }
    buffers = getBuffersFromList('BS', allBuffers);

    if (buffers) {
      buffers.forEach(buffer => {
        ClearBase(buffer, this.tag);
      });
    }
    buffers = getBuffersFromList('CXOS', allBuffers);

    if (buffers) {
      buffers.forEach(buffer => {
        ShortenNames(buffer);
      });
    }
    return;
  }
}

function ShortenNames(buffer) {
  const links = buffer.querySelectorAll(Selector.BufferLink);
  links.forEach(link => {
    if (link.textContent && Exchanges[link.textContent]) {
      link.textContent = Exchanges[link.textContent];
    }
  });

  const headers = buffer.querySelectorAll('th');
  headers.forEach(header => {
    if (header.textContent == 'Exchange') {
      header.textContent = 'Exc.';
    }
  });
}

export function HideElement(element, tag) {
  element.style.display = 'none';
  element.classList.add(`${tag}-hidden`);
}

export function UnHideElement(element, tag) {
  element.style.display = '';
  element.classList.remove(`${tag}-hidden`);
}

export function ClearBuildingLists(buffer, pmmgSettings, tag) {
  const nameElem = buffer.querySelector(Selector.BuildingList);
  if (!nameElem || !nameElem.textContent) return;
  //console.log("Clearning Buildings");

  Array.from(buffer.querySelectorAll(Selector.Divider) as HTMLElement[]).forEach(row => {
    //console.log(row);
    if (row.childNodes.length < 2) {
      const newmenu = document.createElement('span');
      const indicator = document.createElement('div');
      const value = document.createElement('div');
      newmenu.classList.add(...WithStyles(Style.RadioButton));
      indicator.classList.add(...WithStyles(Style.RadioButtonToggled));
      value.classList.add(...WithStyles(Style.RadioButtonValue));
      value.innerText = 'Visible';
      row.appendChild(newmenu);
      newmenu.appendChild(indicator);
      newmenu.appendChild(value);
      newmenu.addEventListener('click', () => {
        if (indicator.classList.contains(Style.RadioButtonToggled[1])) {
          if (row.nextElementSibling) HideElement(row.nextElementSibling as HTMLElement, tag);
          indicator.classList.remove(...WithStyles(Style.RadioButtonToggled));
          indicator.classList.add(...WithStyles(Style.RadioButtonUnToggled));
        } else {
          if (row.nextElementSibling) UnHideElement(row.nextElementSibling as HTMLElement, tag);
          indicator.classList.remove(...WithStyles(Style.RadioButtonUnToggled));
          indicator.classList.add(...WithStyles(Style.RadioButtonToggled));
        }
      });
      //console.log(row.innerText);
      if (row.innerText.includes('Infrastructure')) {
        const event = new CustomEvent('click', { detail: 'fake click' });
        newmenu.dispatchEvent(event);
      }
    }
  });

  (<HTMLTableElement[]>Array.from(nameElem.getElementsByTagName('table'))).forEach((table: HTMLTableElement) => {
    let repaired = false;

    let EstablishRow;

    const buttons = (table.parentNode as HTMLElement).getElementsByTagName('button');
    buttons[1].classList.remove(...WithStyles(Style.ButtonEnabled));
    buttons[1].classList.add(...WithStyles(Style.ButtonDanger));

    Array.from(table.rows).forEach(row => {
      //console.log(text);
      enum Line {
        Established,
        Repair,
        Cost,
        Refund,
        Value,
        Condition,
      }

      const dict = {
        Established: Line.Established,
        'Last repair': Line.Repair,
        'Repair costs': Line.Cost,
        'Reclaimable materials': Line.Refund,
        'Book value': Line.Value,
        Condition: Line.Condition,
      };

      let linetype = Line.Established;

      Array.from(row.getElementsByTagName('td')).forEach(data => {
        //console.log(data.innerText);

        const text = data.innerText;
        //console.log("TEXT " + text);
        //console.log("CLIN " + linetype);
        if (!text) {
          return;
        }
        if (dict[text] != null) {
          linetype = dict[text];
          //console.log("NLIN " + Line[linetype]);

          if (linetype == Line.Established) EstablishRow = row;
        } else if (text == '--') HideElement(row, tag);
        else if (text == 'none') HideElement(row, tag);
        else {
          text.split(' ').forEach(word => {
            const value = parseFloat(word);
            if (!Number.isNaN(value)) {
              //console.log(value);
              if (linetype == Line.Repair) repaired = true;
              if (linetype == Line.Condition || linetype == Line.Established || linetype == Line.Repair) {
                const bar = data.getElementsByTagName('progress');
                if (value > 180) HideElement(row, tag);
                else if (bar && bar.length > 0) {
                  //console.log(bar);
                  bar[0].classList.remove(...WithStyles(Style.ProgressBarColors));
                  bar[0].value = value;
                  let progress = bar[0].value / bar[0].max;
                  if (linetype == Line.Condition) {
                    if (value > 98 && buttons[0].classList.contains(Style.ButtonEnabled[0])) {
                      buttons[0].classList.remove(...WithStyles(Style.ButtonEnabled));
                      buttons[0].classList.add(...WithStyles(Style.ButtonDanger));
                      //buttons[0].removeEventListener()
                    }
                    if (progress > 0.9) bar[0].classList.add(...WithStyles(Style.ProgressBarGood));
                    else if (progress > 0.8) bar[0].classList.add(...WithStyles(Style.ProgressBarWarning));
                    else if (progress > 0) bar[0].classList.add(...WithStyles(Style.ProgressBarDanger));
                  } else {
                    bar[0].value = 180 - value;
                    progress = bar[0].value / bar[0].max;
                    const threshold = pmmgSettings['PMMGExtended']['repair_threshold']
                      ? pmmgSettings['PMMGExtended']['repair_threshold'] / 180.0
                      : 70.0 / 180.0;
                    if (progress > 0.75) bar[0].classList.add(...WithStyles(Style.ProgressBarGood));
                    else if (progress > threshold) bar[0].classList.add(...WithStyles(Style.ProgressBarWarning));
                    else if (progress > 0) bar[0].classList.add(...WithStyles(Style.ProgressBarDanger));
                  }
                } else {
                  //console.log(row);
                  const newbar = document.createElement('progress');

                  //console.log(newbar.classList);
                  newbar.classList.add(...WithStyles(Style.ProgressBar));
                  if (linetype == Line.Condition) newbar.max = 100;
                  else newbar.max = 180;
                  data.insertBefore(newbar, data.firstChild);
                }
              } else if (linetype == Line.Value && value < 2000) HideElement(row, tag);
              else if (value <= 1) HideElement(row, tag);
            }
          });
        }
      });

      if (repaired) HideElement(EstablishRow, tag);
    });
  });
}

export function ClearBase(buffer, tag) {
  const elements = Array.from(buffer.querySelectorAll(Selector.HeaderRow) as HTMLElement[]);
  if (elements.length == 0) {
    return;
  }

  elements[0].style.display = 'none'; // Hide the "area" row
  const areaBar = elements[0].getElementsByTagName('progress')[0];
  if (!areaBar) {
    return;
  }
  const areaBarCopy = areaBar.cloneNode(true) as HTMLElement;
  areaBarCopy.classList.add(tag);
  const editdiv = elements[1].getElementsByTagName('div')[0] as HTMLElement;
  if ((editdiv.firstChild as HTMLElement).classList.contains(tag) && editdiv.firstChild) {
    editdiv.removeChild(editdiv.firstChild);
  }
  editdiv.insertBefore(areaBarCopy, editdiv.lastChild);
  //editdiv.innerHTML = areaBarCopy.outerHTML + editdiv.getElementsByTagName("div")[0].outerHTML;

  (<HTMLTableElement[]>Array.from(buffer.getElementsByTagName('table'))).forEach((table: HTMLTableElement) => {
    Array.from(table.rows).forEach(row => {
      let data = Array.from(row.getElementsByTagName('td'));

      /*enum Worker {
          Pioneers = "Pioneers",
          Settlers = "Settlers",
          Technicians = "Technicians",
          Engineers = "Engineers",
          Scientists = "Scientists"
      }*/

      if (data.length == 0) {
        data = Array.from(row.getElementsByTagName('th'));
        data[2].innerText = 'Current';
      } else {
        //var linetype = Worker[data[0].innerText]
        const required = parseFloat(data[1].innerText);
        const workforce = parseFloat(data[2].innerText.split(' ')[0]);
        //var newworkers = parseFloat(data[2].innerText.split(" ")[1].slice(1,-1));
        const capacity = parseFloat(data[3].innerText);

        const bar = data[4].getElementsByTagName('div')[0];
        const barValue = bar.getElementsByTagName('progress')[0].title;
        if (bar.lastChild && (bar.lastChild as HTMLElement).classList.contains(tag)) {
          bar.removeChild(bar.lastChild);
        }
        bar.appendChild(createTextSpan(barValue, tag));
        //bar.innerHTML =  bar.getElementsByTagName("progress")[0].outerHTML + bar.getElementsByTagName("progress")[0].title
        bar.style.display = 'flex';
        bar.style.flexDirection = 'row';
        bar.style.justifyContent = 'left';

        if (required < 1 && capacity < 1 && workforce < 1) HideElement(row, tag);
      }
    });
  });
}

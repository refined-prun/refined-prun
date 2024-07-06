import { Module } from "./ModuleRunner";
import { Selector } from "./Selector";
import { WithStyles, Style } from "./Style";
import { genericCleanup, createNode } from "./util";

export class ScreenUnpack implements Module {
  private tag = "pb-screens";
  private buttonTag = "pb-screen-button";
  private exclusions: string[];
  private eventAbortSignal: AbortController;

  cleanup(full: boolean = false) {
    full && genericCleanup(this.tag);
    full && this.eventAbortSignal.abort();
  }

  constructor(exclusions: string[] | undefined = undefined) {
    exclusions = exclusions == undefined ? [] : exclusions;
    this.exclusions = [];
    exclusions.forEach((ex) => {
      this.exclusions.push(ex.toUpperCase());
    });
  }

  run() {
    const navbar = document.getElementById(Selector.ScreenControls);
    if (navbar == null) {
      return;
    }
    if (this.isInitialized()) {
      return;
    }
    this.eventAbortSignal = new AbortController();

    navbar.appendChild(this.createSpacer());

    const screens = this.getScreensAndAttachDropdownMenuListeners();
    screens.forEach((screen) =>
      this.createScreenButton(screen.Name, screen.Link)
    );

    // Highlight the current screen
    const screenNameElem = document.querySelector(Selector.ScreenName);
    const screenName =
      screenNameElem && screenNameElem.textContent
        ? screenNameElem.textContent
        : "";
    this.updateHighlight(screenName);
  }

  isInitialized() {
    return document.getElementsByClassName(this.tag).length > 0;
  }

  getScreensAndAttachDropdownMenuListeners() {
    const navbar = document.getElementById(Selector.ScreenControls);
    if (navbar == null) {
      return [];
    }
    const menu = navbar.children[1].children[1];
    const links = [] as { Name: string; Link: string }[];

    // Get the links from the dropdown menu
    (Array.from(menu.children) as HTMLElement[]).forEach(
      (dropdownMenuElement) => {
        if (dropdownMenuElement.children.length !== 4) {
          return;
        }
        if (
          !this.exclusions.includes(
            dropdownMenuElement.children[1].innerHTML.toUpperCase()
          )
        ) {
          links.push({
            Name: dropdownMenuElement.children[1].innerHTML,
            Link: (dropdownMenuElement.children[1] as HTMLAnchorElement).href,
          });
        }
        // Attach listener to the dropdown menu to switch the highlight
        dropdownMenuElement.children[1].addEventListener(
          "click",
          () => {
            this.updateHighlight(dropdownMenuElement.children[1].innerHTML);
          },
          { signal: this.eventAbortSignal.signal }
        );
      }
    );
    return links;
  }

  createSpacer() {
    const spacerDiv = document.createElement("div");
    spacerDiv.classList.add(this.tag);
    spacerDiv.style.display = "inline-block";
    spacerDiv.style.width = "5px";
    return spacerDiv;
  }

  createScreenButton(screenName: string, link: string) {
    const navbar = document.getElementById(Selector.ScreenControls);
    if (navbar == null) {
      return createNode("");
    }
    const navbarItemClassList = navbar.children[2].classList;
    const nbitMainClassList = navbar.children[2].children[0].classList;
    const nbitUnderlineClassList = navbar.children[2].children[1].classList;
    const button = `<a class="${navbarItemClassList}" href="${link}">
                        <div class="${nbitMainClassList}" style="color: inherit" >${screenName}</div>
                        <div class="${nbitUnderlineClassList}"></div>
                    </a>`;
    const buttonElem = createNode(button) as HTMLElement;
    buttonElem.classList.add(this.tag);
    buttonElem.classList.add(this.buttonTag);

    buttonElem.addEventListener("click", () => {
      this.updateHighlight(buttonElem.children[0].textContent ?? "");
    });
    navbar.appendChild(buttonElem);
  }

  updateHighlight(screenName: string) {
    screenName = screenName.toUpperCase();
    const navbar = document.getElementById(Selector.ScreenControls);
    if (navbar == null) {
      return;
    }
    const buttons = navbar.getElementsByClassName(this.buttonTag);
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as HTMLElement;
      if (button.children[0].textContent?.toUpperCase() == screenName) {
        button.children[1].className = "";
        button.children[1].classList.add(
          ...WithStyles(Style.ScreenUnderlineToggled)
        );
      } else {
        button.children[1].className = "";
        button.children[1].classList.add(
          ...WithStyles(Style.ScreenUnderlineUntoggled)
        );
      }
    }
  }
}

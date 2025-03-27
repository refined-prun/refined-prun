import { castArray } from '@src/utils/cast-array';

let rules: { [id: string]: string } = {};

export function loadRefinedPrunCss() {
  const css = document.getElementById('refined-prun-css')!;
  rules = JSON.parse(css.textContent!);
  css.textContent = null;
}

export function applyCssRule(selectors: Arrayable<string>, sourceClass: string): void;
export function applyCssRule(
  commands: Arrayable<string>,
  selectors: Arrayable<string>,
  sourceClass: string,
): void;

export function applyCssRule(arg1: Arrayable<string>, arg2: Arrayable<string>, arg3?: string) {
  if (!features.current) {
    throw new Error('Cannot apply css rules outside of feature init');
  }
  let commands: string[];
  let selectors: string[];
  let sourceClass: string;
  if (arguments.length === 2) {
    commands = [];
    selectors = castArray(arg1);
    sourceClass = arg2 as string;
  } else {
    commands = castArray(arg1);
    selectors = castArray(arg2);
    sourceClass = arg3 as string;
  }

  if (!sourceClass) {
    throw new Error('Source class is undefined');
  }
  const sourceSelector = '.' + sourceClass;
  const match = rules[sourceSelector];
  if (!match) {
    throw new Error(`Failed to find css selector ${sourceSelector}`);
  }
  if (commands.length > 0) {
    for (const selector of selectors) {
      for (const command of commands) {
        applyRawCssRule(match.replace(sourceSelector, `${selectCommand(command)} ${selector}`));
      }
    }
  } else {
    for (const selector of selectors) {
      applyRawCssRule(match.replace(sourceSelector, selector));
    }
  }
}

let currentSheet = {
  id: '',
  textContent: '',
};
const sheets: (typeof currentSheet)[] = [];

export function applyRawCssRule(rule: string) {
  if (currentSheet.id !== features.current) {
    queueSheetAppend();
    currentSheet = {
      id: features.current!,
      textContent: '',
    };
    sheets.push(currentSheet);
  } else {
    currentSheet.textContent += '\n\n';
  }
  currentSheet.textContent += rule;
}

function queueSheetAppend() {
  if (sheets.length > 0) {
    return;
  }
  queueMicrotask(() => {
    for (const sheet of sheets) {
      const style = document.createElement('style');
      style.id = `rp-css-${sheet.id}`;
      style.textContent = `.refined-prun ${wrapInBrackets(sheet.textContent)}`;
      document.head.appendChild(style);
    }
  });
}

function wrapInBrackets(text: string) {
  return `{\n  ${indent(text)}\n}`;
}

function indent(text: string) {
  return text.replaceAll('\n', '\n  ');
}

function selectCommand(command: string) {
  return `.${C.TileFrame.frame}[data-rp-command='${command}']`;
}

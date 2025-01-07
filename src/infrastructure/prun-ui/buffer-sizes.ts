import { userData } from '@src/store/user-data';

let matchers: [RegExp, number, number][] | null = null;

watch(userData, () => (matchers = null), { immediate: true, deep: true });

export function matchBufferSize(command: string): [number, number] | undefined {
  if (!matchers) {
    matchers = userData.settings.buffers
      .filter(x => x[0] && typeof x[1] === 'number' && typeof x[2] === 'number')
      .map(x => {
        // '*' is not a valid regex.
        const rule = x[0] === '*' ? '.*' : x[0];
        return [new RegExp(rule.toUpperCase()), x[1], x[2]];
      });
  }
  const commandUpper = command.toUpperCase().trim();
  for (const matcher of matchers) {
    const match = commandUpper.match(matcher[0]);
    if (match) {
      return [matcher[1], matcher[2]];
    }
  }

  if (commandUpper === 'PLI' || commandUpper === 'SYSI') {
    // PLI and SYSI without parameters have the default buffer size.
    return [450, 300];
  }
  const start = commandUpper.split(' ')[0];
  return defaultBufferSizes[start];
}

const defaultBufferSizes = {
  ADM: [380, 550],
  BBC: [500, 450],
  BLU: [550, 600],
  BS: [610, 300],
  BSC: [550, 620],
  BTF: [570, 700],
  BUI: [500, 400],
  COGC: [500, 580],
  CONT: [600, 400],
  CONTD: [450, 550],
  CONTS: [550, 300],
  CORPARC: [350, 550],
  CORPNP: [450, 430],
  CORPP: [460, 640],
  CX: [550, 600],
  CXL: [600, 180],
  CXM: [625, 300],
  CXOS: [750, 300],
  CXPO: [450, 310],
  FLT: [650, 180],
  GOV: [470, 550],
  HQ: [450, 600],
  INV: [530, 250],
  LEAD: [700, 400],
  LM: [500, 580],
  LMA: [425, 370],
  LMOS: [700, 420],
  LMP: [450, 500],
  MAT: [500, 400],
  MOTS: [600, 450],
  MU: [512, 512],
  NOTS: [425, 625],
  PLI: [450, 600],
  POPI: [550, 300],
  POPID: [460, 500],
  POPR: [515, 400],
  PROD: [400, 500],
  PRODCO: [415, 600],
  PRODQ: [650, 300],
  SHP: [450, 450],
  SHY: [450, 450],
  STEAM: [300, 450],
  STNS: [400, 280],
  SYSI: [600, 600],
  WAR: [400, 580],
  WF: [710, 300],
};

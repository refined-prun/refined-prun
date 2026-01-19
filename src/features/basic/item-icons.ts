import fa from '@src/utils/font-awesome.module.css';
import $style from './item-icons.module.css';
import { applyRawCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { objectKeys } from 'ts-extras';
import { sanitizeCategoryName } from '@src/infrastructure/prun-ui/item-tracker';

function init() {
  const container = C.ColoredIcon.container;
  const label = C.ColoredIcon.label;

  applyCssRule(`.${container}`, $style.container);
  applyCssRule(`.${container}:before`, fa.solid);
  applyCssRule(`.${label}`, $style.label);
  applyCssRule(`.${label}:before`, fa.solid);

  for (const category of objectKeys(categories)) {
    applyIconRules(`.rp-category-${sanitizeCategoryName(category)}`, categories[category]);
  }
  for (const material of objectKeys(materials)) {
    applyIconRules(`.rp-ticker-${material}`, materials[material]);
  }
}

function applyIconRules(root: string, icon: Icon) {
  const selector = `.${C.ColoredIcon.container}${root}:before `;
  const rule = createRule(icon, 2.2);
  if (rule) {
    applyRawCssRule(selector + rule);
  }
  if (typeof icon !== 'string') {
    const detail = icon[1].detail;
    if (detail !== undefined) {
      const selector = `${root} .${C.ColoredIcon.label}:before `;
      const rule = createRule(detail, 1);
      if (rule) {
        applyRawCssRule(selector + rule);
      }
    }
  }
}

function createRule(icon: Icon, baseFontSize: number) {
  const hasOptions = typeof icon !== 'string';
  const character = hasOptions ? icon[0] : icon;
  let fontSize = iconFontSize[character];
  let contents = '{';
  let hasRules = false;
  const addRule = (rule: string) => {
    contents += `  ${rule};`;
    hasRules = true;
  };
  if (hasOptions) {
    const options = icon[1];
    if (options.opacity !== undefined) {
      addRule(`opacity: ${options.opacity}`);
    }
    if (options.fontSize !== undefined) {
      fontSize = options.fontSize;
    }
    if (options.regular) {
      addRule(`font-weight: 400`);
    }
    if (options.flip) {
      addRule(`transform: scaleX(-1)`);
    }
  }
  if (character) {
    addRule(`content: '\\${character}'`);
  }
  if (fontSize !== undefined) {
    addRule(`font-size: calc(${fontSize} * ${baseFontSize}em)`);
  }
  contents += ' }';
  return hasRules ? contents : undefined;
}

type Icon = string | [string, IconOptions];

interface IconOptions {
  opacity?: number;
  fontSize?: number;
  regular?: boolean;
  flip?: boolean;
  detail?: Icon;
}

const iconFontSize: Record<string, number> = {
  f5d2: 1.1,
  f14e: 1.1,
  f3ed: 1.2,
};

const categories: Record<string, Icon> = {
  'agricultural products': 'f4d8',
  alloys: 'f219',
  chemicals: 'f492',
  'consumable bundles': 'f466',
  'construction materials': '',
  'construction parts': '',
  'construction prefabs': '',
  'consumables (basic)': '',
  'consumables (luxury)': '',
  drones: 'f544',
  'electronic devices': '',
  'electronic parts': '',
  'electronic pieces': '',
  'electronic systems': 'f390',
  elements: circle(),
  'energy systems': '',
  fuels: '',
  gases: 'f0c2',
  infrastructure: 'f085',
  liquids: '',
  'medical equipment': '',
  metals: 'f0c8',
  minerals: 'f3a5',
  ores: 'e508',
  plastics: '',
  'ship engines': '',
  'ship kits': '',
  'ship parts': '',
  'ship shields': shield(),
  'software components': 'f0c7',
  'software systems': 'f0c7',
  'software tools': 'f0c7',
  textiles: 'f70e',
  'unit prefabs': '',
  utility: '',
};

const materials: Record<string, Icon> = {
  AAR: 'f7c0',
  ABH: 'e583',
  ACS: 'f863',
  ADE: 'e569',
  ADR: 'f0f0',
  ADS: 'f028',
  AEF: 'e58a',
  AEN: 'f135',
  AFP: 'f52f',
  AFR: 'f453',
  AGS: 'f6c0',
  AHP: shield(),
  AIR: 'f863',
  ALE: 'f0fc',
  ANZ: 'e4f1',
  APT: shield('f7e4'),
  ARP: shield('f7b9'),
  ASE: 'f0c1',
  ATA: ['f0c8', { regular: true }],
  ATP: shield('f7e4'),
  AWF: 'f0b0',
  AWH: shield(['f753', { fontSize: 1 }]),
  BAC: 'e059',
  BAI: 'f5dc',
  BBH: 'e583',
  BCO: 'e55e',
  BDE: 'e569',
  BFP: 'f52f',
  BFR: 'f453',
  BGC: 'f1e6',
  BGS: 'f6c0',
  BHP: shield(),
  BID: 'e54d',
  BL: 'e06e',
  BLE: 'e519',
  BMF: ['f233', { fontSize: 1.2 }],
  BND: 'f462',
  BPT: shield('f7e4'),
  BR1: 'f120',
  BR2: 'f120',
  BRP: shield('f7b9'),
  BRS: 'f120',
  BSC: 'f030',
  BSE: 'f0c1',
  BSU: 'f4d8',
  BTA: ['f0c8', { regular: true }],
  BTS: 'e059',
  BWH: shield(['f753', { fontSize: 1 }]),
  BWS: 'f109',
  CAF: 'e5aa',
  CAP: 'f5fd',
  CBL: ['f5df', { detail: 'f240' }],
  CBM: ['f5df', { detail: 'f241' }],
  CBS: ['f5df', { detail: 'f243' }],
  CC: 'f76b',
  CCD: ['', { detail: 'e4f8' }],
  CD: 'f3fa',
  CF: ['', { detail: 'f7e4' }],
  CHA: 'f0f2',
  COF: 'f7b6',
  COM: 'f2a0',
  CPU: ['f2db', { detail: ['f2dc', { regular: true }] }],
  CQL: 'f4b8',
  CQM: 'f236',
  CQS: 'e525',
  CQT: 'e072',
  CRU: 'f2dc',
  CST: ['f2dc', { regular: true }],
  CTF: ['', { detail: 'f7e4' }],
  DA: 'e13a',
  DCL: ['f10a', { fontSize: 1.2 }],
  DCM: 'f10a',
  DCS: ['f10a', { fontSize: 0.8 }],
  DD: 'f1c0',
  DDT: 'f1fb',
  DEC: 'f302',
  DIS: 'f26c',
  DOU: 'f085',
  DRF: 'f5cb',
  DV: 'f200',
  DW: 'e4c5',
  EDC: 'f7c2',
  EES: circle('f7b9'),
  ENG: 'f135',
  EPO: 'e57c',
  ES: circle('f7b9'),
  ETC: circle('f7b9'),
  EXO: 'f85e',
  FAN: 'f863',
  FC: 'f2cc',
  FF: 'f453',
  FFC: 'e4f6',
  FIM: 'e2eb',
  FIR: 'f7b9',
  FLO: 'f4ba',
  FLP: 'e006',
  FLX: 'f5bc',
  FOD: 'e55a',
  FSE: 'f135',
  FUN: 'f522',
  GC: 'f134',
  GCH: 'e4f1',
  GEN: 'f135',
  GIN: 'f7a0',
  GL: ['f0c8', { regular: true }],
  GNZ: 'e4f1',
  GRN: 'e2cd',
  GV: 'e005',
  H: ['f185', { regular: true }],
  H2O: 'f043',
  HAB: 'f015',
  HAM: 'f7e5',
  HCB: ['f468', { fontSize: 1.2 }],
  HCC: 'e55b',
  HCP: 'f1bb',
  HD: 'f26c',
  HE: 'f185',
  HE3: 'f185',
  HER: 'f816',
  HEX: 'f7a0',
  HHP: shield(),
  HMS: 'f807',
  HNZ: 'e4f1',
  HOG: 'f530',
  HOP: 'e517',
  HPC: 'f3cd',
  HPR: 'f5d2',
  HSE: 'f0c1',
  HSS: 'f4fb',
  HTE: 'f135',
  HYR: 'f5d2',
  IDC: 'f7c2',
  IMM: 'f1c0',
  IND: 'f5bd',
  INS: ['f5bd', { detail: 'f2dc' }],
  KOM: 'e516',
  KV: ['', { detail: 'f132' }],
  LBH: 'e583',
  LC: 'f82f',
  LCB: ['f468', { fontSize: 1.1 }],
  LD: 'f1c0',
  LDE: 'e569',
  LDI: 'f04b',
  LES: ['f043', { detail: 'f7b9' }],
  LFE: 'e4f6',
  LFL: ['f1b3', { fontSize: 1.1 }],
  LFP: 'f52f',
  LHP: shield(),
  LIS: 'e591',
  LIT: 'f0eb',
  LOG: 'f126',
  LSE: 'f0c1',
  LSL: ['f52f', { fontSize: 1.1 }],
  LTA: ['f0c8', { regular: true }],
  LU: 'f610',
  MB: 'f2db',
  MCB: 'f468',
  MCG: 'e58a',
  MEA: 'e4c6',
  MED: 'f469',
  MFE: ['e4f6', { fontSize: 0.9 }],
  MFK: 'f0ad',
  MFL: 'f1b3',
  MGC: 'e58a',
  MHL: 'f0eb',
  MHP: 'f025',
  MLI: 'f5dc',
  MPC: 'f2db',
  MSL: 'f52f',
  MTC: 'e571',
  MTP: 'f805',
  MWF: 'f551',
  N: 'f72e',
  NCS: 'e571',
  NF: 'f6ff',
  NFI: 'f7e5',
  NG: ['f0c8', { regular: true, detail: 'f5c7' }],
  NN: 'f5dc',
  NOZ: 'e4f1',
  NR: 'e57b',
  NS: 'f5a7',
  NST: 'f46b',
  NV1: 'f5a0',
  NV2: 'f5a0',
  O: 'f72e',
  OFF: 'e5af',
  OS: 'f802',
  OVE: 'f553',
  PCB: 'f7c4',
  PDA: 'f3cd',
  PE: 'f1b8',
  PFE: 'f619',
  PG: ['f2a1', { fontSize: 0.9 }],
  PIB: 'f094',
  PK: 'f490',
  POW: 'f5df',
  PPA: 'f5a7',
  PSH: shield('f625'),
  PSL: ['e571', { fontSize: 1.2 }],
  PSM: 'e571',
  PSS: ['e571', { fontSize: 0.8 }],
  PT: 'f7d9',
  PWO: 'e085',
  QCR: 'f5d2',
  RAD: 'f8ef',
  RAG: 'f7b9',
  RAM: 'f538',
  RAT: 'f7ec',
  RBH: 'e583',
  RCO: 'e562',
  RCS: 'f390',
  RCT: 'f5d2',
  RDE: 'e569',
  RDL: ['f544', { detail: 'f7d9' }],
  RDS: ['f544', { detail: 'f7d9' }],
  REA: 'e4f3',
  RED: ['', { detail: 'f4c4' }],
  REP: 'f552',
  RG: ['f0c8', { regular: true }],
  RHP: shield(),
  ROM: 'f0a0',
  RSE: 'f0c1',
  RSH: shield('f7b9'),
  RSI: 'e562',
  RTA: ['f0c8', { regular: true }],
  SA: ['f002', { flip: true }],
  SAL: 'e473',
  SAR: 'f1e5',
  SC: 'f471',
  SCB: ['f468', { fontSize: 0.9 }],
  SCN: 'f566',
  SDR: ['', { detail: 'f21e' }],
  SEA: 'f5bd',
  SEN: 'f491',
  SEQ: 'f48e',
  SF: 'f52f',
  SFE: ['e4f6', { fontSize: 0.8 }],
  SFK: 'f54a',
  SFL: ['f1b3', { fontSize: 0.8 }],
  SNM: 'f279',
  SOI: 'e52d',
  SOL: ['f84c', { regular: false }],
  SP: 'f5ba',
  SRD: ['', { detail: 'f7d9' }],
  SRP: shield('f7b9'),
  SSC: 'f0c1',
  SSL: ['f52f', { fontSize: 0.8 }],
  STR: 'f193',
  STS: 'f5cd',
  SU: 'f21e',
  SUD: ['', { detail: 'f1e5' }],
  SUN: 'f807',
  SWF: ['f551', { fontSize: 0.9 }],
  TAC: 'f05b',
  TC: circle('f7b9'),
  TCB: ['f468', { fontSize: 0.75 }],
  TCL: 'f0c3',
  TCS: circle('f7b9'),
  TCU: 'f487',
  THF: ['f043', { detail: 'f7e4' }],
  THP: shield('f7e4'),
  TK: ['', { detail: 'f132' }],
  TPU: 'f1ec',
  TRA: 'f519',
  TRN: 'f2db',
  TRU: 'e586',
  TSH: shield('f7e4'),
  TUB: 'f493',
  UTS: 'f7d9',
  VCB: ['f468', { fontSize: 1.1 }],
  VEG: 'f5d1',
  VF: 'f0a3',
  VFT: ['f52f', { detail: 'f0a3' }],
  VG: 'e06a',
  VIT: 'f517',
  VOE: 'f135',
  VOR: 'f5d2',
  VSC: ['f468', { fontSize: 0.8 }],
  WAI: 'f5dc',
  WCB: ['f468', { fontSize: 1.1 }],
  WIN: 'f72f',
  WM: 'f2d2',
  WOR: 'f53f',
  WR: 'e4b5',
  WS: 'f610',
};

function circle(detail?: Icon): Icon {
  return detail !== undefined ? ['f111', { detail }] : 'f111';
}

function shield(detail?: Icon): Icon {
  return detail !== undefined ? ['f132', { detail }] : 'f132';
}

features.add(import.meta.url, init, 'Adds icons to items.');

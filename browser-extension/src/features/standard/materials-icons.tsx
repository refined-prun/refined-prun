import fa from '@src/utils/font-awesome.module.css';
import classes from './materials-icons.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import {
  applyCssRule,
  applyRawCssRule,
  endCssAtScope,
  startCssAtScope,
} from '@src/infrastructure/prun-ui/refined-prun-css';
import { objectKeys } from 'ts-extras';

function init() {
  const container = PrunCss.ColoredIcon.container;
  const label = PrunCss.ColoredIcon.label;

  applyCssRule(`.${container}`, classes.container);
  applyCssRule(`.${container}:before`, fa.fa);
  applyCssRule(`.${container}:before`, classes.main);
  applyCssRule(`.${label}:before`, fa.fa);
  applyCssRule(`.${label}:before`, classes.detail);

  startCssAtScope('@container (height < 24px)');
  applyCssRule(`.${container}:before`, classes.hide);
  applyCssRule(`.${label}:before`, classes.hide);
  endCssAtScope();

  for (const category of objectKeys(categories)) {
    const icon = categories[category];
    const selector = `.${container}[data-rp-category='${category}']:before `;
    const rule = createRule(icon, 2.2);
    if (rule) {
      applyRawCssRule(selector + rule);
    }
    if (typeof icon !== 'string') {
      const detail = icon[1].detail;
      if (detail) {
        const selector = `.${container}[data-rp-category='${category}'] .${label}:before `;
        const rule = createRule(detail, 1);
        if (rule) {
          applyRawCssRule(selector + rule);
        }
      }
    }
  }
  for (const material of objectKeys(materials)) {
    const icon = materials[material];
    const selector = `.${container}[data-rp-ticker='${material}']:before `;
    const rule = createRule(icon, 2.2);
    if (rule) {
      applyRawCssRule(selector + rule);
    }
    if (typeof icon !== 'string') {
      const detail = icon[1].detail;
      if (detail) {
        const selector = `.${container}[data-rp-ticker='${material}'] .${label}:before `;
        const rule = createRule(detail, 1);
        if (rule) {
          applyRawCssRule(selector + rule);
        }
      }
    }
  }
}

function createRule(icon: Icon, baseFontSize: number) {
  const hasOptions = typeof icon !== 'string';
  const character = hasOptions ? icon[0] : icon;
  let fontSize = iconFontSize[character];
  let rule = '{';
  let hasRules = false;
  if (hasOptions) {
    const options = icon[1];
    const opacity = options.opacity ?? (options.detail ? 0.15 : undefined);
    if (opacity) {
      rule += ` opacity: ${opacity};`;
      hasRules = true;
    }
    if (options.fontSize) {
      fontSize = options.fontSize;
    }
  }
  if (character) {
    rule += ` content: '\\${character}';`;
    hasRules = true;
  }
  if (fontSize) {
    rule += ` font-size: calc(${fontSize} * ${baseFontSize}em);`;
    hasRules = true;
  }
  rule += ' }';
  return hasRules ? rule : undefined;
}

type Icon = string | [string, { opacity?: number; fontSize?: number; detail?: Icon }];

const iconFontSize: Record<string, number> = {
  f5d2: 1.1,
  f14e: 1.1,
  f3ed: 1.2,
};

const categories: Record<string, Icon> = {
  'agricultural products': 'f4d8',
  alloys: 'f219',
  chemicals: 'f492',
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
  elements: circle(''),
  'energy systems': '',
  fuels: '',
  gases: 'f0c2',
  liquids: '',
  'medical equipment': '',
  metals: 'f0c8',
  minerals: 'f3a5',
  ores: 'e508',
  plastics: '',
  'ship engines': '',
  'ship kits': '',
  'ship parts': '',
  'ship shields': shield(''),
  'software components': 'f0c7',
  'software systems': 'f0c7',
  'software tools': 'f0c7',
  textiles: '',
  'unit prefabs': '',
  utility: '',
};

const materials: Record<string, Icon> = {
  ARP: shield('f7b9'),
  RSH: shield('f7b9'),
  BRP: shield('f7b9'),
  SRP: shield('f7b9'),
  APT: shield('f7e4'),
  BPT: shield('f7e4'),
  TSH: shield('f7e4'),
  ATP: shield('f7e4'),
  THP: shield('f7e4'),
  THF: ['f043', { opacity: 0.25, detail: 'f7e4' }],
  PSH: shield('f625'),
  AWH: shield(['f753', { fontSize: 1 }]),
  BWH: shield(['f753', { fontSize: 1 }]),
  AAR: 'f7c0',
  ABH: ['e583', { detail: '2a' }],
  ACS: 'f863',
  ADE: ['e569', { detail: '2a' }],
  ADR: 'f0f0',
  ADS: 'f028',
  AEF: 'e58a',
  AEN: 'f135',
  AFP: 'f52f',
  AFR: 'f453',
  AGS: 'f6c0',
  AHP: shield('2a'),
  AIR: 'f863',
  ALE: 'f0fc',
  ANZ: 'e4f1',
  ASE: ['f0c1', { detail: '2a' }],
  ATA: ['f2d0', { detail: '2a' }],
  AWF: 'f0b0',
  BAC: 'e059',
  BAI: 'f5dc',
  BBH: 'e583',
  BCO: 'e55e',
  BDE: 'e569',
  BFP: 'f52f',
  BFR: 'f453',
  BGC: 'f1e6',
  BGS: 'f6c0',
  BHP: shield(''),
  BID: 'f6fa',
  BL: 'e06e',
  BLE: 'e519',
  BMF: 'f233',
  BND: 'f462',
  BR1: 'f120',
  BR2: 'f120',
  BRS: 'f120',
  BSC: 'f030',
  BSE: 'f0c1',
  BTA: 'f2d0',
  BTS: 'e059',
  BWS: 'f109',
  CAP: 'f5fd',
  CBL: ['f5df', { detail: 'f240' }],
  CBM: ['f5df', { detail: 'f242' }],
  CBS: ['f5df', { detail: 'f243' }],
  CC: 'f76b',
  CD: 'f3fa',
  CF: 'f7e5',
  CHA: 'f0f2',
  COF: 'f7b6',
  COM: 'f2a0',
  COT: 'f7e5',
  RCO: 'f7e5',
  RSI: 'f7e5',
  CQL: 'f4b8',
  CQM: 'f236',
  CQS: 'e525',
  CQT: 'e072',
  CRU: 'f2dc',
  CST: 'f2dc',
  CTF: 'f7e5',
  DA: 'e13a',
  DCL: ['f10a', { fontSize: 1.2 }],
  DCM: 'f10a',
  DCS: ['f10a', { fontSize: 0.8 }],
  DD: 'f1c0',
  DEC: 'f302',
  DIS: 'f26c',
  DOU: 'f085',
  DV: 'f200',
  DW: 'e4c5',
  EDC: 'f7c2',
  ES: circle('f7b9'),
  EES: circle('f7b9'),
  ENG: 'f135',
  EPO: 'e57c',
  ETC: circle('f7b9'),
  TC: circle('f7b9'),
  EXO: 'f85e',
  FAN: 'f863',
  NR: 'e57b',
  IND: 'f5bd',
  FLX: 'f5bc',
  FC: 'f2cc',
  FF: 'f453',
  FFC: 'e4f6',
  FIM: 'e2eb',
  FIR: 'f7b9',
  FLO: 'f4ba',
  FLP: 'e006',
  FOD: 'e55a',
  FSE: 'f135',
  FUN: 'f522',
  GC: 'f28d',
  GCH: 'e4f1',
  GEN: 'f135',
  GIN: 'f7a0',
  GL: 'f5ce',
  GNZ: 'e4f1',
  GRN: 'e2cd',
  GV: 'e005',
  H: 'f185',
  H2O: 'f043',
  HAB: 'f015',
  HCC: 'e55b',
  HCP: 'f1bb',
  HD: 'f26c',
  HE: 'f185',
  HE3: 'f185',
  HER: 'f816',
  HEX: 'f7a0',
  HHP: shield('2b'),
  HMS: 'f807',
  HNZ: 'e4f1',
  HOG: 'f530',
  HOP: 'e517',
  HPC: 'f11c',
  HPR: 'f5d2',
  HSE: 'f0c1',
  HSS: 'f4fb',
  HTE: 'f135',
  HYR: 'f5d2',
  IDC: 'f7c2',
  IMM: 'f1c0',
  KOM: 'e516',
  KV: 'f132',
  LBH: ['e583', { detail: 'f078' }],
  LC: 'f82f',
  LCB: ['f468', { fontSize: 1.1 }],
  LD: 'f1c0',
  LDE: ['e569', { detail: 'f078' }],
  LDI: 'f04b',
  LES: 'e4f4',
  LFE: 'e4f6',
  LFL: ['f1b3', { fontSize: 1.1 }],
  LFP: 'f52f',
  LHP: shield('f078'),
  LIS: 'e591',
  LIT: 'f0eb',
  LOG: 'f542',
  LSE: ['f0c1', { detail: 'f078' }],
  LSL: ['f52f', { fontSize: 1.1 }],
  LTA: ['f2d0', { detail: 'f078' }],
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
  NG: 'f5cb',
  DRF: 'f5cb',
  NL: 'f7e5',
  NN: 'f5dc',
  NOZ: 'e4f1',
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
  DDT: 'f1fb',
  PIB: 'f094',
  PK: 'f490',
  POW: 'f5df',
  PPA: 'f5a7',
  NS: 'f5a7',
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
  RBH: ['e583', { detail: 'f077' }],
  RCS: 'f390',
  RCT: 'f5d2',
  RDE: ['e569', { detail: 'f077' }],
  REA: 'e4f3',
  REP: 'f552',
  DCH: 'f07a',
  RG: ['f5ce', { opacity: 0.2, detail: 'f077' }],
  RHP: shield('f077'),
  ROM: 'f0a0',
  RSE: ['f0c1', { detail: 'f077' }],
  RTA: ['f2d0', { detail: 'f077' }],
  SA: 'f002',
  SAL: 'f550',
  SAR: 'f1e5',
  SUD: ['', { detail: 'f1e5' }],
  SC: 'f471',
  SCB: ['f468', { fontSize: 0.9 }],
  SCN: 'f566',
  SEA: 'f5bd',
  SEN: 'f491',
  SEQ: 'f48e',
  SF: 'f52f',
  SFE: ['e4f6', { fontSize: 0.8 }],
  SFK: 'f54a',
  SFL: ['f1b3', { fontSize: 0.8 }],
  SIL: 'f7e5',
  SNM: 'f279',
  SOI: 'e52d',
  SOL: 'f0e7',
  SP: 'f5ba',
  SSC: 'f0c1',
  SSL: ['f52f', { fontSize: 0.8 }],
  STR: 'f193',
  STS: 'f5cd',
  SU: 'f21e',
  SDR: ['', { detail: 'f21e' }],
  SUN: 'f807',
  SWF: ['f551', { fontSize: 0.9 }],
  TAC: 'f05b',
  TCB: ['f468', { fontSize: 0.75 }],
  TCL: 'f0c3',
  TCS: circle(''),
  TCU: 'f487',
  TK: 'f132',
  TPU: 'f1ec',
  TRA: 'f519',
  TRN: 'f2db',
  TRU: 'e586',
  TUB: 'f493',
  UTS: 'f7d9',
  SRD: ['', { detail: 'f7d9' }],
  CCD: ['', { detail: 'e4f8' }],
  RED: ['', { detail: 'f4c4' }],
  RDS: ['f544', { detail: 'f7d9' }],
  RDL: ['f544', { detail: 'f7d9' }],
  VCB: ['f468', { fontSize: 1.1 }],
  VEG: 'f5d1',
  VG: 'e06a',
  VIT: 'f517',
  VSC: ['f468', { fontSize: 0.8 }],
  WAI: 'f5dc',
  WCB: ['f468', { fontSize: 1.1 }],
  WIN: 'f72f',
  WM: 'f2d2',
  WOR: 'f53f',
  WR: 'e4b5',
  WS: 'f610',
  INS: 'f5bd',
};

function circle(detail: Icon): Icon {
  return ['f111', { detail }];
}

function shield(detail: Icon): Icon {
  return ['f132', { detail }];
}

void features.add({
  id: 'materials-icons',
  init,
});

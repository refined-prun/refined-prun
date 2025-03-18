import { clamp } from '@src/utils/clamp';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

type MaterialAmount = [number, string];
type UpgradeMap = MaterialAmount[][];

const hqUpgradeMaterials: UpgradeMap = [
  [],
  [],
  [
    [6, 'BBH'],
    [4, 'BDE'],
    [4, 'BSE'],
    [2, 'BTA'],
    [12, 'MCG'],
    [4, 'TRU'],
  ],
  [
    [16, 'BBH'],
    [12, 'BDE'],
    [12, 'BSE'],
    [6, 'BTA'],
    [36, 'MCG'],
    [12, 'TRU'],
    [20, 'OFF'],
  ],
  [
    [24, 'BBH'],
    [16, 'BDE'],
    [16, 'BSE'],
    [8, 'BTA'],
    [48, 'MCG'],
    [8, 'MFK'],
    [16, 'TRU'],
    [4, 'UTS'],
  ],
  [
    [40, 'OFF'],
    [20, 'SUN'],
    [8, 'UTS'],
    [16, 'MFK'],
  ],
  [
    [6, 'LBH'],
    [4, 'LDE'],
    [4, 'LSE'],
    [2, 'LTA'],
    [24, 'MCG'],
    [12, 'TRU'],
    [10, 'POW'],
  ],
  [
    [12, 'LBH'],
    [8, 'LDE'],
    [8, 'LSE'],
    [4, 'LTA'],
    [36, 'MCG'],
    [16, 'TRU'],
    [10, 'SP'],
  ],
  [
    [16, 'LBH'],
    [12, 'LDE'],
    [12, 'LSE'],
    [6, 'LTA'],
    [48, 'MCG'],
    [20, 'TRU'],
    [60, 'OFF'],
    [2, 'SP'],
  ],
  [
    [24, 'LBH'],
    [16, 'LDE'],
    [16, 'LSE'],
    [8, 'LTA'],
    [60, 'MCG'],
    [24, 'TRU'],
    [10, 'SP'],
    [10, 'POW'],
  ],
  [
    [100, 'OFF'],
    [14, 'SP'],
    [10, 'POW'],
  ],
  [
    [6, 'RBH'],
    [4, 'RDE'],
    [4, 'RSE'],
    [2, 'RTA'],
    [48, 'MCG'],
    [20, 'TRU'],
    [4, 'AAR'],
  ],
  [
    [12, 'RBH'],
    [8, 'RDE'],
    [8, 'RSE'],
    [4, 'RTA'],
    [60, 'MCG'],
    [24, 'TRU'],
    [2, 'BWS'],
  ],
  [
    [200, 'OFF'],
    [1, 'BWS'],
    [1, 'BMF'],
    [1, 'AAR'],
  ],
  [
    [16, 'RBH'],
    [12, 'RDE'],
    [12, 'RSE'],
    [6, 'RTA'],
    [100, 'MCG'],
    [28, 'TRU'],
    [2, 'BWS'],
    [2, 'AAR'],
  ],
  [
    [24, 'RBH'],
    [16, 'RDE'],
    [16, 'RSE'],
    [8, 'RTA'],
    [150, 'MCG'],
    [32, 'TRU'],
    [2, 'BWS'],
    [2, 'BMF'],
  ],
  [
    [300, 'OFF'],
    [1, 'LOG'],
  ],
  [
    [12, 'ABH'],
    [8, 'ADE'],
    [8, 'ASE'],
    [4, 'ATA'],
    [200, 'MCG'],
    [40, 'TRU'],
    [1, 'COM'],
  ],
  [
    [1, 'ADS'],
    [400, 'OFF'],
  ],
  [
    [24, 'ABH'],
    [16, 'ADE'],
    [1, 'ADS'],
    [16, 'ASE'],
    [8, 'ATA'],
    [1, 'COM'],
    [1, 'LOG'],
    [500, 'MCG'],
    [80, 'TRU'],
  ],
  [
    [1, 'ADS'],
    [1, 'COM'],
    [1, 'LOG'],
    [500, 'OFF'],
  ],
];

// HQ level 21 onward
function getHQUpgradeMaterials(level: number) {
  if (!hqUpgradeMaterials[level]) {
    const x = level - 20;
    hqUpgradeMaterials[level] = [
      [Math.floor(100 * (x + Math.pow(2, x / 5))), 'MCG'],
      [Math.floor(40 * (x + Math.pow(2, x / 5))), 'TRU'],
      [Math.floor(24 * (x + Math.pow(2, x / 5))), 'ABH'],
      [Math.floor(16 * (x + Math.pow(2, x / 5))), 'ADE'],
      [Math.floor(16 * (x + Math.pow(2, x / 5))), 'ASE'],
      [Math.floor(8 * (x + Math.pow(2, x / 5))), 'ATA'],
      [Math.floor((2 * level) / 15), 'COM'],
      [Math.floor((2 * level) / 15), 'LOG'],
      [Math.floor((2 * level) / 15), 'ADS'],
    ];
  }
  return hqUpgradeMaterials[level];
}

for (let i = 21; i < 100; i++) {
  getHQUpgradeMaterials(i);
}

type AccumulatedAmounts = { [ticker: string]: number };

export function calculateHQUpgradeMaterials(from: number, to: number) {
  from = clamp(from, 0, Number.MAX_SAFE_INTEGER);
  to = clamp(to, 0, Number.MAX_SAFE_INTEGER);
  if (to <= from) {
    return [];
  }

  const accumulated: { [ticker: string]: number } = {};
  for (let i = from + 1; i <= to; i++) {
    const level = getHQUpgradeMaterials(i);
    for (const [amount, ticker] of level) {
      accumulated[ticker] = (accumulated[ticker] ?? 0) + amount;
    }
  }
  return convertToMaterialAmounts(accumulated);
}

function convertToMaterialAmounts(accumulated: AccumulatedAmounts) {
  return Object.keys(accumulated).map(x => ({
    material: materialsStore.getByTicker(x)!,
    amount: accumulated[x],
  })) as PrunApi.MaterialAmount[];
}

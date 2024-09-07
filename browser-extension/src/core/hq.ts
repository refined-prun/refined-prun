import { clamp } from '@src/utils/clamp';
import { computed } from 'vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

type MaterialAmount = [number, string];
type UpgradeMap = MaterialAmount[][];

export const hqUpgradeMaterials: UpgradeMap = [
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
  [
    [51, 'ABH'],
    [34, 'ADE'],
    [2, 'ADS'],
    [34, 'ASE'],
    [17, 'ATA'],
    [2, 'COM'],
    [2, 'LOG'],
    [214, 'MCG'],
    [85, 'TRU'],
  ],
  [
    [79, 'ABH'],
    [53, 'ADE'],
    [2, 'ADS'],
    [53, 'ASE'],
    [26, 'ATA'],
    [2, 'COM'],
    [2, 'LOG'],
    [331, 'MCG'],
    [132, 'TRU'],
  ],
  [
    [108, 'ABH'],
    [72, 'ADE'],
    [3, 'ADS'],
    [72, 'ASE'],
    [36, 'ATA'],
    [3, 'COM'],
    [3, 'LOG'],
    [451, 'MCG'],
    [180, 'TRU'],
  ],
  [
    [137, 'ABH'],
    [91, 'ADE'],
    [3, 'ADS'],
    [91, 'ASE'],
    [45, 'ATA'],
    [3, 'COM'],
    [3, 'LOG'],
    [574, 'MCG'],
    [229, 'TRU'],
  ],
  [
    [168, 'ABH'],
    [112, 'ADE'],
    [3, 'ADS'],
    [112, 'ASE'],
    [56, 'ATA'],
    [3, 'COM'],
    [3, 'LOG'],
    [700, 'MCG'],
    [280, 'TRU'],
  ],
  [
    [199, 'ABH'],
    [132, 'ADE'],
    [3, 'ADS'],
    [132, 'ASE'],
    [66, 'ATA'],
    [3, 'COM'],
    [3, 'LOG'],
    [829, 'MCG'],
    [331, 'TRU'],
  ],
  [
    [231, 'ABH'],
    [154, 'ADE'],
    [3, 'ADS'],
    [154, 'ASE'],
    [77, 'ATA'],
    [3, 'COM'],
    [3, 'LOG'],
    [963, 'MCG'],
    [385, 'TRU'],
  ],
  [
    [264, 'ABH'],
    [176, 'ADE'],
    [3, 'ADS'],
    [176, 'ASE'],
    [88, 'ATA'],
    [3, 'COM'],
    [3, 'LOG'],
    [1103, 'MCG'],
    [441, 'TRU'],
  ],
  [
    [299, 'ABH'],
    [199, 'ADE'],
    [3, 'ADS'],
    [199, 'ASE'],
    [99, 'ATA'],
    [3, 'COM'],
    [3, 'LOG'],
    [1248, 'MCG'],
    [499, 'TRU'],
  ],
  [
    [336, 'ABH'],
    [224, 'ADE'],
    [4, 'ADS'],
    [224, 'ASE'],
    [112, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [1400, 'MCG'],
    [560, 'TRU'],
  ],
  [
    [374, 'ABH'],
    [249, 'ADE'],
    [4, 'ADS'],
    [249, 'ASE'],
    [124, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [1559, 'MCG'],
    [623, 'TRU'],
  ],
  [
    [414, 'ABH'],
    [276, 'ADE'],
    [4, 'ADS'],
    [276, 'ASE'],
    [138, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [1727, 'MCG'],
    [691, 'TRU'],
  ],
  [
    [457, 'ABH'],
    [305, 'ADE'],
    [4, 'ADS'],
    [305, 'ASE'],
    [152, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [1906, 'MCG'],
    [732, 'TRU'],
  ],
  [
    [503, 'ABH'],
    [335, 'ADE'],
    [4, 'ADS'],
    [335, 'ASE'],
    [167, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [2096, 'MCG'],
    [838, 'TRU'],
  ],
  [
    [552, 'ABH'],
    [368, 'ADE'],
    [4, 'ADS'],
    [368, 'ASE'],
    [184, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [2300, 'MCG'],
    [920, 'TRU'],
  ],
  [
    [604, 'ABH'],
    [403, 'ADE'],
    [4, 'ADS'],
    [403, 'ASE'],
    [201, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [2518, 'MCG'],
    [1007, 'TRU'],
  ],
  [
    [661, 'ABH'],
    [440, 'ADE'],
    [4, 'ADS'],
    [440, 'ASE'],
    [220, 'ATA'],
    [4, 'COM'],
    [4, 'LOG'],
    [2755, 'MCG'],
    [1102, 'TRU'],
  ],
  [
    [723, 'ABH'],
    [482, 'ADE'],
    [5, 'ADS'],
    [482, 'ASE'],
    [241, 'ATA'],
    [5, 'COM'],
    [5, 'LOG'],
    [3012, 'MCG'],
    [1205, 'TRU'],
  ],
  [
    [790, 'ABH'],
    [526, 'ADE'],
    [5, 'ADS'],
    [526, 'ASE'],
    [263, 'ATA'],
    [5, 'COM'],
    [5, 'LOG'],
    [3292, 'MCG'],
    [1317, 'TRU'],
  ],
  [
    [864, 'ABH'],
    [576, 'ADE'],
    [5, 'ADS'],
    [576, 'ASE'],
    [288, 'ATA'],
    [5, 'COM'],
    [5, 'LOG'],
    [3600, 'MCG'],
    [1440, 'TRU'],
  ],
  [
    [945, 'ABH'],
    [630, 'ADE'],
    [5, 'ADS'],
    [630, 'ASE'],
    [315, 'ATA'],
    [5, 'COM'],
    [5, 'LOG'],
    [3937, 'MCG'],
    [1575, 'TRU'],
  ],
  [
    [1034, 'ABH'],
    [689, 'ADE'],
    [5, 'ADS'],
    [689, 'ASE'],
    [344, 'ATA'],
    [5, 'COM'],
    [5, 'LOG'],
    [4311, 'MCG'],
    [1724, 'TRU'],
  ],
  [
    [1134, 'ABH'],
    [756, 'ADE'],
    [5, 'ADS'],
    [756, 'ASE'],
    [378, 'ATA'],
    [5, 'COM'],
    [5, 'LOG'],
    [4725, 'MCG'],
    [1890, 'TRU'],
  ],
  [
    [1244, 'ABH'],
    [829, 'ADE'],
    [5, 'ADS'],
    [829, 'ASE'],
    [414, 'ATA'],
    [5, 'COM'],
    [5, 'LOG'],
    [5185, 'MCG'],
    [2074, 'TRU'],
  ],
  [
    [1368, 'ABH'],
    [912, 'ADE'],
    [6, 'ADS'],
    [912, 'ASE'],
    [456, 'ATA'],
    [6, 'COM'],
    [6, 'LOG'],
    [5700, 'MCG'],
    [2280, 'TRU'],
  ],
  [
    [1506, 'ABH'],
    [1004, 'ADE'],
    [6, 'ADS'],
    [1004, 'ASE'],
    [502, 'ATA'],
    [6, 'COM'],
    [6, 'LOG'],
    [6275, 'MCG'],
    [2510, 'TRU'],
  ],
  [
    [1661, 'ABH'],
    [1107, 'ADE'],
    [6, 'ADS'],
    [1107, 'ASE'],
    [533, 'ATA'],
    [6, 'COM'],
    [6, 'LOG'],
    [6922, 'MCG'],
    [2768, 'TRU'],
  ],
  [
    [1836, 'ABH'],
    [1224, 'ADE'],
    [6, 'ADS'],
    [1224, 'ASE'],
    [612, 'ATA'],
    [6, 'COM'],
    [6, 'LOG'],
    [7650, 'MCG'],
    [3060, 'TRU'],
  ],
  [
    [2033, 'ABH'],
    [1355, 'ADE'],
    [6, 'ADS'],
    [1355, 'ASE'],
    [677, 'ATA'],
    [6, 'COM'],
    [6, 'LOG'],
    [8471, 'MCG'],
    [3388, 'TRU'],
  ],
];

export const maxHQLevel = hqUpgradeMaterials.length - 1;

type AccumulatedAmounts = { [ticker: string]: number };

export const accumulatedHQUpgrades = computed(() => {
  const levels: PrunApi.MaterialAmount[][] = [[]];
  const accumulated: { [ticker: string]: number } = {};
  for (let i = 1; i < hqUpgradeMaterials.length; i++) {
    const level = hqUpgradeMaterials[i];
    for (const [amount, ticker] of level) {
      accumulated[ticker] = (accumulated[ticker] ?? 0) + amount;
    }
    levels[i] = convertToMaterialAmounts(accumulated);
  }
  return levels;
});

export function calculateHQUpgradeMaterials(from: number, to: number) {
  from = clamp(from, 0, maxHQLevel);
  to = clamp(to, 0, maxHQLevel);
  if (to <= from) {
    return [];
  }

  const accumulated: { [ticker: string]: number } = {};
  for (let i = from + 1; i <= to; i++) {
    const level = hqUpgradeMaterials[i];
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

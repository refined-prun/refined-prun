import { populationsStore } from '@src/infrastructure/prun-api/data/populations';
import { populationProjectsStore } from '@src/infrastructure/prun-api/data/population-projects';
import { cogcsStore } from '@src/infrastructure/prun-api/data/cogcs';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { userData } from '@src/store/user-data';

// Ignore capture timestamps to avoid saving identical payloads again.
function comparable(value: unknown) {
  return JSON.stringify(value, (key, v) =>
    key === 'capturedAt' || key === 'upkeepsCapturedAt' ? undefined : v,
  );
}

function maxTs(a: number | undefined, b: number | undefined) {
  if (a === undefined) {
    return b;
  }
  if (b === undefined) {
    return a;
  }
  return Math.max(a, b);
}

// Keep the latest known contributions; payloads may omit older history.
function mergeContribHistory(
  existing: Record<string, UserData.GovBurnContrib> | undefined,
  incoming: Record<string, UserData.GovBurnContrib>,
) {
  const merged: Record<string, UserData.GovBurnContrib> = {};
  for (const [ticker, contrib] of Object.entries(existing ?? {})) {
    merged[ticker] = { ...contrib };
  }
  for (const [ticker, contrib] of Object.entries(incoming)) {
    const prev = merged[ticker];
    if (prev === undefined) {
      merged[ticker] = { ...contrib };
      continue;
    }
    merged[ticker] = {
      own: maxTs(prev.own, contrib.own),
      any: maxTs(prev.any, contrib.any),
    };
  }
  return merged;
}

function buildContribHistory(project: PrunApi.PopulationProject) {
  const upkeepTickers = new Set(project.upkeeps.map(x => x.material.ticker));
  const ownId = companyStore.value?.id;
  const history: Record<string, UserData.GovBurnContrib> = {};
  for (const contribution of project.contributions ?? []) {
    const ts = contribution.time.timestamp;
    const isOwn = ownId !== undefined && contribution.contributor.id === ownId;
    for (const entry of contribution.materials) {
      const ticker = entry.material.ticker;
      if (!upkeepTickers.has(ticker)) {
        continue;
      }
      const prev = history[ticker] ?? {};
      history[ticker] = {
        any: maxTs(prev.any, ts),
        own: isOwn ? maxTs(prev.own, ts) : prev.own,
      };
    }
  }
  return history;
}

function capturePopulations() {
  for (const population of populationsStore.all.value ?? []) {
    const planet = planetsStore.all.value?.find(x => x.populationId === population.id);
    if (!planet) {
      continue;
    }

    const naturalId = planet.naturalId;
    const existing = userData.govburn.planets[naturalId];
    const buildings = population.infrastructure.map(infra => {
      const previous =
        existing?.buildings.find(x => x.projectId === infra.projectId) ??
        existing?.buildings.find(x => x.ticker === infra.ticker);
      const building: UserData.GovBurnBuilding = {
        ticker: infra.ticker,
        type: infra.type,
        projectId: infra.projectId,
        level: infra.level,
      };
      if (previous?.upkeeps !== undefined) {
        building.upkeeps = previous.upkeeps;
        building.upkeepsCapturedAt = previous.upkeepsCapturedAt;
      }
      if (previous?.contribHistory !== undefined) {
        building.contribHistory = previous.contribHistory;
      }
      return building;
    });

    const next: UserData.GovBurnPlanet = {
      naturalId,
      name: planet.name,
      capturedAt: Date.now(),
      buildings,
    };
    if (existing?.cogc !== undefined) {
      next.cogc = existing.cogc;
    }
    if (existing !== undefined && comparable(existing) === comparable(next)) {
      continue;
    }
    userData.govburn.planets[naturalId] = next;
  }
}

function captureCogcs() {
  for (const cogc of cogcsStore.all.value ?? []) {
    const planet = userData.govburn.planets[cogc.planet.naturalId];
    if (planet === undefined || cogc.upkeep === null) {
      continue;
    }
    const next: UserData.GovBurnCogc = {
      dueDate: cogc.upkeep.dueDate.timestamp,
      materials: cogc.upkeep.billOfMaterial.map(x => ({
        ticker: x.material.ticker,
        amount: x.amount,
        currentAmount: x.currentAmount,
      })),
    };
    if (planet.cogc !== undefined && comparable(planet.cogc) === comparable(next)) {
      continue;
    }
    planet.cogc = next;
  }
}

function captureProjects() {
  for (const project of populationProjectsStore.all.value ?? []) {
    for (const planet of Object.values(userData.govburn.planets)) {
      const building = planet.buildings.find(x => x.projectId === project.id);
      if (!building) {
        continue;
      }

      const upkeeps: UserData.GovBurnUpkeep[] = project.upkeeps.map(x => ({
        ticker: x.material.ticker,
        stored: x.stored,
        amount: x.amount,
        duration: x.duration,
        nextTick: x.nextTick.timestamp,
      }));
      const contribHistory = mergeContribHistory(
        building.contribHistory,
        buildContribHistory(project),
      );
      // Keep the built level from POPI; project details can be older.
      const next = {
        upkeeps,
        contribHistory,
      };
      const previous = {
        upkeeps: building.upkeeps,
        contribHistory: building.contribHistory,
      };
      if (comparable(previous) === comparable(next)) {
        continue;
      }
      building.upkeeps = upkeeps;
      building.upkeepsCapturedAt = Date.now();
      building.contribHistory = contribHistory;
    }
  }
}

export function initializeGovBurnCapture() {
  watchEffect(capturePopulations);
  watchEffect(captureProjects);
  watchEffect(captureCogcs);
}

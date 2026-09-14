// Encode action packages for refined-agent and derive the AGENT list from channel history.
import {
  agentChannelStore,
  maxMessageLength,
} from '@src/infrastructure/prun-api/data/agent-channel';
import { fetchAgentChannel } from '@src/infrastructure/prun-ui/agent-channel-messaging';
import { configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';
import { deserializeStorage, serializeStorage } from '@src/features/XIT/ACT/actions/utils';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import {
  getEntityNaturalIdFromAddress,
  getEntityNameFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import dayjs from 'dayjs';

const readyMaxAgeMs = dayjs.duration(5, 'days').asMilliseconds();

// Short structural keys - repeated on every action/group in a package.
const keyToSync = {
  actions: 'a',
  global: 'g',
  groups: 'r',
  name: 'n',
  type: 't',
  group: 'gr',
  origin: 'o',
  dest: 'd',
  exchange: 'x',
  materials: 'm',
  buyMissingFuel: 'bmf',
  buyPartial: 'bp',
  allowUnfilled: 'auf',
  priceLimits: 'pl',
  useCXInv: 'uci',
  useBaseInv: 'ubi',
  advanceDays: 'ad',
  days: 'dy',
  planet: 'p',
  skippable: 'sk',
  exclusions: 'ex',
  consumablesOnly: 'co',
} as const;
const keyFromSync = invert(keyToSync);

// Short codes for the fixed, bounded enums/sentinels that show up on every package.
const valueToSync = {
  [configurableValue]: '?',
  'CX Buy': 'CB',
  MTRA: 'MT',
  Refuel: 'RF',
  'CONT Ship': 'CS',
  'CONT Trade': 'CT',
  Manual: 'MN',
  Resupply: 'RS',
  Repair: 'RP',
  Paste: 'PS',
  AI1: 'A1',
  CI1: 'C1',
  CI2: 'C2',
  IC1: 'I1',
  NC1: 'N1',
  NC2: 'N2',
} as const;
const valueFromSync = invert(valueToSync);

function invert(map: Record<string, string>) {
  return Object.fromEntries(Object.entries(map).map(([full, short]) => [short, full]));
}

function remapKeysDeep(value: unknown, keyMap: Record<string, string>): unknown {
  if (Array.isArray(value)) {
    return value.map(item => remapKeysDeep(item, keyMap));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        keyMap[key] ?? key,
        remapKeysDeep(child, keyMap),
      ]),
    );
  }
  return value;
}

function remapValuesDeep(
  value: unknown,
  valueMap: Record<string, string>,
  transformString?: (value: string) => string,
): unknown {
  if (Array.isArray(value)) {
    return value.map(item => remapValuesDeep(item, valueMap, transformString));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        remapValuesDeep(child, valueMap, transformString),
      ]),
    );
  }
  if (typeof value === 'string') {
    const mapped = valueMap[value];
    if (mapped !== undefined) {
      return mapped;
    }
    return transformString ? transformString(value) : value;
  }
  return value;
}

// Replace display names in "<name> <Suffix>" storages with shorter natural ids.
// Both forms work with deserializeStorage; expandStorageName restores names for display.
const storageSuffixes = [' Base', ' Warehouse', ' Cargo', ' STL Store', ' FTL Store'] as const;

function compactStorageName(value: string): string {
  const suffix = storageSuffixes.find(x => value.endsWith(x));
  if (!suffix) {
    return value;
  }
  const store = deserializeStorage(value);
  if (!store) {
    return value;
  }
  const naturalId = getStorageNaturalId(store);
  return naturalId ? naturalId + suffix : value;
}

// Restore display names because step descriptions show storage strings verbatim.
function expandStorageName(value: string): string {
  const suffix = storageSuffixes.find(x => value.endsWith(x));
  if (!suffix) {
    return value;
  }
  const store = deserializeStorage(value);
  return store ? serializeStorage(store) : value;
}

function getStorageNaturalId(store: PrunApi.Store): string | undefined {
  switch (store.type) {
    case 'STORE':
      return getEntityNaturalIdFromAddress(sitesStore.getById(store.addressableId)?.address);
    case 'WAREHOUSE_STORE':
      return getEntityNaturalIdFromAddress(warehousesStore.getById(store.addressableId)?.address);
    default:
      // SHIP_STORE/STL/FTL resolve by name only; replacing them with natural ids breaks lookup.
      return undefined;
  }
}

interface AgentSyncEnvelope {
  // Kind: action-package.
  k: 'ap';
  v: 1;
  // Short per-day id (e.g. "a3"); optional for backward compatibility with older posts.
  i?: string;
  p: unknown;
}

// Expansion remaps every string. Reject user values that match short codes
// (e.g. a group named "MN") to prevent changing them during sync.
function findSyncCodeCollision(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSyncCodeCollision(item);
      if (found !== undefined) {
        return found;
      }
    }
    return undefined;
  }
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) {
      const found = findSyncCodeCollision(child);
      if (found !== undefined) {
        return found;
      }
    }
    return undefined;
  }
  if (typeof value === 'string' && valueFromSync[value] !== undefined) {
    return value;
  }
  return undefined;
}

export function compactActionPackageForSync(pkg: UserData.ActionPackageData): AgentSyncEnvelope {
  const withShortKeys = remapKeysDeep(pkg, keyToSync);
  const withShortValues = remapValuesDeep(withShortKeys, valueToSync, compactStorageName);
  return { k: 'ap', v: 1, p: withShortValues };
}

export function expandActionPackageFromSync(
  envelope: AgentSyncEnvelope,
): UserData.ActionPackageData {
  const withFullValues = remapValuesDeep(envelope.p, valueFromSync, expandStorageName);
  return remapKeysDeep(withFullValues, keyFromSync) as UserData.ActionPackageData;
}

function parseAgentSyncEnvelope(text: string | null): AgentSyncEnvelope | undefined {
  if (!text) {
    return undefined;
  }
  try {
    const json = JSON.parse(text);
    if (json?.k === 'ap' && json?.v === 1) {
      return json as AgentSyncEnvelope;
    }
  } catch {
    // Ignore ordinary chat messages.
  }
  return undefined;
}

// Dismissal markers are the entire message body: a short id like "a3", or a chain
// member like "a3-2".
const dismissalMarkerRegex = /^([a-z])(\d{1,2})(-\d{1,2})?$/;

export function parseDismissalMarker(text: string | null | undefined) {
  if (!text) {
    return undefined;
  }
  const normalized = text.trim().toLowerCase();
  const match = normalized.match(dismissalMarkerRegex);
  return match ? match[0] : undefined;
}

// Chain member ids: "<base>-<n>" e.g. "c11-2". Base itself is a normal agent id.
export function parseChainId(id: string | undefined): { base: string; index: number } | undefined {
  if (!id) {
    return undefined;
  }
  const match = id.toLowerCase().match(/^([a-z]\d{1,2})-(\d{1,2})$/);
  if (!match) {
    return undefined;
  }
  return { base: match[1], index: Number(match[2]) };
}

function getInWindowCutoff() {
  return Date.now() - readyMaxAgeMs;
}

// Reserve package and dismissal ids in the 5-day window.
// Chain members also reserve their base: "c11-2" prevents reuse of "c11".
function collectUsedIds(
  messages: PrunApi.ChannelMessage[],
  cutoff: number,
  reserved?: ReadonlySet<string>,
) {
  const used = new Set<string>();
  const addId = (raw: string) => {
    const id = raw.toLowerCase();
    used.add(id);
    const chain = parseChainId(id);
    if (chain) {
      used.add(chain.base);
    }
  };
  if (reserved) {
    for (const id of reserved) {
      addId(id);
    }
  }
  for (const message of messages) {
    if (message.type !== 'CHAT' || message.time.timestamp < cutoff) {
      continue;
    }
    const envelope = parseAgentSyncEnvelope(message.message);
    if (envelope?.i) {
      addId(String(envelope.i));
    }
    const marker = parseDismissalMarker(message.message);
    if (marker) {
      addId(marker);
    }
  }
  return used;
}

// Id = <letter><dayOfMonth>, e.g. "a3" = first package posted on the 3rd.
export function generateAgentMessageId(reserved?: ReadonlySet<string>) {
  const day = new Date().getDate();
  const messages = agentChannelStore.all.value ?? [];
  const used = collectUsedIds(messages, getInWindowCutoff(), reserved);
  for (let i = 0; i < 26; i++) {
    const id = String.fromCharCode(97 + i) + day;
    if (!used.has(id)) {
      return id;
    }
  }
  throw new Error('All 26 agent message ids for today are in use.');
}

// Use a plain id for one package or numbered ids for a chain ("a3-1" … "a3-n").
// Chain ids identify the next SFC stop. Reserve them now because posting happens after generation.
export async function generateAgentIds(count: number, reserved?: Set<string>): Promise<string[]> {
  await fetchAgentChannel();
  const base = generateAgentMessageId(reserved);
  reserved?.add(base);
  if (count <= 1) {
    return [base];
  }
  const ids = Array.from({ length: count }, (_, i) => `${base}-${i + 1}`);
  for (const id of ids) {
    reserved?.add(id);
  }
  return ids;
}

// Build without posting so the caller can recover the exact message if sending fails.
export async function buildAgentPackageMessage(
  pkg: UserData.ActionPackageData,
  id?: string,
): Promise<{ id: string; text: string }> {
  // History is needed to pick a free id; no-op when already fetched this session.
  await fetchAgentChannel();
  const resolvedId = id ?? generateAgentMessageId();
  const collision = findSyncCodeCollision(pkg);
  if (collision !== undefined) {
    throw new Error(
      `Action package can't sync: "${collision}" matches a sync short code - rename it.`,
    );
  }
  const { p } = compactActionPackageForSync(pkg);
  // Place `i` right after k/v so it stays near the front of the raw chat message.
  const envelope: AgentSyncEnvelope = { k: 'ap', v: 1, i: resolvedId, p };
  const text = JSON.stringify(envelope);
  if (text.length > maxMessageLength) {
    throw new Error(
      `Action package too large to sync (${text.length} > ${maxMessageLength} chars).`,
    );
  }
  return { id: resolvedId, text };
}

export interface AgentReadyPackage {
  messageId: string;
  pkg: UserData.ActionPackageData;
  ready: boolean;
  id?: string;
  destination?: PackageDestination;
}

export interface PackageDestination {
  naturalId: string;
  name: string;
}

// The base store identifies the destination planet; the ship store identifies the carrier.
export function getPackageDestination(
  pkg: UserData.ActionPackageData,
): PackageDestination | undefined {
  for (const action of pkg.actions) {
    for (const value of [action.origin, action.dest]) {
      const store = deserializeStorage(value);
      if (store?.type === 'STORE') {
        const site = sitesStore.getById(store.addressableId);
        const naturalId = getEntityNaturalIdFromAddress(site?.address);
        if (naturalId) {
          return { naturalId, name: getEntityNameFromAddress(site?.address) ?? naturalId };
        }
      }
    }
  }
  return undefined;
}

export function getPackageShip(pkg: UserData.ActionPackageData): PrunApi.Ship | undefined {
  for (const action of pkg.actions) {
    for (const value of [action.origin, action.dest]) {
      const store = deserializeStorage(value);
      if (store?.type === 'SHIP_STORE') {
        return shipsStore.getById(store.addressableId);
      }
    }
  }
  return undefined;
}

// Shared ships must be grounded at this package's stop, not just any planet.
export function isShipAtDestination(
  ship: PrunApi.Ship | undefined,
  destinationNaturalId: string | undefined,
) {
  if (ship?.flightId) {
    return false;
  }
  if (destinationNaturalId === undefined) {
    return true;
  }
  return getEntityNaturalIdFromAddress(ship?.address ?? undefined) === destinationNaturalId;
}

// Every referenced ship must be grounded at the destination before the package can run.
function getReadyState(
  pkg: UserData.ActionPackageData,
  destination: PackageDestination | undefined,
): boolean {
  const storageValues = [pkg.actions.map(x => x.origin), pkg.actions.map(x => x.dest)]
    .flat()
    .filter((x): x is string => !!x && x !== configurableValue && !x.startsWith(groupTargetPrefix));

  for (const value of storageValues) {
    const store = deserializeStorage(value);
    if (store?.type !== 'SHIP_STORE') {
      continue;
    }
    if (!isShipAtDestination(shipsStore.getById(store.addressableId), destination?.naturalId)) {
      return false;
    }
  }
  return true;
}

export const agentReadyPackages = computed<AgentReadyPackage[]>(() => {
  const messages = agentChannelStore.all.value ?? [];
  const cutoff = getInWindowCutoff();

  // Marker id -> latest marker timestamp inside the live window.
  const markers = new Map<string, number>();
  for (const message of messages) {
    if (message.type !== 'CHAT' || message.time.timestamp < cutoff) {
      continue;
    }
    const marker = parseDismissalMarker(message.message);
    if (!marker) {
      continue;
    }
    const prev = markers.get(marker);
    if (prev === undefined || message.time.timestamp > prev) {
      markers.set(marker, message.time.timestamp);
    }
  }

  const result: AgentReadyPackage[] = [];
  for (const message of messages) {
    if (message.type !== 'CHAT' || message.time.timestamp < cutoff) {
      continue;
    }
    const envelope = parseAgentSyncEnvelope(message.message);
    if (!envelope) {
      continue;
    }
    const id = typeof envelope.i === 'string' ? envelope.i.toLowerCase() : undefined;
    // A marker later than the package hides it; earlier markers leave the id free for reuse.
    if (id) {
      const markerTs = markers.get(id);
      if (markerTs !== undefined && markerTs > message.time.timestamp) {
        continue;
      }
    }
    const pkg = expandActionPackageFromSync(envelope);
    const destination = getPackageDestination(pkg);
    result.push({
      messageId: message.messageId,
      pkg,
      ready: getReadyState(pkg, destination),
      id,
      destination,
    });
  }
  return result;
});

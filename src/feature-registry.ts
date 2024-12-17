import getBrowserVersion from '@src/utils/browser-version';
import { userData } from '@src/store/user-data';

interface FeatureDescriptor {
  id: string;
  description: string;
  advanced?: boolean;
  init: () => void;
}

const registry: FeatureDescriptor[] = [];

const log = {
  info: console.log,
  http: console.log,
  error: logError,
};

function logError(id: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);

  const searchIssueUrl = new URL('https://github.com/refined-prun/refined-prun/issues');
  searchIssueUrl.searchParams.set('q', `is:issue is:open label:bug ${id}`);

  const newIssueUrl = new URL('https://github.com/refined-prun/refined-prun/issues/new');
  newIssueUrl.searchParams.set('template', 'bug_report.yml');
  newIssueUrl.searchParams.set('title', `\`${id}\`: ${message}`);
  newIssueUrl.searchParams.set('version', config.version.toString());
  newIssueUrl.searchParams.set('browser', getBrowserVersion());
  newIssueUrl.searchParams.set(
    'description',
    ['```', String(error instanceof Error ? error.stack! : error).trim(), '```'].join('\n'),
  );

  // Don't change this to `throw Error` because Firefox doesn't show extensions' errors in the console
  console.group(`❌ Refined PrUn: ${id}`); // Safari supports only one parameter
  console.log(`📕 ${config.version}`, error); // One parameter improves Safari formatting
  console.log('🔍 Search issue', searchIssueUrl.href);
  console.log('🚨 Report issue', newIssueUrl.href);
  console.groupEnd();
}

function add(path: string, init: () => void, description: string) {
  const parts = path.split('/');
  const id = parts.pop()!.split('.')[0];
  let mode = parts.pop()!;
  if (mode === id) {
    mode = parts.pop()!;
  }
  if (__DEV__ && registry.some(x => x.id === id)) {
    throw Error(`Duplicate feature id: ${id}`);
  }
  registry.push({
    id,
    description,
    init,
    advanced: mode === 'advanced',
  });
}

function init() {
  const disabledFeatures = new Set(userData.settings.disabled);
  for (const feature of registry) {
    if (userData.settings.mode !== 'FULL' && feature.advanced) {
      continue;
    }
    if (disabledFeatures.has(feature.id)) {
      log.info('↩️', 'Skipping ' + feature.id);
      continue;
    }
    features.current = feature.id;
    try {
      feature.init();
      log.info('✅', feature.id);
    } catch (error) {
      log.error(feature.id, error);
    } finally {
      features.current = undefined;
    }
  }
}

const features = {
  add,
  init,
  current: undefined as string | undefined,
  registry,
};

export default features;

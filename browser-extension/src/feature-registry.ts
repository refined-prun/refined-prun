import getBrowserVersion from '@src/utils/browser-version';
import { castArray } from '@src/utils/cast-array';

type FeatureInit = () => void;

interface FeatureDescriptor {
  id: string;
  init?: Arrayable<FeatureInit>;
}

const registry: FeatureDescriptor[] = [];

const log = {
  info: console.log,
  http: console.log,
  error: logError,
};

const { version } = (__CHROME__ ? chrome : browser).runtime.getManifest();

function logError(id: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);

  const searchIssueUrl = new URL('https://github.com/refined-prun/refined-prun/issues');
  searchIssueUrl.searchParams.set('q', `is:issue is:open label:bug ${id}`);

  const newIssueUrl = new URL('https://github.com/refined-prun/refined-prun/issues/new');
  newIssueUrl.searchParams.set('template', 'bug_report.yml');
  newIssueUrl.searchParams.set('title', `\`${id}\`: ${message}`);
  newIssueUrl.searchParams.set('version', version.toString());
  newIssueUrl.searchParams.set('browser', getBrowserVersion());
  newIssueUrl.searchParams.set(
    'description',
    ['```', String(error instanceof Error ? error.stack! : error).trim(), '```'].join('\n'),
  );

  // Don't change this to `throw Error` because Firefox doesn't show extensions' errors in the console
  console.group(`❌ ${id}`); // Safari supports only one parameter
  console.log(`📕 Refined PrUn v${version}`, error); // One parameter improves Safari formatting
  console.log('🔍 Search issue', searchIssueUrl.href);
  console.log('🚨 Report issue', newIssueUrl.href);
  console.groupEnd();
}

function add(descriptor: FeatureDescriptor) {
  if (__DEV__ && registry.some(x => x.id === descriptor.id)) {
    throw Error(`Duplicate feature id: ${descriptor.id}`);
  }
  registry.push(descriptor);
}

async function init() {
  for (const feature of registry) {
    await initializeFeature(feature);
  }
}

async function initializeFeature(feature: FeatureDescriptor) {
  let result = true;
  if (feature.init) {
    features.current = feature.id;
    for (const init of castArray(feature.init)) {
      try {
        init();
      } catch (error) {
        log.error(feature.id, error);
        result = false;
      }
    }
    features.current = undefined;
  }
  if (result) {
    log.info('✅', feature.id);
  }
}

const features = {
  add,
  init,
  current: undefined as string | undefined,
};

export default features;

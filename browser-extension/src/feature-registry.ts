import { Promisable } from 'type-fest';
import asyncForEach from '@src/utils/async-foreach';
import getBrowserVersion from '@src/utils/browser-version';
import { castArray } from '@src/utils/cast-array';

type FeatureInitResult = void | boolean;
type FeatureInit = (signal: AbortSignal) => Promisable<FeatureInitResult>;

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
  const featureController = new AbortController();
  for (const feature of registry) {
    await initializeFeature(feature, featureController.signal);
  }
}

async function initializeFeature(feature: FeatureDescriptor, signal: AbortSignal) {
  let result: FeatureInitResult;
  if (feature.init) {
    await asyncForEach(castArray(feature.init), async init => {
      try {
        result = await init(signal);
      } catch (error) {
        log.error(feature.id, error);
      }
    });
  } else {
    result = true;
  }
  // Features can return `false` when they decide not to run on the current page
  if (result !== false) {
    document.documentElement.setAttribute(`rprun-${feature.id}`, '');
    log.info('✅', feature.id);
  }
}

const features = {
  add,
  init,
};

export default features;

import {
  bundledChangelog,
  getLatestRelease,
  markChangelogSeen,
  parseChangelog,
} from './changelog-data';

export function useChangelog(version: string) {
  const changelog = shallowRef(bundledChangelog);
  const loading = ref(false);
  const failed = ref(false);
  const showUnreleased = ref(false);

  const latestVersion = computed(() => getLatestRelease(changelog.value));
  const isLatestVersion = computed(
    () => version === '0.0.0' || latestVersion.value?.version === version,
  );
  const currentVersion = computed(() =>
    version === '0.0.0' ? latestVersion.value?.version : version,
  );
  const canShowUnreleased = computed(
    () =>
      !loading.value &&
      changelog.value.some(
        x => x.version === 'Unreleased' && x.sections.some(x => x.items.length > 0),
      ),
  );
  const visibleChangelog = computed(() =>
    changelog.value.filter(
      x => x.version !== 'Unreleased' || (canShowUnreleased.value && showUnreleased.value),
    ),
  );

  async function fetchData() {
    loading.value = true;
    failed.value = false;
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/refined-prun/refined-prun/main/CHANGELOG.md',
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch changelog: ${response.status}`);
      }
      const releases = parseChangelog(await response.text());
      if (!releases.some(x => x.sections.some(x => x.items.length > 0))) {
        throw new Error('The changelog has no release notes.');
      }
      changelog.value = releases;
    } catch (error) {
      failed.value = true;
      console.error('Failed to fetch changelog from Refined PrUn', error);
    } finally {
      loading.value = false;
    }
  }

  markChangelogSeen();
  void fetchData();

  return {
    changelog: visibleChangelog,
    loading,
    failed,
    showUnreleased,
    canShowUnreleased,
    latestVersion,
    isLatestVersion,
    currentVersion,
    fetchData,
  };
}

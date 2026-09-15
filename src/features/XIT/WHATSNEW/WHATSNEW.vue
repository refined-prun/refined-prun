<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunLink from '@src/components/PrunLink.vue';
import PrunButton from '@src/components/PrunButton.vue';
import getBrowserVersion from '@src/utils/browser-version';
import fa from '@src/utils/font-awesome.module.css';
import { ChangelogRelease } from './changelog-data';
import { useChangelog } from './use-changelog';
import { splitChangelogItem } from './changelog-links';
import { loadVanillaCommands, VanillaCommand } from '@src/infrastructure/prun-ui/vanilla-commands';

const $style = useCssModule();

const featureIds = new Set(features.registry.map(x => x.id));
const vanillaCommands = shallowRef<ReadonlyMap<string, VanillaCommand>>(new Map());
async function loadCommands() {
  try {
    vanillaCommands.value = await loadVanillaCommands();
  } catch (error) {
    console.error('Failed to load commands for WHATSNEW', error);
  }
}

void loadCommands();

function linkifyItem(item: string) {
  return splitChangelogItem(item, {
    featureIds,
    getXitCommand: xit.get,
    vanillaCommands: vanillaCommands.value,
  });
}

const selections = ['Report a bug', 'Make a suggestion', 'Ask a question', 'Ask a forum question'];

function onClick(selection: number) {
  const newIssueUrl = new URL('https://github.com/refined-prun/refined-prun/issues/new');
  if (selection === 0) {
    newIssueUrl.searchParams.set('template', '1_bug_report.yml');
    newIssueUrl.searchParams.set('version', config.version.toString());
    newIssueUrl.searchParams.set('browser', getBrowserVersion());
  } else if (selection === 1) {
    newIssueUrl.searchParams.set('template', '2_feature_request.yml');
  } else if (selection === 2) {
    newIssueUrl.searchParams.set('template', '3_discussion.md');
  } else if (selection === 3) {
    window.open(
      'https://com.prosperousuniverse.com/t/refined-prun-qol-extension-for-prosperous-universe/6760/9999',
    );
    return;
  }
  window.open(newIssueUrl);
}

const {
  changelog,
  loading,
  failed,
  showUnreleased,
  canShowUnreleased,
  latestVersion,
  isLatestVersion,
  currentVersion,
  fetchData,
} = useChangelog(config.version);

function versionHighlightClass(release: ChangelogRelease) {
  if (release.version !== currentVersion.value) {
    return undefined;
  }
  return isLatestVersion.value ? null : $style.notCurrentVersion;
}
</script>

<template>
  <div>
    <div :class="$style.changelogHeader">
      <div :class="$style.versionHeader">
        <div>
          Thanks for using Refined PrUn version:
          <span
            :class="[
              isLatestVersion ? $style.currentVersion : $style.notCurrentVersion,
              $style.changelogConfigVersion,
            ]">
            {{ config.version }}
          </span>
        </div>
        <PrunButton v-if="canShowUnreleased" inline dark @click="showUnreleased = !showUnreleased">
          {{ showUnreleased ? 'Hide Unreleased' : 'Show Unreleased' }}
        </PrunButton>
      </div>
      <div
        role="status"
        :class="
          !loading &&
          (failed || !isLatestVersion ? $style.notCurrentVersion : $style.currentVersion)
        ">
        <div v-if="loading">Loading the latest changelog…</div>
        <div v-else-if="failed">
          Could not load the latest changelog. Showing bundled release notes.
          <PrunButton inline primary @click="fetchData">Retry</PrunButton>
        </div>
        <div v-else-if="isLatestVersion">You have the latest version!</div>
        <div v-else-if="latestVersion">
          You currently don't have the latest version, you may need to update manually.
        </div>
        <div v-else>The latest released version is not available.</div>
      </div>
      <div>
        <PrunButton
          v-for="(selection, indexSelection) in selections"
          :key="indexSelection"
          :class="[$style.prunLink, $style.prunButton]"
          primary
          @click="onClick(indexSelection)">
          {{ selection }}
          <span :class="fa.solid">{{ '\uf08e' }}</span>
        </PrunButton>
      </div>
    </div>
    <table :class="$style.changelogTable">
      <tbody>
        <template v-for="release in changelog" :key="release.version">
          <tr :class="versionHighlightClass(release)">
            <td colspan="2" :class="$style.tableTdVersionHeader">
              <SectionHeader :class="$style.tableSectionHeader">
                {{ release.version }}
              </SectionHeader>
            </td>
          </tr>
          <tr
            v-for="section in release.sections"
            :key="section.category"
            :class="versionHighlightClass(release)">
            <td>{{ section.category }}</td>
            <td>
              <div v-for="(item, index) in section.items" :key="index">
                -
                <template v-for="(part, partIndex) in linkifyItem(item)" :key="partIndex">
                  <PrunLink
                    v-if="part.command"
                    inline
                    :command="part.command"
                    :auto-submit="part.autoSubmit">
                    {{ part.text }}
                  </PrunLink>
                  <strong v-else-if="part.bold">{{ part.text }}</strong>
                  <span v-else>{{ part.text }}</span>
                </template>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style module>
.versionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
}

.tableSectionHeader {
  padding-left: 8px;
  margin: 0;
}

.tableTdVersionHeader {
  padding: 0;
}

.changelogTable tbody td:nth-child(2n + 1),
.changelogTable tbody tr:nth-child(2n)::after,
.changelogTable tbody tr:hover td {
  background-color: transparent;
}

.changelogTable tbody tr {
  td div:first-child {
    padding-top: 2px;
  }

  td div {
    padding-bottom: 2px;
  }
}

.changelogHeader > div {
  padding: 4px;
}

.changelogConfigVersion {
  padding-left: 2px;
  padding-right: 2px;
}

.prunButton {
  margin-right: 4px;
}

.prunLink {
  + .prunLink {
    margin-right: 4px !important;
    margin-left: 0 !important;
  }

  display: inline;
  margin-bottom: 1px;
  margin-top: 1px;
}

.notCurrentVersion {
  background-color: rgba(247, 166, 0, 0.175);
}

.currentVersion {
  background-color: rgba(92, 184, 92, 0.175) !important;
}
</style>

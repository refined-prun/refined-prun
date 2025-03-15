<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunLink from '@src/components/PrunLink.vue';
import PrunButton from '@src/components/PrunButton.vue';

const selections = [
  'Report a bug',
  'Make a suggestion',
  'Ask a github question',
  'Ask a forum question',
];
const selectionUrls = [
  'https://github.com/refined-prun/refined-prun/issues/new?template=1_bug_report.yml',
  'https://github.com/refined-prun/refined-prun/issues/new?template=2_feature_request.yml',
  'https://github.com/refined-prun/refined-prun/issues/new?template=3_discussion.md',
  'https://com.prosperousuniverse.com/t/refined-prun-qol-extension-for-prosperous-universe/6760',
];

function onClick(selection: number) {
  window.open(selectionUrls[selection]);
}

const loading = ref(true);
const error = ref(false);

interface Version {
  version: string;
  details: {
    NewCommands?: string[];
    Added?: string[];
    Changed?: string[];
    Fixed?: string[];
    Removed?: string[];
  };
}

function setupInfo(text: string): Partial<Version>[] | undefined {
  const changelogOutput: Partial<Version>[] = [];
  const patternVersions = /(## [0-9.Unreleased]+(?:\n(?!(## [0-9.]+|\n*$)).*)*)/g;
  const patternSections = /###\s*(.+?)\n\n([\s\S]*?)(?=###|\s*$)/gs;
  const changelogVersions = [...text.matchAll(patternVersions)].map(match => match[0]);
  for (const section of changelogVersions) {
    const version: Partial<Version> = {
      version: section.substring(0, section.indexOf('\n')).replace('## ', ''),
      details: {},
    };
    const changelogSections = [...section.matchAll(patternSections)].map(match => match[0]);
    for (const detail of changelogSections) {
      const info = detail.split('\n').slice(2);
      if (detail.startsWith('### New commands')) {
        version.details!.NewCommands = info;
      }
      if (detail.startsWith('### Added')) {
        version.details!.Added = info;
      }
      if (detail.startsWith('### Changed')) {
        version.details!.Changed = info;
      }
      if (detail.startsWith('### Fixed')) {
        version.details!.Fixed = info;
      }
      if (detail.startsWith('### Removed')) {
        version.details!.Removed = info;
      }
    }
    changelogOutput.push(version);
  }
  return changelogOutput;
}

const patternLink = /`[A-Z ]*`/g;
interface logType {
  type: string;
  text: string;
}

function processedLog(text: string) {
  const items: logType[] = [];
  const parts = text.split(patternLink);
  const links = [...text.matchAll(patternLink)].map(match => match[0]);

  for (let index = 0; index < parts.length; index++) {
    items.push({
      type: 'span',
      text: parts[index],
    });
    if (index < links.length) {
      items.push({
        type: 'PrunLink',
        text: links[index].replaceAll('`', ''),
      });
    }
  }
  return items;
}

const changelogURL =
  'https://raw.githubusercontent.com/refined-prun/refined-prun/main/CHANGELOG.md';

const changelog = ref<Partial<Version>[]>();

async function fetchData() {
  const response = await fetch(changelogURL);

  if (response.status === 200) {
    const text = await response.text();
    changelog.value = setupInfo(text);
  } else {
    error.value = true;
    console.error('Failed to fetch changelog from refined-prun');
    console.error(`${response.status}`);
  }
  loading.value = false;
}

fetchData();
const TESTVERSION = '25.2.27';
</script>

<template>
  <LoadingSpinner v-if="loading" :class="$style.loading" />
  <div v-else-if="!loading && error">Error fetching changelog from refined-prun</div>
  <div v-else>
    <table>
      <tr>
        <td colspan="2" :class="$style.header">
          <div>Thanks for using Refined PrUn version: {{ config.version }}</div>
          <div v-if="changelog![1].version! !== config.version" :class="$style.notCurrentVersion"
            >You currently don't have the latest version, you may need to update manually.</div
          >
          <div>
            <PrunButton
              v-for="(selection, indexSelection) in selections"
              :key="indexSelection"
              :class="[$style.prunLink, $style.button]"
              primary
              @click="onClick(indexSelection)"
              >{{ selection }}
              <div :class="$style.prunLink">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  fill="currentColor"
                  class="bi bi-box-arrow-up-right"
                  viewBox="0 0 16 16">
                  <path
                    fill-rule="evenodd"
                    d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                  <path
                    fill-rule="evenodd"
                    d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                </svg>
              </div>
            </PrunButton>
          </div>
        </td>
      </tr>
      <template v-for="(version, indexVersion) in changelog" :key="indexVersion">
        <tr>
          <td
            :key="indexVersion"
            colspan="2"
            :class="version.version === TESTVERSION ? $style.currentVersion : ''">
            <SectionHeader style="display: flex">
              {{ version.version }}
            </SectionHeader>
          </td>
        </tr>
        <tr v-for="(detail, indexDetail) in Object.keys(version.details!)" :key="indexDetail">
          <td
            :key="version.version"
            :class="version.version === TESTVERSION ? $style.currentVersion : ''">
            {{ detail }}
          </td>
          <td :class="version.version === TESTVERSION ? $style.currentVersion : ''">
            <template v-for="(log, indexLog) in version.details![detail]" :key="indexLog">
              <div>
                <template v-for="(item, indexItem) in processedLog(log)">
                  <template v-if="item.type === 'span'">
                    <span :key="indexItem"> {{ item.text }}</span>
                  </template>
                  <template v-if="item.type === 'PrunLink'">
                    <PrunLink :key="indexItem" :class="$style.prunLink" :command="item.text" />
                  </template>
                </template>
              </div>
            </template>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<style module>
.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.header > div {
  padding: 4px;
}

.button {
  margin-right: 4px;
}

.prunLink {
  + .prunLink {
    margin-right: 4px !important;
    margin-left: 0px !important;
  }

  display: inline;
  margin-bottom: 1px;
  margin-top: 1px;
}

.notCurrentVersion {
  background-color: rgba(217, 83, 79, 0.2);
}

.currentVersion {
  background-color: rgba(247, 166, 0, 0.05);
}

table > tr:nth-child(2n) {
  background-color: #222222;
}

table > tr:nth-child(2n + 1) {
  background-color: #23282b;
}
</style>

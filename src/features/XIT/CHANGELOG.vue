<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunLink from '@src/components/PrunLink.vue';
import PrunButton from '@src/components/PrunButton.vue';
import getBrowserVersion from '@src/utils/browser-version';

const classes = useCssModule();

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

interface Version {
  version: string;
  isUsedVersion: boolean;
  details: {
    [key: string]: string[];
  };
}

const lists = ['New commands', 'Added', 'Changed', 'Fixed', 'Removed'];
const patternVersions = /(## [0-9.Unreleased]+(?:\n(?!(## [0-9.]+|\n*$)).*)*)/g;
const patternSections = /###\s*(.+?)\n\n([\s\S]*?)(?=###|\s*$)/gs;
const patternDetails = /-.*/g;

function setupInfo(text: string) {
  const changelogOutput: Version[] = [];
  const changelogVersions = [...text.matchAll(patternVersions)].map(match => match[0]);
  for (const section of changelogVersions) {
    const versionName = section.substring(0, section.indexOf('\n')).replace('## ', '');
    const version = {
      version: versionName,
      isUsedVersion: versionName === config.version,
      details: {},
    };
    const changelogSections = [...section.matchAll(patternSections)].map(match => match[0]);
    for (const detail of changelogSections) {
      const info = [...detail.matchAll(patternDetails)].map(match => match[0]);
      for (const item of lists) {
        if (detail.startsWith(`### ${item}`)) {
          version['details'][item] = info;
        }
      }
    }
    changelogOutput.push(version);
  }
  return changelogOutput;
}

const patternLink = /`[A-Z ]*`/g;

function processedLog(text: string) {
  const items: object[] = [];
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

const changelog = ref<Version[]>();
const loading = ref(true);

async function fetchData() {
  const response = await fetch(
    'https://raw.githubusercontent.com/refined-prun/refined-prun/main/CHANGELOG.md',
  );
  if (response.status === 200) {
    const text = await response.text();
    changelog.value = setupInfo(text);
  } else {
    console.error('Failed to fetch changelog from refined-prun');
    console.error(`${response.status}`);
  }
  loading.value = false;
}

fetchData();
const isLatestVersionClass = () => {
  return changelog.value?.[1].isUsedVersion ? classes.currentVersion : classes.notCurrentVersion;
};
const isCurrentVersionClass = (version: Version) => {
  if (version.isUsedVersion && changelog.value?.[1].version === version.version) {
    return classes.currentVersion;
  } else if (version.version === config.version) {
    return classes.notCurrentVersion;
  } else {
    return '';
  }
};
</script>

<template>
  <LoadingSpinner v-if="loading" :class="$style.loading" />
  <div v-else-if="!loading && changelog">
    <table :class="$style.changelogTable">
      <tbody>
        <tr>
          <td colspan="2" :class="$style.changelogHeader">
            <div
              >Thanks for using Refined PrUn version:
              <span :class="[isLatestVersionClass(), $style.changelogVersion]">{{
                config.version
              }}</span>
            </div>
            <div v-if="isLatestVersionClass()" :class="$style.notCurrentVersion"
              >You currently don't have the latest version, you may need to update manually.</div
            >
            <div v-else :class="$style.currentVersion">You have the latest version!</div>
            <div>
              <PrunButton
                v-for="(selection, indexSelection) in selections"
                :key="indexSelection"
                :class="[$style.prunLink, $style.prunButton]"
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
          <tr :class="isCurrentVersionClass(version)">
            <td :key="indexVersion" colspan="2" :class="$style.tdVersionHeader">
              <SectionHeader :class="$style.sectionHeader">
                {{ version['version'] }}
              </SectionHeader>
            </td>
          </tr>
          <tr
            v-for="(detail, indexDetail) in Object.keys(version['details'])"
            :key="indexDetail"
            :class="isCurrentVersionClass(version)">
            <td :key="indexDetail">
              {{ detail }}
            </td>
            <td>
              <template v-for="log in version['details'][detail]" :key="indexLog">
                <div>
                  <template v-for="(item, indexItem) in processedLog(log)">
                    <template v-if="item['type'] === 'span'">
                      <span :key="indexItem"> {{ item['text'] }}</span>
                    </template>
                    <template v-if="item['type'] === 'PrunLink'">
                      <PrunLink :key="indexItem" :class="$style.prunLink" :command="item['text']" />
                    </template>
                  </template>
                </div>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <div v-else-if="!loading">Error fetching changelog from refined-prun</div>
</template>

<style module>
.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.sectionHeader {
  padding-left: 8px;
  margin: 0;
}

.tdVersionHeader {
  padding: 0;
}

.changelogTable tbody td:nth-child(2n + 1),
.changelogTable tbody tr:nth-child(2n)::after,
.changelogTable tbody tr:hover td {
  background-color: transparent;
}

.changelogTable tbody tr:not(:first-child) {
  td:not(.tdVersionHeader) {
    padding: 4px 8px 4px 8px;
  }

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

.changelogVersion {
  padding-left: 2px;
  padding-right: 2px;
}

.prunButton {
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
  background-color: rgba(247, 166, 0, 0.175);
}

.currentVersion {
  background-color: rgba(92, 184, 92, 0.175) !important;
}
</style>

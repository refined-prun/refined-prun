<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import PrunLink from '@src/components/PrunLink.vue';

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
    console.log('Error fetching changelog from refined-prun');
    throw new Error(`Failed to fetch changelog: ${response.status}`);
  }
  loading.value = false;
}

fetchData();
</script>

<template>
  <LoadingSpinner v-if="loading" :class="$style.loading" />
  <div v-else-if="!loading && error">Error fetching changelog from refined-prun</div>
  <div v-else>
    <table>
      <template v-for="version in changelog">
        <tr>
          <td colspan="2">
            <SectionHeader>
              {{ version.version }}
            </SectionHeader>
          </td>
        </tr>
        <tr
          v-for="detail in Object.keys(version.details)"
          v-if="version.details && Object.keys(version.details)">
          <td>
            {{ detail }}
          </td>
          <td>
            <template v-for="log in version.details[detail]">
              <div>
                <template v-for="item in processedLog(log)">
                  <span v-if="item.type === 'span'"> {{ item.text }}</span>
                  <PrunLink
                    v-if="item.type === 'PrunLink'"
                    :class="$style.PrunLink"
                    :command="item.text"></PrunLink>
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

.PrunLink {
  display: inline;
}

table > tr:nth-child(2n + 1) {
  background-color: #23282b;
}
</style>

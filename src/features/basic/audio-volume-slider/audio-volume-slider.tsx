import { setAudioVolume } from '@src/infrastructure/prun-ui/audio-interceptor';
import { userData } from '@src/store/user-data';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import AudioVolume from '@src/features/basic/audio-volume-slider/AudioVolume.vue';

function init() {
  watchEffect(() => {
    setAudioVolume(userData.settings.audioVolume);
  });
  subscribe($$(document, C.MenuHeadItem.menu), async menu => {
    const audioToggle = await $(menu, C.RadioItem.container);
    createFragmentApp(() => <AudioVolume />).after(audioToggle);
  });
}

features.add(
  import.meta.url,
  init,
  'Adds a volume slider to the game settings in the top-right corner of the screen.',
);

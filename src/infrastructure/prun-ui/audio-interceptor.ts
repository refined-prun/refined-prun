const audios = [] as HTMLAudioElement[];

export function initAudioInterceptor() {
  window.Audio = new Proxy(Audio, {
    construct(target: typeof Audio, args: [string?]) {
      const audio = new target(...args);
      audios.push(audio);
      return audio;
    },
  });
}

export function setAudioVolume(volume: number) {
  for (const audio of getValidAudios()) {
    audio.volume = volume;
  }
}

export function playAudio() {
  const audio = getValidAudios()[0];
  if (audio !== undefined) {
    if (audio.paused) {
      void audio.play();
    } else {
      audio.currentTime = 0;
    }
  }
}

function getValidAudios() {
  return audios.filter(x => x.src.startsWith(location.origin));
}

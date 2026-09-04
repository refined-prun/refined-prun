const audios = [] as HTMLAudioElement[];
let volume = undefined as number | undefined;

export function initAudioInterceptor() {
  window.Audio = new Proxy(Audio, {
    construct(target: typeof Audio, args: [string?]) {
      const audio = new target(...args);
      audios.push(audio);
      return audio;
    },
  });

  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (isValidAudio(this) && volume !== undefined) {
      this.volume = volume;
    }
    return origPlay.apply(this);
  };
}

export function setAudioVolume(newVolume: number) {
  volume = newVolume;
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
  return audios.filter(isValidAudio);
}

function isValidAudio(audio: HTMLAudioElement) {
  return audio.src.startsWith(location.origin);
}

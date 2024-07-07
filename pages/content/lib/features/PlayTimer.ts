import { Module } from '../ModuleRunner';
import { getLocalStorage, setSettings } from '../util';

export class PlayTimer implements Module {
  public frequency = 60;

  cleanup() {
    // Nothing to cleanup
  }

  run() {
    getLocalStorage('PMMGExtended', function (result) {
      result['PMMGExtended']['play_time'] = result['PMMGExtended']['play_time']
        ? result['PMMGExtended']['play_time'] + 15
        : 15;
      setSettings(result);
    });
  }
}

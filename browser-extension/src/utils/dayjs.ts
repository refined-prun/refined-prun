import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { Ref, ref } from 'vue';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const eachSecond = ref(0);
setInterval(() => eachSecond.value++, 1000);

const eachMinute = ref(0);
setInterval(() => eachMinute.value++, 60000);

export const dayjsEachSecond = () => live(dayjs(), eachSecond);
export const timestampEachSecond = () => live(Date.now(), eachSecond);

export const dayjsEachMinute = () => live(dayjs(), eachMinute);
export const timestampEachMinute = () => live(Date.now(), eachMinute);

function live<T>(value: T, tick: Ref<number>): T {
  // Touch reactive value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = tick.value;
  return value;
}

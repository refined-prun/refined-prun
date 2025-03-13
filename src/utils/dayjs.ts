import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isoWeek);

const eachSecond = ref(0);
setInterval(() => eachSecond.value++, 1000);

const eachMinute = ref(0);
setInterval(() => eachMinute.value++, 60000);

export const dayjsEachSecond = computed(() => live(dayjs(), eachSecond));
export const timestampEachSecond = computed(() => live(Date.now(), eachSecond));

export const timestampEachMinute = computed(() => live(Date.now(), eachMinute));

function live<T>(value: T, tick: Ref<number>): T {
  // Touch reactive value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = tick.value;
  return value;
}

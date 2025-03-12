import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isoWeek);

const eachMinute = ref(0);
setInterval(() => eachMinute.value++, 60000);

const eachHour = ref(0);
setInterval(() => eachHour.value++, 3600000);

export const dayjsEachMinute = computed(() => live(dayjs(), eachMinute));
export const timestampEachMinute = computed(() => live(Date.now(), eachMinute));

export const dayjsEachHour = computed(() => live(dayjs(), eachHour));
export const timestampEachHour = computed(() => live(Date.now(), eachHour));

function live<T>(value: T, tick: Ref<number>): T {
  // Touch reactive value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = tick.value;
  return value;
}

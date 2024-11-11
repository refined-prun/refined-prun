const stack: [string, number][] = [];

export function startMeasure(name: string) {
  if (__DEV__) {
    stack.push([name, performance.now()]);
  }
}

export function stopMeasure() {
  if (__DEV__) {
    const entry = stack.pop();
    if (entry) {
      performance.measure(entry[0], { start: entry[1] });
    }
  }
}

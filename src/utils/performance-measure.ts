const stack: [string, number][] = [];

export function startMeasure(name: string) {
  if (import.meta.env.DEV) {
    stack.push([name, performance.now()]);
  }
}

export function stopMeasure() {
  if (import.meta.env.DEV) {
    const entry = stack.pop();
    if (entry) {
      performance.measure(entry[0], { start: entry[1] });
    }
  }
}

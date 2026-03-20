interface Entry<T> {
  key: string;
  value: T;
  removed: boolean;
}

export class PrefixStore<T> {
  private entries: Entry<T>[] = [];
  private dirty = false;
  private removeDirty = false;

  insert(key: string, value: T) {
    this.entries.push({ key, value, removed: false });
    this.dirty = true;
  }

  remove(key: string) {
    this.ensureSorted();
    const idx = this.indexOf(key);
    if (idx >= 0) {
      this.entries[idx].removed = true;
      this.removeDirty = true;
    }
  }

  setAll(entries: { key: string; value: T }[]) {
    this.entries = entries.map(e => ({ key: e.key, value: e.value, removed: false }));
    this.dirty = true;
    this.removeDirty = false;
  }

  setOne(key: string, value: T) {
    this.ensureSorted();
    const idx = this.indexOf(key);
    if (idx >= 0) {
      this.entries[idx].value = value;
      this.entries[idx].removed = false;
    } else {
      this.entries.push({ key, value, removed: false });
      this.dirty = true;
    }
  }

  /** Returns the single value matching the prefix, or undefined if zero or 2+ matches. */
  findOne(prefix: string): T | undefined {
    this.ensureReadable();
    const start = this.lowerBound(prefix);
    let found: T | undefined;
    for (let i = start; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (!entry.key.startsWith(prefix)) {
        break;
      }
      if (found !== undefined) {
        return undefined;
      }
      found = entry.value;
    }
    return found;
  }

  /** Returns all values matching the prefix. */
  findAll(prefix: string): T[] {
    this.ensureReadable();
    const start = this.lowerBound(prefix);
    const result: T[] = [];
    for (let i = start; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (!entry.key.startsWith(prefix)) {
        break;
      }
      result.push(entry.value);
    }
    return result;
  }

  clear() {
    this.entries = [];
    this.dirty = false;
    this.removeDirty = false;
  }

  /** Compact + sort — used by reads that scan ranges. */
  private ensureReadable() {
    if (this.removeDirty) {
      this.entries = this.entries.filter(e => !e.removed);
      this.removeDirty = false;
    }
    this.ensureSorted();
  }

  /** Sort only — used by writes that tolerate removed entries. */
  private ensureSorted() {
    if (!this.dirty) {
      return;
    }
    this.entries.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
    this.dirty = false;
  }

  /** Binary search for the first entry >= key. */
  private lowerBound(key: string): number {
    let lo = 0;
    let hi = this.entries.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.entries[mid].key < key) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  /** Binary search for exact key, or -1. */
  private indexOf(key: string): number {
    const idx = this.lowerBound(key);
    if (idx < this.entries.length && this.entries[idx].key === key && !this.entries[idx].removed) {
      return idx;
    }
    return -1;
  }
}

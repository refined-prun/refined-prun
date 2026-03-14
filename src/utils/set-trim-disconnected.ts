declare global {
  interface Set<T> {
    trimDisconnected(this: Set<T & { isConnected: boolean }>): void;
  }
}

Set.prototype.trimDisconnected = function <T extends { isConnected: boolean }>(this: Set<T>): void {
  for (const element of this) {
    if (!element.isConnected) {
      this.delete(element);
    }
  }
};

export {};

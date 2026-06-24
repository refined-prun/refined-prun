export interface Observable<T> {
  subscribe(onNext: (element: T) => void): void;
}

export function subscribe<T>(subscription: Observable<T>, onNext: (item: T) => void) {
  subscription.subscribe(onNext);
}

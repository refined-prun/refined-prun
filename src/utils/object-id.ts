const ids = new WeakMap<object, number>();
let nextId = 0;

export function objectId(obj: object) {
  let id = ids.get(obj);
  if (id === undefined) {
    id = nextId++;
    ids.set(obj, id);
  }
  return id;
}

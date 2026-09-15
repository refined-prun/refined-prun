import { describe, expect, it } from 'vitest';
import {
  createGroupMapGetter,
  createMapGetter,
} from '@src/infrastructure/prun-api/data/create-map-getter';

describe('createMapGetter', () => {
  it('finds a named ship when another ship has no name, including after a rename', () => {
    const ships = ref([{ name: 'Gas Man 1' }, { name: null }, { name: undefined }]);
    const getByName = createMapGetter(ships, x => x.name);

    expect(getByName('gas man 1')).toBe(ships.value[0]);
    expect(getByName(null)).toBeUndefined();
    expect(getByName(undefined)).toBeUndefined();

    ships.value[1].name = 'New name';
    expect(getByName('NEW NAME')).toBe(ships.value[1]);

    ships.value[1].name = null;
    expect(getByName('New name')).toBeUndefined();
    expect(getByName('Gas Man 1')).toBe(ships.value[0]);
  });

  it('keeps valid aliases when an item also has missing keys', () => {
    const items = ref([{ keys: [null, 'Cargo', undefined, 'Fuel'] }]);
    const getByKey = createMapGetter(items, x => x.keys);

    expect(getByKey('cargo')).toBe(items.value[0]);
    expect(getByKey('fuel')).toBe(items.value[0]);
    expect(getByKey('missing')).toBeUndefined();
  });
});

describe('createGroupMapGetter', () => {
  it('groups valid keys when other items have missing keys', () => {
    const items = ref([{ name: null }, { name: 'Cargo' }, { name: undefined }, { name: 'CARGO' }]);
    const getByName = createGroupMapGetter(items, x => x.name);

    expect(getByName('cargo')).toEqual([items.value[1], items.value[3]]);
    expect(getByName('missing')).toBeUndefined();
  });
});

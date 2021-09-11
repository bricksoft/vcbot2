export class ObjectMap<K extends string | number | symbol, V> {
  private _map: Record<K, V> = Object.create(null);
  private _keys: Set<K> = new Set();

  clear() {
    this._keys.clear();
    this._map = Object.create(null);
  }

  get(key: K) {
    return this._map[key];
  }

  set(key: K, value: V) {
    this._keys.add(key);
    this._map[key] = value;
  }

  has(key: K) {
    return this._keys.has(key);
  }

  delete(key: K) {
    this._keys.delete(key);
    delete this._map[key];
  }

  keys() {
    return this._keys.values();
  }

  values() {
    const t = this;
    return (function* values(): Generator<V> {
      for (const key of t._keys) {
        yield t._map[key];
      }
    })();
  }

  entries() {
    const t = this;
    return (function* values(): Generator<[K, V]> {
      for (const key of t._keys) {
        yield [key, t._map[key]];
      }
    })();
  }
}

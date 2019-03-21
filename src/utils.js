/* eslint-disable no-restricted-syntax */
export function each(obj, iterator) {
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator);
  } else if (obj.length === +obj.length) {
    for (let i = 0, l = obj.length; i < l; i += 1) {
      iterator(obj[i], i, obj);
    }
  } else {
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        iterator(obj[key], key, obj);
      }
    }
  }
}

/**
 * Gather an array of key/value for all properties within an object
 * @param {Object} obj - The object to explore.
 * @param {string[]} ignoreProps - An array pf property names to exclude from the result.
 */
export function spelunkObject(obj, ignoreProps) {
  const kv = [];
  // eslint-disable-next-line guard-for-in
  for (const prop in obj) {
    // eslint-disable-next-line no-empty
    if (ignoreProps.indexOf(prop) > -1) {
    } else {
      kv.push({
        key: prop,
        value: obj[prop],
      });
    }
  }
  return kv;
}

export function map(obj, iterator) {
  const results = [];
  // Not using strict equality so that this acts as a
  // shortcut to checking for `null` and `undefined`.
  if (obj == null) {
    return results;
  }
  if (Array.prototype.map && obj.map === Array.prototype.map) { return obj.map(iterator); }
  each(obj, (value, index, list) => results.push(iterator(value, index, list)));
  return results;
}

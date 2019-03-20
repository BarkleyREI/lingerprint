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

export function extendSoft(target, source) {
  if (source == null) { return target; }
  let value;
  let key;
  // eslint-disable-next-line guard-for-in
  for (key in source) {
    value = source[key];
    if (value != null && !(Object.prototype.hasOwnProperty.call(target, key))) {
      // eslint-disable-next-line no-param-reassign
      target[key] = value;
    }
  }
  return target;
}

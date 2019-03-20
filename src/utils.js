export default function each(obj, iterator) {
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator);
  } else if (obj.length === +obj.length) {
    for (let i = 0, l = obj.length; i < l; i += 1) {
      iterator(obj[i], i, obj);
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        iterator(obj[key], key, obj);
      }
    }
  }
}

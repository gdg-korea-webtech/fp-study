export function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

export function isTooShort(length) {
  return function(value) {
    return value.length < length;
  }
}

export function isTooLong(length) {
  return function(value) {
    return value.length > length;
  }
}
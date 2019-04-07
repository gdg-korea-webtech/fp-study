
function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

function isTooShort(value, length) {
  return value.length < length
}

function isTooLong(value, length) {
  return value.length > length
}

const read = (document, selector) => {
  () => document.querySelector(selector).value;
}

export {
  isEmpty,
  isTooShort,
  isTooLong,
};
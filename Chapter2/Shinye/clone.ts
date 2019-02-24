const clone = (original: any) => {
  if (isTypeObject(original)) {
    const clone = getObjectConstruct(original);
    return cloneObject(original, clone);
  }
  return original;
};

const isTypeObject = (value: any) => {
  if (typeof value !== 'object') {
    return false;
  }
  return true;
};

const getObjectConstruct = (value: Object) => {
  return value.constructor();  
};

const cloneObject = (original: Object, clone: Object) => {
  for (const v in original) {
    clone[v] = original[v];        
  }

  return clone;
};
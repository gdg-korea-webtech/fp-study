const clone = (original: any) => {
  if (isTypeArray(original)) {
    return [ ...original ];
  }
  if (isTypeObject(original)) {
    return { ...original }
  }
  return original;
};

const isTypeObject = (value: any) => {  
  return typeof value === 'object' 
};

const isTypeArray = (value: any) => {
  return Array.isArray(value);
}

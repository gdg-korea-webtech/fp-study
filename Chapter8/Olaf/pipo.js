const memoize = fn => {
  let cache = {};
  return num => {
    if (cache[num]) {
      console.log(`cache: ${cache[num]}`);
      return cache[num];
    } else {
      const result = fn(num);
      cache[num] = result;
      return result;
    }
  };
};

const fibonacci = memoize(num => {
  if (num == 1 || num == 2) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
});

console.log(fibonacci(5));
